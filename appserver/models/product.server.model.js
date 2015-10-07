var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: String,
    details: String,
    createdDate : {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);
