const express = require('express');
const favoriteController = require('../controllers/favorite.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, favoriteController.getAllByCustomer)
    .post(favoriteController.toggleAddFavorite);

router.route('/:id')
    .put(favoriteController.removeProductFavorite);

module.exports = router;