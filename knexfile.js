
import dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './src/migrations'
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN),
    max: Number(process.env.DB_POOL_MAX),
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,  // Close idle connections faster
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200
  }
};
