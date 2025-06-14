const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

class CloudinaryService {
  static async uploadFromBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "buffer-uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  static async uploadFromPath(filePath) {
    return await cloudinary.uploader.upload(filePath);
  }
}

module.exports = CloudinaryService;
