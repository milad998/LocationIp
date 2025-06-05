const pool = require('../DB/db');

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


const getAllIPsAndNames = async () => {
  const tables = ['al_tabaqa', 'al_raqqa', 'kobani'];
  const results = [];

  for (const table of tables) {
    const queryResult = await pool.query(`SELECT ip, name FROM ${table}`);
    queryResult.rows.forEach(row => {
      results.push({
        table,
        ip: row.ip,
        name: row.name
      });
    });
  }

  return results;
};


const deleteDeviceByName = async (name) => {
  const tables = ['al_tabaqa', 'al_raqqa', 'kobani'];
  for (const table of tables) {
    await pool.query(`DELETE FROM ${table} WHERE name = $1`, [name]);
  }
};


module.exports = {
  getAllFromTable,
  insertIntoTable,
  findNamesByIps,
  getAllIPsAndNames,
  deleteDeviceByName,
  insertIntoTabaqa,
  findNamesByIpsTabaqa,
  deleteDeviceByNameTabaqa
};
