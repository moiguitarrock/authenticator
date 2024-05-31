import { Response } from 'express';
import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';

import { User } from './schema';
import { update } from './dao';

const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION as string;
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION as string;
const COOKIE_FINGERPRINT_KEY = process.env.COOKIE_FINGERPRINT_KEY as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

const getAccessJwtToken = (user: Partial<User>): string => {
  const payload = {
    userId: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRATION || '1h',
  });

  return token;
};

const getRefreshJWTToken = (user: Partial<User>, fingerprint: string): string => {
  const payload = {
    userId: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    fingerprint,
  };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRATION || '7d',
  });

  return token;
};

/**
 * Generate and set a new fingerprint into a httpOnly cookie and return a hashed version of the same
 * @param {Response} Request response to for setting a httpOnly cookie with an unique fingerprint on it
 */
const setFingerprintCookie = (res: Response): string => {
  // generate fingerprint
  const fingerprint = cryptoRandomString({ length: 50, type: 'alphanumeric' });

  // set server side cookie with fingerprint
  res.cookie(COOKIE_FINGERPRINT_KEY, fingerprint, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    // TODO: add this if the env is production
    // secure: true,
    // domain: 'halpme.ee'
  });

  // generate a hashed version of the fingerprint
  const hashedFingerprint = getHashedString(fingerprint);

  return hashedFingerprint;
};

/**
 * Generates access and refresh token with a hashed fingerprint on it.
 * Updates generated refresh token into user DB
 * @param {number} userId ID of the user to be logged in
 * @param {Partial<User>} User Claims to be stored in the access and refresh tokens
 * @param {Response} Request response to for setting a httpOnly cookie with an unique fingerprint on it
 */
export const generateTokensAndFingerprint = async (
  userId: number,
  user: Partial<User>,
  res: Response,
): Promise<{ access: string; refresh: string }> => {
  // generate access token
  const access = getAccessJwtToken(user);

  // set fingerprint cookie and get a hashed version of the same
  const hashedFingerprint = setFingerprintCookie(res);

  // add the hashed version of the fingerprint to the refresh token claims
  const refresh = getRefreshJWTToken(user, hashedFingerprint);

  // store the refresh token into the DB
  await update(userId, { refreshToken: refresh });

  return { access, refresh };
};

export const getHashedString = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
