const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db.dsixkdmqqqnyovkilmmz.supabase.co',
  database: 'postgres',
  password: 'ingrox_admin@123',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  console.log('Testing connection with discrete fields...');
  try {
    const client = await pool.connect();
    console.log('Successfully connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Time:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

test();
