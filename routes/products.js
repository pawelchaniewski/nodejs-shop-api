const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Single products route
router.get("/get/:productId", getProduct, (req, res) => {
  res.json(res.product);
});

// All products route
router.get("/list", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Add product route
router.post("/add", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    stock: req.body.stock || 0
  });

  try {
    const newProduct = await product.save();
    res.status(201).json({
      id: newProduct.id,
      message: "Success"
    });
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
});

// Update one product route
router.patch("/update/:productId", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }

  res.product.stock =
    req.body.stock != null ? req.body.stock : res.product.stock;

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
});

// TODO: Delete product route
router.delete("/delete/:productId", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
});

// Middleware - get single product
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.productId);
    if (product == null) {
      return res.status(404).json({ errorMessage: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ errorMessage: err.message });
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
