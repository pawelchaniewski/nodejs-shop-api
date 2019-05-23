const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

// Single cart route (use header auth)
router.get("/:cartId", getCart, (req, res) => {
  res.json(res.cart);
});

// Middleware - get single cart
async function getCart(req, res, next) {
  let cart;
  try {
    cart = await Cart.findById(req.params.cartId);
    if (cart == null) {
      return res.status(404).json({ message: "Cart not found!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cart = cart;
  next();
}

module.exports = router;
