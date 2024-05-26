import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { NewUser } from './schema';
import { findByEmail, create } from './dao';
import { HttpError } from '../../utils/errors';

export async function signUp(req: Request, res: Response, next: NextFunction) {
    const userParams = req.body as NewUser;
    try {
        const [user] = await findByEmail(userParams.email);

        if (user) {
            throw new HttpError(400, 'Username already exists');
        }
        
        const salt = await bcrypt.genSalt(10);
        userParams.password = await bcrypt.hash(userParams.password, salt);
        
        const userId = await create(userParams);

        // TODO: automatically login with JWT
        
        res.status(201).json({ msg: 'User created successfully' });
    } catch (err: unknown) {
        next(err);
    }
    
}