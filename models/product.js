const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    required: false,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    required: false,
    default: "/assets/images/noimg.jpg"
  }
});

module.exports = mongoose.model("Product", productSchema);
