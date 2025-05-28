const express = require('express');
const router = express.Router();
const controller = require('../controller/locationController');

// لا تضف ":" بعد كلمة "add" — هذا خطأ
// الصحيح:
router.post('/locations/:table', controller.addLocation);

router.post('/locations/search/ips', controller.findIpsInTables);
router.get("/all",controller.fetchDevices);
router.delete("/ip/:name",controller.deleteDevice);
router.post("/location/add-tabaqa",controller.addLocationTabaqa);
router.delete("location/tabaqa-del/:name",controller.deleteDeviceTabaqa);
router.get("location/",controller.findIpsInTablesTabaqa);
module.exports = router;
