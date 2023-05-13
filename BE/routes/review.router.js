const express = require('express');
const reviewController = require('../controllers/review.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')
const { uploadCloudReview } = require('../middlewares/uploaderImage')

router.route('/')
    .get(verifyAccessToken, reviewController.getAll)
    .post(uploadCloudReview.array('images', 6), reviewController.create);
     
router.route('/product/:id')
    .get(reviewController.getOverviewByProduct)
    .post(reviewController.getReviewsByProduct)
    
router.route('/customer')
    .get(reviewController.getReviewsByCustomer)

router.route('/:id')
    .put(reviewController.changeStatus)

module.exports = router;
