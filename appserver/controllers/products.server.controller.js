/**
 * Created by DEEPAK.SHARMA on 10/3/2015.
 */

var Product = require('../models/product.server.model.js');

var get = function (req, res) {
    var result = {};
    Product.find().exec(function (err, results) {
        result = results;
        res.status(200).json(result);
        console.log(results);
    });
};

var post = function (req, res) {

    console.log('starting processing post request...');

    var entry = new Product({
        name: req.body.name,
        details: req.body.details
    });

    entry.save();
    console.log(entry);

    res.status(301).json('posted sucessfully');
};

var productsController = {
    get: get,
    post: post
};

module.exports = productsController;






