const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtOrder: {
      // Price in smallest currency unit (paise/cents)
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    // Order Identification
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order Contents
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    // Stripe Payment Fields
    stripe: {
      paymentIntentId: {
        type: String,
        index: true,
      },
      clientSecret: String,
      paymentMethodId: String,
      chargeId: String,
      refundId: String,
      receiptUrl: String,
      status: {
        type: String,
        enum: [
          "requires_payment_method",
          "requires_confirmation",
          "requires_action",
          "processing",
          "requires_capture",
          "canceled",
          "succeeded",
          "refunded",
        ],
        default: "requires_payment_method",
      },
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
orderSchema.virtual("formattedTotal").get(function () {
  return (this.total / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: this.currency,
  });
});

orderSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Pre-save hooks
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${(count + 1).toString().padStart(6, "0")}`;
  }

  if (this.isModified("items")) {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    );
    this.total = this.subtotal + this.shippingFee;
  }
  next();
});

// Methods
orderSchema.methods.createStripePaymentIntent = async function (stripe) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: this.total,
    currency: this.currency.toLowerCase(),
    metadata: { orderNumber: this.orderNumber },
    description: `Order ${this.orderNumber}`,
    shipping: this.shipping.address
      ? {
          address: {
            line1: this.shipping.address.street,
            city: this.shipping.address.city,
            postal_code: this.shipping.address.postalCode,
            country: this.shipping.address.country,
          },
          name: this.shipping.address.name,
          phone: this.shipping.address.phone,
        }
      : undefined,
  });

  this.stripe = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };

  return paymentIntent;
};

orderSchema.methods.processStripePayment = async function (
  paymentMethodId,
  stripe
) {
  const paymentIntent = await stripe.paymentIntents.confirm(
    this.stripe.paymentIntentId,
    { payment_method: paymentMethodId }
  );

  this.stripe.paymentMethodId = paymentMethodId;
  this.stripe.status = paymentIntent.status;

  if (paymentIntent.status === "succeeded") {
    this.status = "confirmed";
    this.stripe.chargeId = paymentIntent.latest_charge;
    this.stripe.receiptUrl = paymentIntent.charges.data[0]?.receipt_url;
  }

  return paymentIntent;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
