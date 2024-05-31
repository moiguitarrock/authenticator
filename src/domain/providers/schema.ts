import {
  mysqlTable,
  varchar,
  bigint,
  datetime,
  text,
  json,
  date,
  decimal,
} from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';

import { users } from '../user/schema';
import { providerCategories } from '../providerCategories/schema';

export const providers = mysqlTable('providers', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('userId', { mode: 'number' })
    .references(() => users.id)
    .notNull(),
  phone: varchar('phone', { length: 256 }).notNull(),
  birthday: date('birthday').notNull(),
  bio: text('bio'),
  educationLevel: varchar('educationLevel', { length: 50 }),
  photosUID: json('photos').$type<string[]>(), // list of uid media reference
  rating: decimal('rating', { precision: 1 }), // compound value calculated once a new rating is inserted in ratings table (4.5)
  createdAt: datetime('createdAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const providersRelations = relations(users, ({ many }) => ({
  providerCategories: many(providerCategories),
}));

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
