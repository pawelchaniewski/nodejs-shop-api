const mongoose = require("mongoose");

const orderDetailsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    min: [1, "Too few"]
  },
  total: {
    type: Number
  }
});

const orderSchema = new mongoose.Schema({
  items: [orderDetailsSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Order", orderSchema);
