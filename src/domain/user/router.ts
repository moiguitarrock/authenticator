import { Router } from 'express';
import { checkSchema } from 'express-validator';

import * as controller from './controller';
import { SignupSchema } from './request-schema';
import validate from '../../router/middleware/validate';

export const router = Router();

router.post('/signup', checkSchema(SignupSchema, ['body']), validate, controller.signUp);
// router.post('/signin', (req, res) => {});

export default router;
