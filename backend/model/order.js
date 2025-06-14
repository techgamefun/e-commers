const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid international phone number!`,
      },
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // phone optional
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid international phone number!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    roles: {
      type: [String],
      enum: ["user", "admin", "vendor"],
      default: ["user"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addresses: {
      billing: { type: addressSchema, required: false },
      shipping: { type: addressSchema, required: false },
    },
    avatarUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

// Export the User model
module.exports = mongoose.model("User", userSchema);
