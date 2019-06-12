const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");

const eraseDatabase = async () => {
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
};

const createUsers = async () => {
  const userAdmin = new User({
    name: "Admin"
  });

  const user1 = new User({
    name: "Bob"
  });

  const user2 = new User({
    name: "Alice"
  });

  await userAdmin.save();
  await user1.save();
  await user2.save();
};

const createProducts = async () => {
  const product1 = new Product({
    title: "Szynka",
    description: "Niezwykle aromatyczna szynka wieprzowa",
    price: 100,
    stock: 12,
    imageUrl:
      "http://esklep.niewiescin.pl/wp-content/uploads/2016/02/Szynka-Pyszna-2-600x330.png"
  });

  const product2 = new Product({
    title: "Kiełbasa",
    description: "Niezwykle aromatyczna kielbasa czosnkowana",
    price: 999,
    stock: 122,
    imageUrl:
      "https://cdn02.plentymarkets.com/s1wah6qoqrhj/item/images/2025/full/2025-Knoblauchwurst.jpg"
  });

  const product3 = new Product({
    title: "Pasztet",
    description: "Niezwykle aromatyczny pasztet z królika",
    price: 120,
    stock: 12,
    imageUrl:
      "http://esklep.niewiescin.pl/wp-content/uploads/2016/02/Pasztet-Wieprzowy-2-600x330.png"
  });

  await product1.save();
  await product2.save();
  await product3.save();
};

module.exports = { eraseDatabase, createUsers, createProducts };
