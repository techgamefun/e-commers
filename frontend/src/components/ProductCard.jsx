import React, { useState } from "react";
import StripeWrapper from "./StripeWrapper";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductCard = ({
  title,
  basePrice,
  sellPrice,
  description,
  images,
  productId,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleBuyNow = async () => {
    if (!user) {
      return toast.info("SignUp before Buy");
    }

    try {
      setShowCheckout(true);
    } catch (error) {
      console.log(error);
      return toast.error("Try again later");
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    setShowCheckout(false);
    alert("Payment successful! Thank you for your purchase.");
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };

  // Create product object for checkout
  const productForCheckout = {
    productId,
    title,
    sellPrice: sellPrice || basePrice,
  };

  return (
    <>
      <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          className="w-full h-64 object-cover"
          src={
            images && images.length > 0
              ? images[0].url
              : "https://via.placeholder.com/256x256?text=No+Image"
          }
          alt={title}
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="text-gray-800 text-xl font-semibold">{title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex justify-center items-center">
              {basePrice && sellPrice && basePrice !== sellPrice && (
                <span className="text-gray-900 line-through text-sm mr-1">
                  {basePrice}
                </span>
              )}
              <span className="text-gray-900 font-bold text-lg mr-2">
                {sellPrice ? sellPrice : basePrice}
              </span>
              {basePrice && sellPrice && basePrice !== sellPrice && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  SALE
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(productId)}
                  className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors"
                  title="Edit Product"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(productId)}
                  className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                  title="Delete Product"
                >
                  Delete
                </button>
              )}
              {!onEdit && !onDelete && (
                <button
                  onClick={handleBuyNow}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {!onEdit && !onDelete && showCheckout && (
        <StripeWrapper
          product={productForCheckout}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </>
  );
};

export default ProductCard;
