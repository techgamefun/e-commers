const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/DB");

dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("hello World");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on", process.env.PORT);
});
