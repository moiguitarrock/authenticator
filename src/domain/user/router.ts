import { Router } from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './controller';
import { SignupSchema, SigninSchema } from './request-schema';
import validate from '../../router/middleware/validate';
import { withTryCatch } from '../../router/middleware/utils';

export const router = Router();

router.post(
  '/signup',
  checkSchema(SignupSchema, ['body']),
  validate,
  withTryCatch(controller.signUp),
);
router.post('/signin', checkSchema(SigninSchema, ['body']), validate, withTryCatch(controller.signIn));
router.post('/refresh', withTryCatch(controller.refresh));
router.post('/logout', withTryCatch(controller.logout));

export default router;
