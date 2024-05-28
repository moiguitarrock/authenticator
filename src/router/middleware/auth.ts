import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../../utils/errors';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization = '' } = req.headers;

  const [_ = null, token = null] = authorization.match(/^Bearer (.+)$/) || [];

  if (!token) {
    throw new AuthError('No token, authorization denied', 'NO_TOKEN');
  }

  try {
    const userDecoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = userDecoded;
    next();
  } catch (err) {
    throw new AuthError('Access token is not valid', 'INVALID_ACCESS_TOKEN', 403);
  }
};
