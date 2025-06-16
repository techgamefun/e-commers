const {
  getCart,
  addToCart,
  deleteToCart,
  updateToCart,
} = require("../controller/cart.controller");
const express = require("express");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protect, getCart);

router.post("/items", protect, addToCart);

router.delete("/items", protect, deleteToCart);

router.put("/items", protect, updateToCart);

module.exports = router;
