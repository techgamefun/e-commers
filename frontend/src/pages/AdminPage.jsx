import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";
import ProductForm from "../components/ProductForm";

const AdminPage = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit'
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentView]);

  const fetchProducts = async () => {
    setMessage("");
    setError("");
    try {
      const response = await api.get("/product/products");
      setProducts(response.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    }
  };

  const handleCreateProductSuccess = (successMessage) => {
    setMessage(successMessage);
    setCurrentView("list");
    fetchProducts();
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setCurrentView("edit");
  };

  const handleUpdateProductSuccess = (successMessage) => {
    setMessage(successMessage);
    setCurrentView("list");
    setEditingProductId(null);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setMessage("");
      setError("");
      try {
        const response = await api.delete(`/product/delete`, {
          data: { productId },
        });
        console.log(response);
        setMessage("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        setError(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const handleCancelForm = () => {
    setCurrentView("list");
    setEditingProductId(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentView("list")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
            currentView === "list"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setCurrentView("create")}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
            currentView === "create"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Create New Product
        </button>
        {currentView === "edit" && (
          <button
            onClick={() => setCurrentView("list")}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300`}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Conditional Rendering of Sections */}
      {currentView === "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 text-xl py-10">
              No products found. Start by creating a new product!
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id} // Pass the product ID
                title={product.title}
                description={product.description}
                basePrice={product.basePrice}
                sellPrice={product.sellPrice} // Assuming this is calculated or comes from backend
                images={product.images}
                onEdit={handleEditProduct} // Pass the edit handler
                onDelete={handleDeleteProduct} // Pass the delete handler
              />
            ))
          )}
        </div>
      )}

      {currentView === "create" && (
        <ProductForm
          onProductCreated={handleCreateProductSuccess}
          onCancel={handleCancelForm}
        />
      )}

      {currentView === "edit" && editingProductId && (
        <EditProductForm
          productId={editingProductId}
          onProductUpdated={handleUpdateProductSuccess}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default AdminPage;
