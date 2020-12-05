import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';

dotenv.config();

const databaseConfig = { connectionString: process.env.HEROKU_DATABASE_URL };
const pool = new Pool(databaseConfig);

export default pool;