import React from "react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

const HomePage = () => {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    async function gettingdata() {
      try {
        const response = await api("/product/products");
        const { page, products, total, totalPages } = response.data;
        setProducts(products);
      } catch (error) {
        console.log(error);
      }
    }

    gettingdata();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Products ? (
          Products.map((product) => (
            <ProductCard
              key={product._id}
              title={product.title}
              basePrice={product.basePrice}
              sellPrice={product.salePrice}
              description={product.description}
              images={product.images}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            Loading products...
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
