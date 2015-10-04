/**
 * Created by DEEPAK.SHARMA on 10/3/2015.
 */
var express = require('express');
var router = express.Router();

var productController = require('./controllers/products.server.controller.js');

router.get('/products/', productController.get);
router.post('/products', productController.post);

module.exports = router;