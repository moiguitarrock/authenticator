import { Request, Response, NextFunction } from 'express';

export const withTryCatch = (callback: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await callback(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };