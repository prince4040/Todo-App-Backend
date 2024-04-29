const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
require("dotenv").config();

//mongodb connection
mongoose.connect(process.env.MONGODB_URI);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`app is listening on port ${PORT}`);
});
