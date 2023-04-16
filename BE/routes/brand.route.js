const express = require('express');
const brandController = require('../controllers/brand.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudBrand } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, brandController.getAll)
    .post(uploadCloudBrand.single('logo'), brandController.create);

router.route('/public')
    .get(brandController.getAll)
    
router.route('/:slug')
    .get(brandController.getOneBySlug)

router.route('/:id')
    .put(uploadCloudBrand.single('logo'), brandController.updateOneBrand)
    .delete(brandController.deleteOneBrand);

router.route('/hide/:id')
    .put(brandController.toggleStatus);


module.exports = router;
