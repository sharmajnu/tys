/**
 * Created by DEEPAK.SHARMA on 10/3/2015.
 */
var express = require('express');
var router = express.Router();

var productController = require('./controllers/products.server.controller.js');
var quizController = require('./controllers/quiz.server.controller.js');

router.get('/products', productController.get);
router.post('/products', productController.post);

router.get('/quizzes', quizController.get);
router.post('/quizzes', quizController.post);

module.exports = router;