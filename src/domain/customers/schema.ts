import {
  mysqlTable,
  varchar,
  bigint,
  datetime,
  date,
  decimal,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

import { users } from '../user/schema';

export const customers = mysqlTable('customers', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('userId', { mode: 'number' })
    .references(() => users.id)
    .notNull(),
  phone: varchar('phone', { length: 256 }).notNull(),
  birthday: date('birthday').notNull(),
  rating: decimal('rating', { precision: 1 }), // compound value calculated once a new rating is inserted in ratings table
  createdAt: datetime('createdAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
