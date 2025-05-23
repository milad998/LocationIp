const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const locationRoutes = require('./router/Location');
const createTables = require('./model/Initdb');

app.use(express.json());
app.use('/api', locationRoutes);

// استدعاء إنشاء الجداول عند بدء التشغيل
createTables();

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
