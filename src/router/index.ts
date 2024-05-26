import { Express } from 'express'
import userRouter from '../domain/user/router'
// TODO: Add auth to private routes
// import isAuth from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const prefix = `/v1/api`;

export default (app: Express) => {
    app.use(`${prefix}/users`, userRouter);

    // controllers error handling
    app.use(errorHandler);
};