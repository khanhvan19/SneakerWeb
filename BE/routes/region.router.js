const express = require('express');
const regionController = require('../controllers/region.controller');
const router = express.Router();

router.route('/province')
    .get(regionController.getProvinces);

router.route('/district/:id')
    .get(regionController.getDistricts);

router.route('/ward/:id')
    .get(regionController.getWards)

module.exports = router;
