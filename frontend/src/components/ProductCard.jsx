import React from "react";

const ProductCard = ({ title, basePrice, sellPrice, description, images }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        className="w-full h-64 object-cover"
        src={images[0].url}
        alt={title}
      />
      <div className="p-4">
        <h3 className="text-gray-800 text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex justify-center items-center">
            <span className="text-gray-900 line-through text-sm mr-1">
              ${basePrice}
            </span>
            <span className="text-gray-900 font-bold text-lg mr-2">
              ${sellPrice}
            </span>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
              SALE
            </span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
