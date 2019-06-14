if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
// No need for bodyparser in Express v4.16 onwards
// const bodyParser = require("body-parser");
// Use builtin parser

const seed = require("./seed");

// Routers
const indexRouter = require("./routes/index");
const productRouter = require("./routes/products");
const orderRouter = require("./routes/orders");
const userRouter = require("./routes/users");

// If you want to prevent public stack trace - set env or NODE_ENV to production
// app.set("env", "production");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);

// Custom middleware for elegant JSON parse error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    res.status(400).send({ code: 400, message: `Bad request ${err.body}` });
  } else {
    next();
  }
});

const dbAddress = process.env.DATABASE_URL;
const dbOptions = { useNewUrlParser: true };
mongoose.connect(dbAddress, dbOptions);

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", async () => {
  if (process.env.SEED_DB_FLAG) {
    console.log("Seeding DB...");
    await seed.eraseDatabase();
    await seed.createUsers();
    await seed.createProducts();
  }
  console.log("Connected to DB!");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running...");
});
