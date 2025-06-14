const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/DB");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");

dotenv.config();

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send("hello World");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on", process.env.PORT);
});
