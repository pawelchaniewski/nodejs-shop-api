if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Routers
const indexRouter = require("./routes/index");
const productRouter = require("./routes/products");
const cartRouter = require("./routes/cart");

app.use(bodyParser.json());
app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

const dbAddress = process.env.DATABASE_URL;
const dbOptions = { useNewUrlParser: true };
mongoose.connect(dbAddress, dbOptions);

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to DB!"));

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running...");
});
