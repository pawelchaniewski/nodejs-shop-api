const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

// Single cart route (use header auth)
router.get("/", authUser, getCart, (req, res) => {
  res.json(res.cart);
});

// Single cart route (use header auth)
router.post("/", authUser, getCart, async (req, res) => {
  let product;
  const user = res.user;
  let cart = res.cart;
  try {
    product = await Product.findById(req.body.productId);
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const order = {
    productId: product._id,
    count: req.body.count
  };

  try {
    if (!cart) {
      const newCart = new Cart({
        products: [order],
        userId: user._id
      });
      cart = await newCart.save();
    } else {
      console.log(cart.products);
      await Cart.update(
        {
          _id: cart._id,
          "products.productId": order.productId
        },
        {
          $inc: { "products.$.count": order.count }
        },
        {
          upsert: true
        }
      );
      cart = await Cart.findById(cart._id);
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware - get single cart
async function getCart(req, res, next) {
  let cart;
  const user = res.user;
  try {
    cart = await Cart.findOne({
      userId: user._id
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cart = cart;
  next();
}

// Middleware - authenticate user
// NOTE: I'm using header instead of cookies for simplicity sake
async function authUser(req, res, next) {
  let user;
  // TIP: DON'T USE camelCase in headers keys
  let userId = req.headers["userid"];
  if (!userId) {
    return res.status(400).send({ message: "Invalid userid or not provided!" });
  }

  try {
    user = await User.findById(userId);

    if (user == null) {
      return res.status(401).send({ message: "UserId not found" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;
