const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

// List all orders
router.get("/", authUser, getOrders, (req, res) => {
  return res.json(res.orders);
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
  const user = res.user;
  const items = req.body.items || [];
  const order = new Order({
    items: items,
    user: user._id
  });

  try {
    const newOrder = await order.save();
    return res.status(201).json(newOrder);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get items in order
router.get("/:orderId/items", authUser, getOrder, async (req, res) => {
  if (!res.order) {
    return res.status(404).json({ message: "Order not found!" });
  }

  return res.json(res.order.items);
});

// Get single item in order
router.get(
  "/:orderId/items/:productId",
  authUser,
  getOrder,
  async (req, res) => {
    if (!res.order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const existingItem = res.order.items.find(
      item => item.product === req.params.productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found!" });
    }

    return res.json(existingItem);
  }
);

// Add item to order
// TODO: Make it work, find solution to validate input and adding up amount of ordered products
router.post("/:orderId/items", authUser, getOrder, async (req, res) => {
  const currentOrder = res.order;
  const currentOrderItems = currentOrder.items;
  const requestOrderItems = req.body;
  let updatedOrderItems;

  if (!requestOrderItems || !(requestOrderItems instanceof Array)) {
    return res
      .status(400)
      .json({ message: "Request is not valid array or empty!" });
  }

  if (currentOrderItems == null || currentOrderItems.length === 0) {
    console.log("Tutaj");
    updatedOrderItems = [...requestOrderItems];
  } else {
    updatedOrderItems = requestOrderItems.map(function(newItem) {
      const existingItem = currentOrderItems.find(
        item => item.product === newItem.product
      );

      let updatedItem;

      if (existingItem) {
        updatedItem = existingItem;
        updatedItem.count += newItem.count;
      } else {
        updatedItem = newItem;
      }

      console.log(updatedItem);
      return updatedItem;
    });
  }

  try {
    // console.log(res.order.items);
    // console.log(updatedOrderItems);

    // res.order.items = updatedOrderItems;
    // currentOrder = await res.order.save();
    await Order.findOneAndUpdate(
      { _id: currentOrder._id },
      {
        $set: { items: updatedOrderItems }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  return res.json(updatedOrderItems);
});

// Edit item in order
router.patch("/:orderId/items/:productId", authUser, async (req, res) => {
  const currentOrder = res.order;
  const currentOrderItems = currentOrder.items;
  const existingItemIndex = currentOrderItems.findIndex(
    item => item.product === req.params.productId
  );

  if (existingItemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const existingItem = currentOrderItems[existingItemIndex];

  const updatedItem = {
    product: existingItem.product,
    quantity:
      req.body.quantity != null ? req.body.quantity : existingItem.quantity
  };

  const updatedOrderItems = currentOrderItems.splice(existingItemIndex, 1);
  updatedOrderItems.push(updatedItem);
  res.order.items = updatedOrderItems;

  try {
    const updatedOrder = await res.order.save();
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Remove order
router.delete("/:orderId", authUser, async (req, res) => {
  try {
    await res.order.remove();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(204);
});

// Remove item from order
router.delete("/:orderId/items/:productId", authUser, async (req, res) => {
  try {
    currentOrder.items.pull({ product: req.params.productId });
    currentOrder = await currentOrder.save();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(204);
});

// Middleware - get single order
async function getOrder(req, res, next) {
  let order;
  const user = res.user;
  try {
    order = await Order.findOne({ _id: req.params.orderId, user: user._id });
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
