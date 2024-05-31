import {
  mysqlTable,
  varchar,
  bigint,
  datetime,
  mysqlEnum,
  decimal,
  json,
  unique,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

import { providers } from '../providers/schema';
import { CATEGORIES } from '../../utils/constants';

interface ScheduleSlot {
  uid: string,
  date: Date;
  startTime: string;
  endTime: string;
  status: 'free' | 'booked' | 'confirmed';
  customerId?: number;
}

export const providerCategories = mysqlTable(
  'provider_categories',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    providerId: bigint('providerId', { mode: 'number' }),
    // for adding new categoryName modify the constant and re-run the migrations
    categoryName: mysqlEnum('categoryName', CATEGORIES).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    fee: decimal('fee', { precision: 2 }).notNull(),
    // docs for json manipulation: https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-remove
    schedule: json('schedule').$type<ScheduleSlot[]>(),
    skills: json('skills').$type<string[]>().default([]),
    createdAt: datetime('createdAt', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: datetime('updatedAt', { mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    unq: unique('provider_id_category_name_unique_idx').on(
      table.providerId,
      table.categoryName,
    ),
  }),
);

export type ProviderCategory = typeof providerCategories.$inferSelect;
export type NewProviderCategory = typeof providerCategories.$inferInsert;
