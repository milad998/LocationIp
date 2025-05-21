const pool = require('../DB/db');

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS al_tabaqa (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(50),
        name VARCHAR(100)
      );
    `);
    console.log('✅ Table al_tabaqa created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS al_raqqa (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(50),
        name VARCHAR(100)
      );
    `);
    console.log('✅ Table al_raqqa created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS kobani (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(50),
        name VARCHAR(100)
      );
    `);
    console.log('✅ Table kobani created');
    
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

module.exports = createTables;
