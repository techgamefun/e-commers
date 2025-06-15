const validator = require("validator");

// Input validation helper
exports.validateSignupInput = (data) => {
  const errors = [];

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!data.phone || !validator.isMobilePhone(data.phone)) {
    errors.push("Valid phone number is required");
  }

  return errors;
};
