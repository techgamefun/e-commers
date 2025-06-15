const express = require("express");
const {
  createProduct,
  getallProducts,
} = require("../controller/product.controller");
const router = express.Router();
const { upload } = require("../middleware/upload.middleware");

router.post("/create", upload.array("images", 10), createProduct);
router.get("/products", getallProducts);

module.exports = router;
