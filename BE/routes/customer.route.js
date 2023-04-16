const express = require('express');
const customerController = require('../controllers/customer.controller');
const tokenController = require('../controllers/refreshToken.controller')
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudEmployee } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, customerController.getAllCustomer)

router.route('/:id')
    .get(customerController.getOneCustomer)
    .put(uploadCloudEmployee.single('avatar'), customerController.updateInfoCustomer)
    .delete(customerController.deleteCustomer);

router.route('/lock/:id')
    .put(customerController.toggleStatus);

router.route('/register')
    .post(customerController.register);

router.route('/login')
    .post(customerController.login);

router.route('/refresh')
    .post(tokenController.requestRefreshToken);

router.route('/logout')
    .post(customerController.logout);
    
router.route('/forgot-password')
    .post(customerController.sendMailVerifyResetPassword);

router.route('/reset-password/:id/:token')
    .get(customerController.verifyTokenResetPassword);

router.route('/reset-password/:id')
    .post(customerController.resetPassword);

module.exports = router;
