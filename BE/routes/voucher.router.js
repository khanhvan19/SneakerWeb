const express = require('express');
const voucherController = require('../controllers/voucher.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, voucherController.getAll)
    .post(voucherController.create);

router.route('/:id')
    .get(voucherController.getOneVoucher)
    .put(voucherController.updateOneVoucher)
    .delete(voucherController.deleteOneVoucher);

router.route('/hide/:id')
    .put(voucherController.toggleStatus);

module.exports = router;
