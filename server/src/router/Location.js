const express = require('express');
const router = express.Router();
const controller = require('../controller/locationController');

// إضافة IP واسم لجدول معين
router.post('/locations/:table', controller.addLocation);

// استقبال قائمة IPs والبحث عنها في الجداول الثلاثة
router.post('/locations/search/ips', controller.findIpsInTables);

module.exports = router;
