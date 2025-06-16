const Product = require("../model/product.model");
const CloudinaryService = require("../services/cloudinaryService");
const { validateProductInput } = require("../utils/validator.util");
const { sanitizeProductInput } = require("../utils/sanitize.util");

// Controller for creating product
exports.createProduct = async (req, res, next) => {
  try {
    // Sanitizing Product Input data
    const sanitizeData = sanitizeProductInput(req.body);

    // Validating Product Input Data
    const validationError = validateProductInput(sanitizeData);

    if (validationError.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationError,
      });
    }

    const { title, description, basePrice, currency, stock, discount } =
      sanitizeData;

    // Get images alt texts data from request body
    const { imageAltTexts } = req.body;

    // 2. Check if image files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided." });
    }

    const uploadedImageDetails = [];

    // 3. Loop through each uploaded file from req.files
    for (const [index, file] of req.files.entries()) {
      const imageBuffer = file.buffer;

      // Upload each image buffer to Cloudinary
      const cloudinaryResult = await CloudinaryService.uploadFromBuffer(
        imageBuffer
      );

      // Store the URL and public_id from Cloudinary for your database
      uploadedImageDetails.push({
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        // You might want to get altText per image.
        // If imageAltTexts is an array, you'd use imageAltTexts[index]
        altText: imageAltTexts?.[index]
          ? imageAltTexts[index]
          : `${title} image ${index + 1}`,
        order: index + 1, // Simple ordering based on upload order
        isPrimary: index === 0, // Mark the first image as primary
      });
    }

    // Check for duplicate product titles (optional business rule)
    const existingProduct = await Product.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this title already exists",
      });
    }

    const newProduct = new Product({
      title,
      description,
      basePrice,
      currency,
      stock,
      discount,
      images: uploadedImageDetails,
    });

    // Save the product to the database
    await newProduct.save();

    // Send success response
    res.status(201).json({
      message: "Product created successfully!",
      product: newProduct.toObject(),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "An internal server error occurred." });
    next(error);
  }
};

exports.getallProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .select("title description basePrice images discount stock ")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments(),
    ]);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error });
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body; // Get the _id from the request body
    console.log(productId);

    if (!productId) {
      return res
        .status(400)
        .json({ message: "Product ID is required in the request body." });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully!", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

exports.updateProducts = async (req, res, next) => {
  try {
    const { _id, ...updateData } = req.body; // Get _id and the rest of the update data

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Product ID is required in the request body." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully!", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};
