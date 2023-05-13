const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/product-count')
    .get(dashboardController.getCountProduct);

router.route('/customer-count')
    .get(dashboardController.getCountCustomer);

router.route('/order-count')
    .get(dashboardController.getCountOrder);

router.route('/product-by-brand')
    .get(dashboardController.countProductByBrand);

router.route('/statistic-import')
    .get(dashboardController.statisticImport);

router.route('/order-by-date')
    .post(dashboardController.countOrderByDate);

router.route('/potential-customer')
    .post(dashboardController.potentialCustomer)

router.route('/bestseller')
    .post(dashboardController.bestSellerProduct)

module.exports = router;
