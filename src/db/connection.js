import knex from 'knex';
import knexConfig from '../../knexfile.js';

export const db = knex(knexConfig);

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

export default db;
