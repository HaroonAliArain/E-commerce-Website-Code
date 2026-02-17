import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe";

// User Pages
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/OrderDetails";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import VerifyOTP from "./pages/user/VerifyOTP";
import Profile from "./pages/user/Profile";

// Static Pages
import TermsConditions from "./pages/static/TermsConditions";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import FAQ from "./pages/static/FAQ";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminProducts from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import Users from "./pages/admin/Users";

// Layouts
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Route protection
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";

// Utilities
import ScrollToTop from "./components/ui/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* User Pages */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />

            {/* ✅ Stripe ONLY for checkout */}
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <Checkout />
                </Elements>
              }
            />

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* Admin Pages */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </Router>
  );
};

export default App;
