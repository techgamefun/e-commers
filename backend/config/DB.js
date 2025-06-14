const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//===========conecting to mongoDB using Mongoose================

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error(
      "MongoDB connection URI is missing. Please set MONGO_URI in your .env file."
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
