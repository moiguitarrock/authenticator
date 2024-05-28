import { Request, Response, NextFunction } from 'express';
import { HttpError, AuthError } from '../../utils/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof AuthError) {
    return res
      .status(err.statusCode || 401)
      .json({ message: err.message, code: err.code });
  }

  if ('sqlMessage' in err && 'code' in err) {
    return res.status(400).json({ message: err.sqlMessage, code: err.code });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
