const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Single products route
router.get("/get/:productId", async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.productId });
    res.json(product);
  } catch {
    res.json({ error: "Error getting product!" });
  }
});

// All products route
router.get("/list", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch {
    res.json({ error: "Error listing products!" });
  }
});

// Add product route
router.post("/add", async (req, res) => {
  const product = new Product({
    name: req.body.name
  });

  try {
    const newProduct = await product.save();
    res.json({
      id: newProduct.id,
      status: "Success"
    });
  } catch {
    res.json({ error: "Error creating product!" });
  }
});

// TODO: Delete product route
router.delete("/delete/:productId", async (req, res) => {
  try {
    const result = await Product.deleteOne({
      _id: req.params.productId
    });

    res.json({
      message: result
    });
  } catch {
    res.json({ error: "Error deleting product!" });
  }
});

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
