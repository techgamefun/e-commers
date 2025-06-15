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

// Product Input validation helper
exports.validateProductInput = (data) => {
  const errors = [];

  // Required fields validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push("Product title is required");
  } else if (data.title.trim().length > 150) {
    errors.push("Product title must not exceed 150 characters");
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push("Product description is required");
  } else if (data.description.trim().length > 500) {
    errors.push("Product description must not exceed 500 characters");
  }

  // Price validation
  if (!data.basePrice && data.basePrice !== 0) {
    errors.push("Base price is required");
  } else if (typeof data.basePrice !== "number" || data.basePrice < 0) {
    errors.push("Base price must be a non-negative number");
  }

  // Currency validation
  const allowedCurrencies = ["INR", "USD", "EUR", "GBP", "AED"];
  if (
    data.currency &&
    !allowedCurrencies.includes(data.currency.toUpperCase())
  ) {
    errors.push(`Currency must be one of: ${allowedCurrencies.join(", ")}`);
  }

  // Stock validation
  if (
    data.stock !== undefined &&
    (typeof data.stock !== "number" || data.stock < 0)
  ) {
    errors.push("Stock must be a non-negative number");
  }

  // Discount validation (if provided)
  if (data.discount) {
    if (data.discount.amountOffPaise !== undefined) {
      if (
        typeof data.discount.amountOffPaise !== "number" ||
        data.discount.amountOffPaise < 0
      ) {
        errors.push("Discount amount must be a non-negative number");
      }
    }

    if (data.discount.percentOff !== undefined) {
      if (
        typeof data.discount.percentOff !== "number" ||
        data.discount.percentOff < 0 ||
        data.discount.percentOff > 100 ||
        !Number.isInteger(data.discount.percentOff)
      ) {
        errors.push(
          "Discount percentage must be a whole number between 0 and 100"
        );
      }
    }

    if (
      data.discount.validUntil &&
      !validator.isISO8601(data.discount.validUntil)
    ) {
      errors.push("Discount valid until date must be in ISO 8601 format");
    }

    // Ensure discount doesn't exceed product price
    if (
      data.discount.amountOffPaise &&
      data.discount.amountOffPaise >= data.basePrice
    ) {
      errors.push(
        "Discount amount cannot be greater than or equal to base price"
      );
    }
  }

  return errors;
};
