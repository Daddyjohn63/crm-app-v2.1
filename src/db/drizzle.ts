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

export { database, pg };
