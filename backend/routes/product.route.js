const express = require("express");
const { createProduct } = require("../controller/product.controller");
const router = express.Router();
const { upload } = require("../middleware/uploadMiddleware");

router.post("/create", upload.single("image"), createProduct);

module.exports = router;
