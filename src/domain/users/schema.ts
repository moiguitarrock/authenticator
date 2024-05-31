import {
  mysqlTable,
  varchar,
  bigint,
  datetime,
  mysqlEnum,
  json,
} from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';

import { addresses } from '../addresses/schema';
import { customers } from '../customers/schema';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  email: varchar('email', { length: 256 }).notNull().unique('idx_unique_email'),
  password: varchar('password', { length: 256 }).notNull(),
  role: mysqlEnum('role', ['customer', 'provider']).notNull(),
  firstName: varchar('firstName', { length: 256 }).notNull(),
  lastName: varchar('lastName', { length: 256 }).notNull(),
  refreshToken: varchar('refreshToken', { length: 1024 }).notNull(),
  profileImg: varchar('profileImg', { length: 50 }),
  identificationType: mysqlEnum('identificationType', [
    'passport',
    'residence',
    'citizenId',
  ]),
  languages: json('languages').$type<string[]>().default([]),
  createdAt: datetime('createdAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  addresses: many(addresses),
  customer: one(customers),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
