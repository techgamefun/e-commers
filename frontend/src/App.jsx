import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import StripeProvider from "./context/StripeProvider";
import HomePageLayout from "./layout/HomePageLayout";
import HomePage from "./pages/HomePage";
import ProductBuyPage from "./pages/ProductBuyPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import AdminPage from "./pages/AdminPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import { ProtectedRoute } from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <ToastContainer position="top-center" autoClose={3000} />

        <Routes>
          <Route path="/" element={<HomePageLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/buy" element={<ProductBuyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/SignUp" element={<SignUp />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
