const express = require("express");
const router = express.Router();
const { register } = require("../controller/auth.controller");

router.post("/register", register);
// router.post("/login");

module.exports = router;
