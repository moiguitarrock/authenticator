import { Express } from 'express';
import usersRouter from '../domain/users/router';

import isAuth from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const prefix = `/v1/api`;

export default (app: Express) => {
  // public
  app.use(`${prefix}/users`, usersRouter);

  // private routes
  
  // controllers error handling
  app.use(errorHandler);
};
