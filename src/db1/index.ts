import { env } from '@/env';
import * as schema from './schema';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Add some debug logging
console.log(
  'Connecting to database with URL:',
  env.DATABASE_URL.replace(/:.*@/, ':****@')
);

let database: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === 'production') {
  pg = postgres(env.DATABASE_URL);
  database = drizzle(pg, { schema });
} else {
  if (!(global as any).database!) {
    pg = postgres(env.DATABASE_URL);
    (global as any).database = drizzle(pg, { schema });
  }
  database = (global as any).database;
}

export { database, pg };
