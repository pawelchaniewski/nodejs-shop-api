const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

// List all orders
router.get("/", authUser, getOrders, (req, res) => {
  if (!res.order) {
    return res.status(404).json({ message: "Order not found!" });
  }

  return res.json(res.order);
});

// Single order route (use header auth)
router.get("/:orderId", authUser, getOrder, (req, res) => {
  if (!res.order) {
    return res.status(404).json({ message: "Order not found!" });
  }

  return res.json(res.order);
});

// Create new order
router.post("/", authUser, async (req, res) => {
  const order = new Order({});
});

// Get items in order
router.get("/:orderId/items", authUser, async (req, res) => {
  // logic....
});

// Get single item in order
router.get("/:orderId/items/:itemId", authUser, async (req, res) => {
  // logic....
});

// Add item to order
router.post("/:orderId/items/:itemId", authUser, async (req, res) => {
  // logic....
});

// Edit item in order
router.patch("/:orderId/items/:itemId", authUser, async (req, res) => {
  // logic....
});

// Remove order
router.delete("/:orderId", authUser, async (req, res) => {
  // logic....
});

// Remove item from order
router.delete("/:orderId/items/:itemId", authUser, async (req, res) => {
  // logic....
});

// // Single order route (use header auth)
// router.post("/", authUser, getOrder, async (req, res) => {
//   let product;
//   const user = res.user;
//   let order = res.order;
//   try {
//     product = await Product.findById(req.body.productId);
//     if (product == null) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }

//   const order = {
//     productId: product._id,
//     count: req.body.count
//   };

//   if (!order) {
//     try {
//       const newOrder = new Order({
//         products: [],
//         userId: user._id
//       });
//       order = await newOrder.save();
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   }

//   const orderProducts = order.products;
//   let updatedOrderProducts;

//   if (!orderProducts || orderProducts.length === 0) {
//     updatedOrderProducts = [order];
//   } else {
//     let productUpdated = false;
//     updatedOrderProducts = orderProducts.map(item => {
//       if (item.productId.toString() === order.productId.toString()) {
//         item.count += order.count;
//         productUpdated = true;
//       }
//       return item;
//     });

//     if (!productUpdated) {
//       updatedOrderProducts = [...orderProducts, order];
//     }
//   }

//   order.products = updatedOrderProducts;
//   // await Order.update(
//   //   {
//   //     _id: order._id,
//   //     "products.productId": order.productId
//   //   },
//   //   {
//   //     $inc: { "products.$.count": order.count }
//   //   },
//   //   {
//   //     upsert: true
//   //   }
//   // );

//   try {
//     order = await order.save();
//     // order = await Order.findById(order._id);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }

//   return res.json(order);
// });

// Middleware - get single order
async function getOrder(req, res, next) {
  let order;
  const user = res.user;
  try {
    order = await Order.findById(req.params.orderId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.order = order;
  next();
}

// Middleware - get all orders
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
