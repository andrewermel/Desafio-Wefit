import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export const runMigrations = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password =
    process.env.DB_PASSWORD || 'senha_root_123';
  const database = process.env.DB_NAME || 'wefit';
  const port = parseInt(process.env.DB_PORT || '3306');

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port,
  });

  console.log('✓ Connected to database');

  const migrationPath = path.join(
    __dirname,
    'migrations',
    'create_profiles_table.sql'
  );
  const sql = fs.readFileSync(migrationPath, 'utf8');

  await connection.execute(sql);
  console.log('✓ Tables created successfully');

  await connection.end();
  console.log('✓ Migration completed');
};

if (require.main === module) {
  runMigrations().catch(error => {
    console.error(
      '✗ Migration failed:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  });
}
