const express = require("express");
const router = express.Router();

router.get("/:userId", getUser, (req, res) => {
  return res.json(res.user);
});

router.get("/:userId/orders", getUser, getOrder, (req, res) => {
  return res.json(res.order);
});

// Middleware - get single user
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Middleware - get single user
async function getOrder(req, res, next) {
  let order;
  const user = res.user;
  try {
    order = await Order.findOne({
      user: user._id
    });
    if (order == null) {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.order = order;
  next();
}

module.exports = router;
