import { Router } from 'express';
import { checkSchema } from 'express-validator';

// import * as controller from './controller';
// import { } from './request-schema';
import validate from '../../router/middleware/validate';

export const router = Router();

router.get('/', (req, res) => {
    console.log('here', req.user);
    res.status(200).json({ ok: 'ok'})
});

export default router;
