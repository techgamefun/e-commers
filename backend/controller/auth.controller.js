const User = require("../model/user.model");
const { signToken } = require("../utils/jwt.util");
const { validateSignupInput } = require("../utils/validator.util");
const validator = require("validator");

//========== User Signup Controller ==========
exports.signup = async (req, res) => {
  // Input validation
  const validationErrors = validateSignupInput(req.body);

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  try {
    const { firstName, lastName, email, phone, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      address,
    });

    const token = signToken({ id: user._id });

    // Return success (don't expose user data)
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

//========== User Login Controller ==========
exports.login = async (req, res) => {
  //if the body is empty
  if (!req.body) {
    return res.status(400).json({
      message: "Please Provide Email and Password",
    });
  }

  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Valid email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Find user and include password for verification
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "user not found or Invalid email" });
    } else if (!(await user.verifyPassword(password))) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    const token = signToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};
