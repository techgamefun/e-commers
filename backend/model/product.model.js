const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => v.startsWith("https://"),
      message: "Image URL must be HTTPS",
    },
  },
  public_id: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    maxlength: 125,
  },
  order: {
    type: Number,
    min: 0,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const productSchema = new mongoose.Schema(
  {
    // Product name
    title: {
      type: String,
      required: true,
      maxlength: 150,
    },

    // Product description
    description: {
      type: String,
      required: true,
      maxlength: 2000, // Increased for more detail
    },
    // Base price stored in paise to avoid floating-point issues (100 paise = 1 INR)
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      set: (Price) => Math.round(Price),
    },

    // Products images
    images: [imageSchema],

    // Currency information (ISO 4217 codes) with INR as default
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      enum: ["INR", "USD", "EUR", "GBP", "AED"],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Discount information
    discount: {
      amountOffPaise: {
        type: Number,
        min: 0,
        default: 0,
      },
      percentOff: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
        validate: {
          validator: Number.isInteger,
          message: "Discount percentage must be a whole number",
        },
      },
      validUntil: Date,
    },

    // GST (Goods and Services Tax) information - ADDED THIS SECTION
    gst: {
      rate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      includedInPrice: {
        type: Boolean,
        default: true, // Assuming price often includes GST by default
      },
      hsnCode: String, // Harmonized System of Nomenclature code
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// Virtual for computed sale price
productSchema.virtual("salePrice").get(function () {
  const amountDiscount = this.discount.amountOffPaise || 0;
  const percentDiscount =
    this.basePrice * ((this.discount.percentOff || 0) / 100);

  // Apply the highest discount type, if that's the intended logic
  const actualDiscount = Math.max(amountDiscount, percentDiscount);

  return Math.max(0, this.basePrice - actualDiscount);
});

// Virtual for formatted prices with Indian numbering system
productSchema.virtual("formattedBasePrice").get(function () {
  return formatCurrency(this.basePrice, this.currency);
});

productSchema.virtual("formattedSalePrice").get(function () {
  // Access the virtual 'salePrice' directly which returns rupees
  return formatCurrency(this.salePrice, this.currency);
});

// Virtual for price including GST (if not already included)
productSchema.virtual("finalPrice").get(function () {
  // Access the virtual 'salePrice' for the base of this calculation
  if (this.gst.includedInPrice) {
    return this.salePrice;
  } else if (this.gst.rate) {
    const gstAmount = this.salePrice * (this.gst.rate / 100);
    return Math.round(this.salePrice + gstAmount);
  }
  return this.salePrice;
});

productSchema.virtual("formattedFinalPrice").get(function () {
  // Access the virtual 'finalPrice' which returns paise
  return formatCurrency(this.finalPrice, this.currency);
});

// Indian-specific currency formatting
function formatCurrency(amount, currency) {
  // Default to INR if currency is not provided or invalid
  const validCurrency =
    currency && ["INR", "USD", "EUR", "GBP", "AED"].includes(currency)
      ? currency
      : "INR";

  try {
    if (validCurrency === "INR") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    // Fallback for other currencies
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // If formatting fails for any reason, return a simple formatted string
    return `${validCurrency} ${amount.toFixed(2)}`;
  }
}

module.exports = mongoose.model("Product", productSchema);
