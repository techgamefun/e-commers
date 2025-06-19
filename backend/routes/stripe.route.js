// Backend API endpoint (Node.js/Express)
const express = require("express");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51RaZclA7DhClz7UguAI1gXTXJqfzCmqFRwus89R663OCdh83kPIZR3iptBwuYIYjCW1VdTMswEQCrKg7WeU6MbHK00UIlBZ02z"
); // Use environment variable for security
const router = express.Router();
const Product = require("../model/product.model");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { currency = "inr", productId } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }

    // Find the product in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    // Validate product has a valid price
    const price = product.sellPrice || product.basePrice;
    if (!price || price <= 0) {
      return res.status(400).json({
        error: "Product must have a valid price",
      });
    }


    const amountInCents = Math.round(parseFloat(price) * 100);

    // Create a PaymentIntent with the product amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        productId: productId.toString(),
        productName: product.title || product.name || "Unknown Product",
        productPrice: price.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
      // Optional: Add description for better tracking
      description: `Purchase of ${product.title || product.name || "Product"}`,
    });

    // Log for debugging (remove in production)
    console.log(
      `Payment Intent created: ${paymentIntent.id} for product: ${product.title} - $${price}`
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
      currency: currency,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    // Handle specific errors
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid product ID format",
      });
    }

    if (error.type === "StripeCardError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to create payment intent. Please try again.",
    });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);

        const productId = paymentIntent.metadata.productId;
        const productName = paymentIntent.metadata.productName;

        console.log(
          `Product ${productName} (ID: ${productId}) purchased successfully`
        );

        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

module.exports = router;
