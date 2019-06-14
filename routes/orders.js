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
router.post("/:orderId/items", authUser, getOrder, async (req, res) => {
  // const currentOrder = res.order;
  // const currentOrderItems = [...currentOrder.items];
  const requestOrderItem = req.body;

  if (res.order.items == null || res.order.items.length === 0) {
    updatedOrderItems = [...res.order.items, requestOrderItem];
  } else {
    let itemUpdated = false;
    updatedOrderItems = res.order.items.map(function(item) {
      const newItem = item.toObject();
      if (item.product.equals(req.body.product)) {
        newItem.quantity += requestOrderItem.quantity;
        itemUpdated = true;
      }
      return newItem;
    });

    if (!itemUpdated) {
      updatedOrderItems = [...res.order.items, requestOrderItem];
    }
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: res.order._id },
      {
        $set: { items: updatedOrderItems }
      },
      { new: true }
    );
    return res.json(updatedOrder.items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Edit item in order
router.patch(
  "/:orderId/items/:productId",
  authUser,
  getOrder,
  async (req, res) => {
    // const currentOrder = res.order;
    const currentOrderItems = [...res.order.items];
    const existingItemIndex = res.order.items.findIndex(item =>
      item.product.equals(req.params.productId)
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    const existingItem = res.order.items[existingItemIndex];

    const updatedItem = {
      product: existingItem.product,
      quantity:
        req.body.quantity != null ? req.body.quantity : existingItem.quantity
    };

    const updatedOrderItems = res.order.items.splice(existingItemIndex, 1);
    updatedOrderItems.push(updatedItem);
    res.order.items = updatedOrderItems;

    try {
      const updatedOrder = await res.order.save();
      return res.status(200).json(updatedOrder.items);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

// Remove order
router.delete("/:orderId", authUser, getOrder, async (req, res) => {
  try {
    const result = await res.order.remove();
    return res.status(204).send(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Remove item from order
router.delete(
  "/:orderId/items/:productId",
  authUser,
  getOrder,
  async (req, res) => {
    try {
      const result = await Order.findOneAndUpdate(
        { _id: res.order._id },
        {
          items: { $pull: { product: req.params.productId } }
        }
      );
      return res.status(204).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

// Middleware - get single order
async function getOrder(req, res, next) {
  let order;
  const user = res.user;
  try {
    order = await Order.findOne({ _id: req.params.orderId, user: user._id });
    if (order == null) {
      return res.status(404).json({ message: "Order not found" });
    }
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
