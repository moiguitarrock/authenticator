import { mysqlTable, varchar, serial, datetime, mysqlEnum } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
    id: serial("id").primaryKey(),
    email: varchar('email', { length: 256 }).notNull().unique('idx_unique_email'),
    password: varchar('password', { length: 256 }).notNull(),
    role: mysqlEnum('role', ['customer', 'provider']).notNull(),
    firstName: varchar('firstName', { length: 256 }).notNull(),
    lastName: varchar('lastName', { length: 256 }).notNull(),
    createdAt: datetime('createdAt', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: datetime('updatedAt', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
