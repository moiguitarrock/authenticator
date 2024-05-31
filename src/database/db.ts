import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// all schemas here in order to allow queries builder: 
// ref: https://orm.drizzle.team/docs/rqb#querying
import * as users from '../domain/users/schema';
import * as addresses from '../domain/addresses/schema';
import * as customers from '../domain/customers/schema';
import * as providers from '../domain/providers/schema';
import * as providerCategories from '../domain/providerCategories/schema';

const config: { [key: string]: mysql.ConnectionOptions } = {
  development: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT) || 3036,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  test: {},
  production: {},
};

const environment = process.env.NODE_ENV || 'development';

export const connection = await mysql.createConnection(config[environment]);

export const db = drizzle(connection, {
  schema: { ...users, ...addresses, ...customers, ...providers, ...providerCategories },
  mode: 'default',
});
