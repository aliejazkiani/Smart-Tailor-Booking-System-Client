import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import API from "../utils/api";

const EmailIcon = () => <i className="fas fa-envelope"></i>;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.post("/auth/forgotpassword", { email });
      console.log(response.data);
      setMessage("Password reset link sent to your email (if registered).");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Trouble Logging In?"
      subtitle="Enter your email and we’ll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<EmailIcon />}
          required
        />

        {error && (
          <p className="bg-red-50 text-red-600 text-sm font-semibold rounded-2xl p-3 text-center">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-2xl p-3 text-center">
            {message}
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 space-x-4">
        <Link
          to="/login"
          className="text-indigo-600 hover:text-indigo-700 font-bold transition"
        >
          Back to Login
        </Link>
        <Link
          to="/signup"
          className="text-indigo-600 hover:text-indigo-700 font-bold transition"
        >
          Create New Account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
