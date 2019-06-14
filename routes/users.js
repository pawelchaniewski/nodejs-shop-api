const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");

router.get("/:userId", getUser, (req, res) => {
  return res.json(res.user);
});

router.get("/", async (req, res) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(200).json(users);
});

router.get("/:userId/orders", getUser, getOrders, (req, res) => {
  // const response = res.orders.map(obj => {
  //   order: obj._id;
  // });
  return res.json(res.orders);
});

// Middleware - get single user
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Middleware - get single order
async function getOrders(req, res, next) {
  let orders;
  const user = res.user;
  try {
    orders = await Order.findByUserId(user._id);
    if (orders == null) {
      return res.status(404).json({ message: "No orders found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.orders = orders;
  next();
}

module.exports = router;
