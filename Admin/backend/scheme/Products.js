const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: { _id: String, name: String },
    company: String,
    image: String,
});

module.exports = mongoose.model('Products', productsSchema);