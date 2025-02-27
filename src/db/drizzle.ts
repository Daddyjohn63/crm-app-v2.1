// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as schema from './schema';
// import { env } from 'process';

// export const sql = neon(process.env.DATABASE_URL!);
// export const database = drizzle(sql, { schema });

import { env } from '@/env';
import * as schema from './schema';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var database: PostgresJsDatabase<typeof schema> | undefined;
  var pg: ReturnType<typeof postgres> | undefined;
}

let database: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

function createDatabase() {
  try {
    if (env.NODE_ENV === 'production') {
      pg = postgres(env.DATABASE_URL, { max: 1 });
      database = drizzle(pg, { schema });
    } else {
      if (!global.database) {
        pg = postgres(env.DATABASE_URL, { max: 1 });
        global.pg = pg;
        global.database = drizzle(pg, { schema });
      }
      database = global.database;
      pg = global.pg!;
    }
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

createDatabase();

export { database, pg };
