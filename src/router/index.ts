import { Express } from 'express';
import userRouter from '../domain/user/router';
import categoriesRouter from '../domain/providerCategories/router';

import isAuth from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const prefix = `/v1/api`;

export default (app: Express) => {
  app.use(`${prefix}/users`, userRouter);

  // private routes
  app.use(`${prefix}/categories`, isAuth, categoriesRouter);

  // controllers error handling
  app.use(errorHandler);
};
