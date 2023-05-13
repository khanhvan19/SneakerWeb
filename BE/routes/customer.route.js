const express = require('express');
const customerController = require('../controllers/customer.controller');
const tokenController = require('../controllers/refreshToken.controller')
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudEmployee } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, customerController.getAllCustomer)

//AUTH
router.route('/register')
    .post(customerController.register);

router.route('/login')
    .post(customerController.login);

router.route('/refresh')
    .post(tokenController.requestRefreshCustomerToken);

router.route('/logout')
    .post(customerController.logout);

router.route('/change-password/:id')
    .put(customerController.changePassword);

//ADMIN PAGE
router.route('/lock/:id')
    .put(customerController.toggleStatus);

router.route('/:id')
    .get(customerController.getOneCustomer)
    .put(uploadCloudEmployee.single('avatar'), customerController.updateInfoCustomer)


//RESET PASSWORD
router.route('/forgot-password')
    .post(customerController.sendMailVerifyResetPassword);

router.route('/reset-password/:id/:token')
    .get(customerController.verifyTokenResetPassword);

router.route('/reset-password/:id')
    .post(customerController.resetPassword);

module.exports = router;
