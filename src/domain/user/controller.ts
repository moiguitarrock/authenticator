import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NewUser, User } from './schema';
import { findByEmail, create, findById } from './dao';
import { HttpError } from '../../utils/errors';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const userParams = req.body as NewUser;
  try {
    const [user] = await findByEmail(userParams.email);

    if (user) {
      throw new HttpError(400, 'Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    userParams.password = await bcrypt.hash(userParams.password, salt);

    const userId = await create(userParams);

    if (!userId) {
      throw new HttpError(400, 'Error creating user');
    }

    const newUser = await findById(userId);

    if (!newUser) {
      throw new HttpError(404, 'No user found');
    }

    const token = getJwtToken(newUser);

    res.status(201).json({ token });
  } catch (err: unknown) {
    next(err);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const [user] = await findByEmail(email);

    if (!user) {
      throw new HttpError(400, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpError(400, 'Invalid credentials');
    }

    const token = getJwtToken(user);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

// TODO: implement silent login

// set user claims and return a jwt
const getJwtToken = (user: User): string => {
  const payload = {
    userId: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  return token;
}

