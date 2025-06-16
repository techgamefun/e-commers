const express = require("express");
const {
  createProduct,
  getallProducts,
  deleteProduct,
  updateProducts,
} = require("../controller/product.controller");
const router = express.Router();
const { upload } = require("../middleware/upload.middleware");
const protect = require("../middleware/auth.middleware");

router.post("/create", protect, upload.array("images", 10), createProduct);
router.get("/products", getallProducts);
router.delete("/delete", protect, deleteProduct);
router.put("/update", protect, updateProducts);

module.exports = router;
