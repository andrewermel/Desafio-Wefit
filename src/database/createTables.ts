import mysql from 'mysql2/promise';

const CREATE_PROFILES_TABLE = `
CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('fisica', 'juridica') NOT NULL,
  cnpj VARCHAR(14) NULL,
  cpf VARCHAR(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  telephone VARCHAR(20) NULL,
  email VARCHAR(255) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  accepted_terms TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_email (email),
  UNIQUE KEY uq_cpf (cpf)
)`;

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

  await connection.execute(CREATE_PROFILES_TABLE);
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
