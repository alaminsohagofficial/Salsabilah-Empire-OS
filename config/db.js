const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL Connection Pool Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // যদি লোকাল বা নির্দিষ্ট ক্রডেনশিয়াল ব্যবহার করেন:
    // host: process.env.DB_HOST || 'localhost',
    // user: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASSWORD || 'your_password',
    // database: process.env.DB_NAME || 'salsabilah_pos',
    // port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL Database successfully.');
});

module.exports = pool;
