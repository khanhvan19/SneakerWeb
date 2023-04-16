const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, categoryController.getAll)
    .post(categoryController.create);

router.route('/public')
    .get(categoryController.getAll);

router.route('/:slug')
    .get(categoryController.getOneBySlug);

router.route('/:id')
    .put(categoryController.updateOneCategory)
    .delete(categoryController.deleteOneCategory);

router.route('/hide/:id')
    .put(categoryController.toggleStatus);

module.exports = router;
