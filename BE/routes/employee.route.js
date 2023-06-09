const express = require('express');
const employeeController = require('../controllers/employee.controller');
const tokenController = require('../controllers/refreshToken.controller')
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudEmployee } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, employeeController.getAllEmployees)
    .post(uploadCloudEmployee.single('avatar'), employeeController.create);

//AUTH
router.route('/login')
    .post(employeeController.login);

router.route('/refresh')
    .post(tokenController.requestRefreshToken);

router.route('/logout')
    .post(employeeController.logout);

router.route('/shipper-login')
    .post(employeeController.shipperLogin);

//ADMIN PAGE
router.route('/role')
    .get(verifyAccessToken ,employeeController.getEmployeeByRole)

router.route('/lock/:id')
    .put(employeeController.toggleStatus);

router.route('/permission/:id')
    .put(employeeController.updatePermission);
    
router.route('/:id')
    .get(employeeController.getOneEmployee)
    .put(uploadCloudEmployee.single('avatar'), employeeController.updateInfoEmployee)
    .delete(employeeController.deleteEmployee);
    
//RESET PASS
router.route('/forgot-password')
    .post(employeeController.sendMailVerifyResetPassword);

router.route('/reset-password/:id/:token')
    .get(employeeController.verifyTokenResetPassword);

router.route('/reset-password/:id')
    .post(employeeController.resetPassword)
    .put(employeeController.changePassword);

module.exports = router;
