const express = require('express');
const shippingController = require('../controllers/shipping.controller');
const router = express.Router();

router.route('/province')
    .get(shippingController.getProvinces);

router.route('/district')
    .post(shippingController.getDistricts);

router.route('/ward')
    .post(shippingController.getWards)

router.route('/service')
    .post(shippingController.getServices)

module.exports = router;
