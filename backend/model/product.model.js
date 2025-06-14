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
    name: {
      type: String,
      required: true,
      maxlength: 150,
    },

    // Product description
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    // Base price stored in paise to avoid floating-point issues (100 paise = 1 INR)
    basePricePaise: {
      type: Number,
      required: true,
      min: 0,
      set: (paise) => Math.round(paise), // Ensure integer paise
      get: (paise) => (paise / 100).toFixed(2), // Convert to decimal rupees
    },

    // Products images
    images: imageSchema,
    // Currency information (ISO 4217 codes) with INR as default
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      enum: ["INR", "USD", "EUR", "GBP", "AED"], // Common currencies for Indian context
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
      discountCode: String,
    },

    // Computed sale price (virtual)
    salePricePaise: {
      type: Number,
      default: function () {
        const amountDiscount = this.discount.amountOffPaise || 0;
        const percentDiscount =
          this.basePricePaise * ((this.discount.percentOff || 0) / 100);
        return Math.max(
          0,
          this.basePricePaise - Math.max(amountDiscount, percentDiscount)
        );
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// Virtual for formatted prices with Indian numbering system
productSchema.virtual("formattedBasePrice").get(function () {
  return formatCurrency(this.basePricePaise / 100, this.currency);
});

productSchema.virtual("formattedSalePrice").get(function () {
  return formatCurrency(this.salePricePaise / 100, this.currency);
});

// Virtual for price including GST (if not already included)
productSchema.virtual("finalPricePaise").get(function () {
  if (this.gst.includedInPrice) return this.salePricePaise;
  return Math.round(this.salePricePaise * (1 + this.gst.rate / 100));
});

// Indian-specific currency formatting
function formatCurrency(amount, currency) {
  if (currency === "INR") {
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
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper method to apply discount
productSchema.methods.applyDiscount = function (discountCode) {
  // Logic to validate and apply discount code
  // Would typically query a discounts collection
};

module.export = mongoose.model("Product", productSchema);
