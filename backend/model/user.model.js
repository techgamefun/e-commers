const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema(
  {
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
      required: [true, "phone number is required"],
      validate: {
        validator: function (v) {
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
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
    address: {
      // Combined billing and shipping address
      type: addressSchema,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

// Middleware: Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error); // Handle error
    }
  }
  next();
});

// Middleware: Hash password for findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    try {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    } catch (error) {
      return next(error); // Handle error
    }
  }
  next();
});

// Method: Verify password
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
