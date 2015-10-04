/**
 * Created by DEEPAK.SHARMA on 10/3/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: String,
    details: String,
    createdDate : {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);
