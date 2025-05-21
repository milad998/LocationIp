const pool = require('../DBb/db');

const getAllFromTable = async (table) => {
  const res = await pool.query(`SELECT * FROM ${table}`);
  return res.rows;
};

const insertIntoTable = async (table, ip, name) => {
  const res = await pool.query(
    `INSERT INTO ${table} (ip, name) VALUES ($1, $2) RETURNING *`,
    [ip, name]
  );
  return res.rows[0];
};

// دالة تبحث عن أسماء IPs في جدول معين
const findNamesByIps = async (table, ips) => {
  const placeholders = ips.map((_, idx) => `$${idx + 1}`).join(',');
  const query = `SELECT name FROM ${table} WHERE ip IN (${placeholders})`;
  const res = await pool.query(query, ips);
  return res.rows;
};

module.exports = {
  getAllFromTable,
  insertIntoTable,
  findNamesByIps,
};
