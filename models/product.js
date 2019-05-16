const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: false,
    default: 0
  }
});

module.exports = mongoose.model("Product", productSchema);
