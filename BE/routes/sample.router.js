const express = require('express');
const sampleController = require('../controllers/sample.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, sampleController.getAll)
    .post(sampleController.create);
    
router.route('/public')
    .get(sampleController.getAll)

router.route('/search')
    .get(sampleController.search)
    .post(sampleController.getOnePage);

router.route('/:id')
    .get(sampleController.getOneSample)
    .put(sampleController.updateOneSample)
    .delete(sampleController.deleteOneSample);

router.route('/hide/:id')
    .put(sampleController.toggleStatus);

module.exports = router;
