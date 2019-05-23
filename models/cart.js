const mongoose = require("mongoose");
const User = require("./user");

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      count: {
        type: Number,
        required: true
      }
    }
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

cartSchema.statics.findByUserId = function(userId, callback) {
  const query = this.findOne();

  User.findOne({ _id: userId }, function(error, user) {
    query.where({ userId: user._id }).exec(callback);
  });
  return query;
};

module.exports = mongoose.model("Cart", cartSchema);
