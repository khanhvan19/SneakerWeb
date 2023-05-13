const express = require('express');
const orderController = require('../controllers/order.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudDeliveryProof } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, orderController.getAll)
    .post(orderController.createOneOrder);

router.route('/customer')
    .get(verifyAccessToken, orderController.getOrderByCustomer)

router.route('/shipper/delivery')
    .get(orderController.getDeliveryOrderByShipper)

router.route('/shipper/success')
    .get(orderController.getSuccessOrderByShipper)

router.route('/cancel/:id')
    .put(orderController.cancelOneOrder)

router.route('/comfirm/:id')
    .put(orderController.confirmOneOrder)

router.route('/itinerary/:id')
    .put(uploadCloudDeliveryProof.single('proof'), orderController.updateItineraryOrder)

router.route('/success/:id')
    .put(orderController.comfirmSuccessOrder)

router.route('/:id')
    .get(orderController.getOneOrder)
    .put(orderController.updateStatusOrder)


module.exports = router;
