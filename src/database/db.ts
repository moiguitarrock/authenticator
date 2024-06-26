import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// all schemas here in order to allow queries builder: 
// ref: https://orm.drizzle.team/docs/rqb#querying
import * as users from '../domain/users/schema';

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
  schema: { ...users },
  mode: 'default',
});
