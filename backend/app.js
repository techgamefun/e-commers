const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/DB");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const cors = require("cors");

dotenv.config();

connectDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send("hello World");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on", process.env.PORT);
});
