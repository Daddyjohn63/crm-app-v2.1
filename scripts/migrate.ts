// import { neon } from '@neondatabase/serverless';
// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/neon-http';
// import { migrate } from 'drizzle-orm/neon-http/migrator';

// config({ path: '.env.local' });

// const sql = neon(process.env.DATABASE_URL!);

// const db = drizzle(sql);

// const main = async () => {
//   try {
//     await migrate(db, { migrationsFolder: 'drizzle' });
//     console.log('Migration successful');
//   } catch (error) {
//     console.error('Error during migration', error);
//     process.exit(1);
//   }
// };

// main();

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: 'drizzle'
    });
    console.log('Migration successful');
  } catch (error) {
    console.error('Error during migration', error);
    process.exit(1);
  }
}

main();
