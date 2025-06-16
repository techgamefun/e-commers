import React from "react";

// Add onEdit and onDelete props
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
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-64 object-cover"
        src={
          images && images.length > 0
            ? images[0].url
            : "https://via.placeholder.com/256x256?text=No+Image"
        } // Added fallback image
        alt={title}
      />
      <div className="p-4">
        <h3 className="text-gray-800 text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex justify-center items-center">
            {/* Display basePrice only if it's different from sellPrice (i.e., there's a discount) */}
            {basePrice && sellPrice && basePrice !== sellPrice && (
              <span className="text-gray-900 line-through text-sm mr-1">
                ${basePrice.toFixed(2)}
              </span>
            )}
            <span className="text-gray-900 font-bold text-lg mr-2">
              ${sellPrice ? sellPrice : basePrice}{" "}
              {/* Use sellPrice if available, else basePrice */}
            </span>
            {/* Show SALE badge only if there's a discount */}
            {basePrice && sellPrice && basePrice !== sellPrice && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                SALE
              </span>
            )}
          </div>
          {/* Admin Action Buttons */}
          <div className="flex space-x-2">
            {onEdit && ( // Only render if onEdit prop is provided (implies admin context)
              <button
                onClick={() => onEdit(productId)}
                className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition-colors"
                title="Edit Product"
              >
                Edit
              </button>
            )}
            {onDelete && ( // Only render if onDelete prop is provided (implies admin context)
              <button
                onClick={() => onDelete(productId)}
                className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                title="Delete Product"
              >
                Delete
              </button>
            )}
            {/* The Buy Now button for general display, or remove if this card is strictly for admin */}
            {!onEdit &&
              !onDelete && ( // Only show "Buy Now" if not in admin mode
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors">
                  Buy Now
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
