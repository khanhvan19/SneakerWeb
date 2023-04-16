const express = require('express');
const importController = require('../controllers/import.controller');
const router = express.Router();

const { verifyAccessToken } = require('../middlewares/jwt-verify')

router.route('/')
    .get(verifyAccessToken, importController.getAll)
    .post(importController.create);
    
router.route('/:id')
    .get(importController.getOneImport)
    
module.exports = router;
