import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import MeasurementSheet from "./pages/MeasurementSheet";
import TailorDashboard from "./pages/TailorDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Admin Dashboard Import

// Components
import ShopFinder from "./components/ShopFinder";
import OrderBooking from "./components/customer/OrderBooking";
import FloatingShopFinder from "./components/FloatingShopFinder";
import VisitScheduler from "./components/VisitScheduler";

/* ---------- Protected Route ---------- */
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-500 font-bold">
        Loading System...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

/* ---------- Routes ---------- */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token?" element={<ResetPassword />} />

      {/* Customer Routes */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-finder"
        element={
          <ProtectedRoute role="customer">
            <ShopFinder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-order/:tailorId"
        element={
          <ProtectedRoute role="customer">
            <OrderBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule-visit/:tailorId"
        element={
          <ProtectedRoute role="customer">
            <VisitScheduler />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-measurements"
        element={
          <ProtectedRoute role="customer">
            <MeasurementSheet />
          </ProtectedRoute>
        }
      />

      {/* Tailor Routes */}
      <Route
        path="/tailor-dashboard"
        element={
          <ProtectedRoute role="tailor">
            <TailorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes ✅ Added Admin Dashboard Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

/* ---------- App Content ---------- */
const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Floating button sirf Customer ke liye show hoga, Admin ya Tailor ke liye nahi
  const hiddenPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const showFloatingButton =
    !loading &&
    user?.role === "customer" &&
    !hiddenPaths.some((path) => location.pathname.startsWith(path));

  return (
    <>
      {showFloatingButton && <FloatingShopFinder />}
      <AppRoutes />
    </>
  );
};

/* ---------- Main App ---------- */
const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;