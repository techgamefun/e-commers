const {
  getCart,
  addToCart,
  deletToCart,
  updateToCart,
} = require("../controller/cart.controller");
const express = require("express");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getCart);

router.post("/items", addToCart);

router.delete("/items", deletToCart);

router.put("/items", updateToCart);

module.exports = router;
