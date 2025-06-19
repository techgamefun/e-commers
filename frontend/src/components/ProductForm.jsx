import React, { useState, useEffect } from "react";
import api from "../api/axios";

// Accepts initialData for editing and an onSubmit prop for handling form submission
const ProductForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: "",
    currency: "USD",
    stock: "",
    discount: {
      amountOff: "",
    },
    imageAltTexts: [],
    ...initialData, // Pre-populate if initialData is provided (for editing)
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  // Effect to handle initial image previews if editing an existing product
  useEffect(() => {
    if (initialData.images && initialData.images.length > 0) {
      setImagePreviews(initialData.images.map((img) => img.url));
    }
  }, [initialData.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("altText")) {
      const index = parseInt(name.split("-")[1]);
      const updatedAlts = [...formData.imageAltTexts];
      updatedAlts[index] = value;
      setFormData((prev) => ({ ...prev, imageAltTexts: updatedAlts }));
    } else if (name.startsWith("discount.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        discount: {
          ...prev.discount,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));

    // Initialize alt texts for new images
    setFormData((prev) => ({
      ...prev,
      imageAltTexts: [
        ...prev.imageAltTexts, // Keep existing alt texts if editing
        ...files.map((_, i) => `Image ${prev.imageAltTexts.length + i + 1}`),
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors([]);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("basePrice", formData.basePrice);
    data.append("currency", formData.currency);
    data.append("stock", formData.stock);
    data.append("discount.amountOff", formData.discount.amountOff);

    console.log(formData.discount.amountOff);

    if (initialData._id) {
      // For editing, pass the product ID
      data.append("productId", initialData._id);
    }

    formData.imageAltTexts.forEach((alt) =>
      data.append(`imageAltTexts[]`, alt)
    );

    images.forEach((image) => data.append("images", image));

    try {
      const endpoint = initialData._id
        ? `/product/update/${initialData._id}`
        : "/product/create";
      const res = await api.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message);
      setFormData(null);
      if (onSubmit) {
        onSubmit(res.data.product); // Pass the created/updated product back
      }
      // Optionally reset form if it's a create operation
      if (!initialData._id) {
        setFormData({
          title: "",
          description: "",
          basePrice: "",
          currency: "USD",
          stock: "",
          discount: "",
          imageAltTexts: [],
        });
        setImages([]);
        setImagePreviews([]);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage(err.response?.data?.message || "Operation failed");
      }
    }
  };

  const formTitle = initialData._id ? "Edit Product" : "Create Product";
  const submitButtonText = initialData._id
    ? "Update Product"
    : "Create Product";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">{formTitle}</h2>

      {message && <div className="mb-4 text-green-600">{message}</div>}
      {errors.length > 0 && (
        <ul className="mb-4 text-red-500 list-disc pl-5">
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Description"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Base Price
        </label>
        <input
          type="number"
          name="basePrice"
          placeholder="Base Price"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.basePrice}
          onChange={handleChange}
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
        <input
          type="text"
          name="currency"
          placeholder="Currency (e.g., USD, EUR)"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.currency}
          onChange={handleChange}
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock
        </label>
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.stock}
          onChange={handleChange}
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discount (Ammount)
        </label>
        <input
          type="number"
          name="discount.amountOff"
          placeholder="Discount Percentage"
          className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.discount.amountOff}
          onChange={handleChange}
        />

        <div className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-200 rounded-md overflow-hidden"
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover"
                />
                <input
                  type="text"
                  name={`altText-${index}`}
                  placeholder={`Alt text for image ${index + 1}`}
                  className="mt-1 p-1 border-t border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.imageAltTexts[index] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            {submitButtonText}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
