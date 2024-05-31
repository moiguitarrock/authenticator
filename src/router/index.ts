import { Express } from 'express';
import usersRouter from '../domain/users/router';
import providersRouter from '../domain/providers/router';
import customersRouter from '../domain/customers/router';
import categoriesRouter from '../domain/providerCategories/router';

import isAuth from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const prefix = `/v1/api`;

export default (app: Express) => {
  // public
  app.use(`${prefix}/users`, usersRouter);

  // private routes
  app.use(`${prefix}/providers`, isAuth, providersRouter);
  app.use(`${prefix}/customers`, isAuth, customersRouter);
  app.use(`${prefix}/provider-categories`, isAuth, categoriesRouter);

  // controllers error handling
  app.use(errorHandler);
};
