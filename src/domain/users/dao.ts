import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

import { db } from '../../database/db';
import { User, users, NewUser } from './schema';

export const findByEmail = (email: string): Promise<User[]> => {
  return db.select().from(users).where(eq(users.email, email));
};

export const create = async (newUser: NewUser): Promise<number | undefined> => {
  const result = await db.insert(users).values(newUser);
  return result[0].insertId;
};

export const findById = async (id: number): Promise<User | undefined> => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const update = async (id: number, user: Partial<User>): Promise<MySqlRawQueryResult> => {
  return db.update(users).set(user).where(eq(users.id, id));
};

export const cleanRefreshToken = async (refreshToken: string): Promise<MySqlRawQueryResult> => {
  return db.update(users).set({refreshToken}).where(eq(users.refreshToken, refreshToken));
};
