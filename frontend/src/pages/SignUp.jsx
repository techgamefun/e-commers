import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null); // Clear previous messages

    // Convert data to match backend expectation (trimming and lowercasing)
    const userData = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      password: data.password,
      address: {
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.state ? data.state.trim() : "", // Handle optional state
        postalCode: data.postalCode.trim(),
        country: data.country.trim(),
      },
    };

    try {
      const response = await api.post("/auth/signup", userData);

      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        setMessage({
          type: "success",
          text: response.data.message,
        });
        login(response.data.user);
        reset(); // Clear form on successful submission
        navigate("/");
      } else {
        setMessage({
          type: "error",
          text: response.json.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({
        type: "error",
        text: "Network error or unexpected issue. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out hover:scale-105">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center leading-tight">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please use a valid email address",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="+1234567890"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Invalid international phone number format",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Address Fields */}
          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
            Address Information
          </h3>
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              {...register("street", { required: "Street is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            {errors.street && (
              <p className="text-red-600 text-xs mt-1">
                {errors.street.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                {...register("city", { required: "City is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                State (Optional)
              </label>
              <input
                type="text"
                id="state"
                {...register("state")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.postalCode && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                {...register("country", { required: "Country is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              {errors.country && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:-translate-y-1 active:translate-y-0"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg font-medium text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
