const express = require('express');
const addressControler = require('../controllers/address.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, addressControler.getAllByCustomer)
    .post(addressControler.create);

router.route('/default/:id')
    .put(addressControler.changeDefaultAddress)

router.route('/:id')
    .put(addressControler.updateOneAddress)
    .delete(addressControler.deleteOneAddress);

module.exports = router;
