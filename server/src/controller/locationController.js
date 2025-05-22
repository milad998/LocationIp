const model = require('../model/locationModel');
const pool = require("../DB/db")
// الوظيفة 1: إضافة IP واسم إلى جدول محدد
const addLocation = async (req, res) => {
  const { table } = req.params;
  const { ip, name } = req.body;

  try {
    const newEntry = await model.insertIntoTable(table, ip, name);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// الوظيفة 2: استقبال قائمة IPs والبحث عنها في الجداول الثلاثة
const findIpsInTables = async (req, res) => {
  const { ips } = req.body;

  if (!Array.isArray(ips) || ips.length === 0) {
    return res.status(400).json({ error: 'ips يجب أن تكون مصفوفة غير فارغة' });
  }

  const tables = ['al_tabaqa', 'al_raqqa', 'kobani'];
  let result = '';

  try {
    for (const table of tables) {
      const matches = await model.findNamesByIps(table, ips);
      if (matches.length > 0) {
        result += `\n${table}:\n`;
        for (const row of matches) {
          result += `• ${row.name}\n`;
        }
      }
    }
    res.send(result || 'لم يتم العثور على أي IP.');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllIPsAndNames = async () => {
  try {
    console.log("Starting to fetch data...");
    const tables = ['al_tabaqa', 'al_raqqa', 'kobani'];
    const results = [];

    for (const table of tables) {
      console.log(`Fetching from table: ${table}`);
      const queryResult = await pool.query(`SELECT ip, name FROM ${table}`);
      queryResult.rows.forEach(row => {
        results.push({
          table: table,
          ip: row.ip,
          name: row.name
        });
      });
    }

    console.log("Finished fetching data:", results);
    return results;
  } catch (err) {
    console.error('Error fetching data:', err);
    return [];
  }
};

module.exports = {
  addLocation,
  findIpsInTables,
  getAllIPsAndNames
};
