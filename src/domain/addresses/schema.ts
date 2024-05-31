import { mysqlTable, varchar, datetime, bigint } from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';

import { users } from '../users/schema';

export const addresses = mysqlTable('addresses', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  address: varchar('address', { length: 256 }).notNull(),
  zipCode: varchar('zipCode', { length: 256 }).notNull(),
  countryCode: varchar('countryCode', { length: 10 }).notNull(),
  countryName: varchar('countryName', { length: 256 }).notNull(),
  city: varchar('city', { length: 256 }).notNull(),
  userId: bigint('userId', { mode: 'number' })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: datetime('createdAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: datetime('updatedAt', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  address: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
