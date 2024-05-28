import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NewUser, User } from './schema';
import { findByEmail, create, findById, update } from './dao';
import { HttpError, AuthError } from '../../utils/errors';
import { generateTokensAndFingerprint, getHashedString } from './utils';

const COOKIE_FINGERPRINT_KEY = process.env.COOKIE_FINGERPRINT_KEY as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const userParams = req.body as NewUser;
  const [user] = await findByEmail(userParams.email);

  if (user) {
    throw new HttpError(400, 'Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  userParams.password = await bcrypt.hash(userParams.password, salt);

  userParams.refreshToken = '';
  const userId = await create(userParams);

  if (!userId) {
    throw new HttpError(400, 'Error creating user');
  }

  const userClaims: Partial<User> = {
    id: userId,
    role: userParams.role,
    firstName: userParams.firstName,
    lastName: userParams.lastName,
  };

  // login the user automatically
  const { access, refresh } = await generateTokensAndFingerprint(userId, userClaims, res);

  res.status(201).json({ token: { access, refresh } });
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as { email: string; password: string };

  const [user] = await findByEmail(email);

  if (!user) {
    throw new HttpError(400, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new HttpError(400, 'Invalid password');
  }

  const { access, refresh } = await generateTokensAndFingerprint(user.id, user, res);

  res.status(200).json({ token: { access, refresh } });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  // get the fingerprint from dedicated server cookie
  const cookieFingerprintUnHashed = req.cookies[COOKIE_FINGERPRINT_KEY];
  // ger the refresh_token (client side cookie)
  const refreshToken = req.cookies['refresh_token'];

  if (!cookieFingerprintUnHashed || !refreshToken) {
    throw new AuthError(
      'Missing refresh token or fingerprint',
      'MISING_REFRESH_TOKEN',
      401,
    );
  }

  let claims;
  try {
    // verify the refresh token and get claims
    claims = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError(
        'Refresh token has expired, refresh authentication not possible',
        'REFRESH_TOKEN_EXPIRED',
        401,
      );
    }

    throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN', 401);
  }

  const user = await findById(claims.userId);

  if (!user) {
    throw new AuthError('User not found', 'INVALID_USER', 401);
  }

  if (user.refreshToken !== refreshToken) {
    throw new AuthError('Wrong refresh token', 'INVALID_REFRESH_TOKEN', 401);
  }

  // get the hashed fingerprint
  const fingerprintFromClaimsHashed = claims.fingerprint;

  // hash the unhashed fingerprint from cookies with the one stored in the claims
  const fingerprintFromCookiesHashed = getHashedString(cookieFingerprintUnHashed);

  if (fingerprintFromClaimsHashed !== fingerprintFromCookiesHashed) {
    throw new AuthError(
      'fingerprint does not match - unable to refresh token',
      'WRONG_FINGERPRINT',
      401,
    );
  }

  const { access, refresh } = await generateTokensAndFingerprint(user.id, user, res);

  res.status(200).json({ token: { access, refresh } });
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  // clear the fingerprint httpOnly cookie
  res.clearCookie(COOKIE_FINGERPRINT_KEY);
  // remove the DB stored refresh token
  await update(req.user?.id, { refreshToken: '' });
  // TODO: Handle the revocation of the access token (logout).
  // Use a DB in order to allow multiple instances to check for revoked access token
  // and allow cleanup at centralized DB level.
  res.status(200).json({});
}
