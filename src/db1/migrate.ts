import 'dotenv/config';

import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { database, pg } from './index';
import { PostgresError } from 'postgres';

async function main() {
  console.log('Starting migration...');
  console.log(
    'Database URL:',
    process.env.DATABASE_URL?.replace(/:.*@/, ':****@')
  );

  try {
    console.log('Starting migration process...');
    await migrate(database, { migrationsFolder: 'drizzle' });
    console.log('Migration completed successfully');
  } catch (error) {
    if (error instanceof PostgresError) {
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        severity: error.severity,
        detail: error.detail,
        hint: error.hint
      });
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  } finally {
    await pg.end();
  }
}

main();
