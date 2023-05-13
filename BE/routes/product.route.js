const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, productController.getAll)
    .post(productController.create);

router.route('/name')
    .get(productController.getAllName)

router.route('/search')
    .get(productController.search)
    .post(productController.getOnePage);
    
router.route('/same-brand')
    .get(productController.getSimilarByBrand)
    
router.route('/best-seller')
    .get(productController.getBestSeller);

router.route('/distribute-brand')
    .get(productController.distributeByBrand)

router.route('/:id')
    .get(productController.getOneProduct)
    .delete(productController.deleteOneProduct)
    .put(productController.updateOneProduct);

router.route('/hide/:id')
    .put(productController.toggleStatus);




module.exports = router;
