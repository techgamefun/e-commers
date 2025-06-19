const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Memory storage (no disk writes)
const memoryStorage = multer.memoryStorage();

// Validate file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Configure Multer
exports.upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
