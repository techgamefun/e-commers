import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePageLayout from "./layout/HomePageLayout";
import HomePage from "./pages/HomePage";
import ProductBuyPage from "./pages/ProductBuyPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="buy" element={<ProductBuyPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
