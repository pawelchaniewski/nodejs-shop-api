const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Single products route
router.get("/:productId", getProduct, (req, res) => {
  return res.json(res.product);
});

// All products route
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Add product route
router.post("/", authAdmin, async (req, res) => {
  const product = new Product({
    title: req.body.title,
    description: req.body.stock || "",
    price: req.body.price,
    stock: req.body.stock || 0,
    imageUrl: req.body.imageUrl
  });

  try {
    const newProduct = await product.save();
    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Update one product route
router.patch("/:productId", authAdmin, getProduct, async (req, res) => {
  res.product.title =
    req.body.title != null ? req.body.title : res.product.title;
  res.product.description =
    req.body.description != null
      ? req.body.description
      : res.product.description;
  res.product.price =
    req.body.price != null ? req.body.price : res.product.price;
  res.product.stock =
    req.body.stock != null ? req.body.stock : res.product.stock;
  res.product.imageUrl =
    req.body.imageUrl != null ? req.body.imageUrl : res.product.imageUrl;

  try {
    const updatedProduct = await res.product.save();
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// TODO: Delete product route
router.delete("/:productId", authAdmin, getProduct, async (req, res) => {
  try {
    const result = await res.product.remove();
    return res.status(204).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Middleware - admin auth
async function authAdmin(req, res, next) {
  const token = req.headers["token"] || req.headers["authorization"];
  if (!token)
    return res.status(400).send({ message: "Invalid token or not provided!" });

  try {
    // Admin token check logic...
    if (token !== "admin") {
      return res.status(401).send({ message: "Unauthenticated" });
    }
  } catch (err) {
    //if some other error
    return res.status(500).send({ message: err.message });
  }

  next();
}

// Middleware - get single product
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.productId);
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

// Add product route (old)
// router.post("/add", (req, res) => {
//   const product = new Product({
//     name: req.body.name
//   });
//   product.save((err, newProduct) => {
//     if (err) {
//       res.send({ error: err });
//     } else {
//       res.send({
//         id: newProduct.id,
//         status: "Success"
//       });
//     }
//   });
// });

module.exports = router;
