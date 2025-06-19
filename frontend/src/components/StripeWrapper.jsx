import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeWrapper = ({ product, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!product?.productId) {
        setError("Invalid product details.");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        const response = await fetch(`${apiUrl}/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currency: "usd",
            productId: product.productId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Unable to load payment form.");
        }
      } catch (err) {
        setError("Network error. Try again.");
        console.error("Stripe fetch error:", err);
      }
    };

    createPaymentIntent();
  }, [product?.productId]);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white px-6 py-4 rounded shadow text-center">
          Loading payment form...
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        product={product}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripeWrapper;
