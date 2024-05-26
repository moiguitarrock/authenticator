import { db } from '../../database/db';
import { User, users, NewUser } from './schema';
import { eq } from 'drizzle-orm';

export const findByEmail = (email: string): Promise<User[]> => {
    return db.select().from(users).where(eq(users.email, email));
}

export const create = async (newUser: NewUser): Promise<number | undefined> => {
    const result = await db.insert(users).values(newUser);
    return result[0].insertId;
}