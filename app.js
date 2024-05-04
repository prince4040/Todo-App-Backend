const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const errMiddleware = require("./middlewares/errMiddleware");
require("dotenv").config();

//mongodb connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("mongodb connection successful");
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

//error Middleware
app.use(errMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`app is listening on port ${PORT}`);
});
