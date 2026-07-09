import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "./AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import RoleToggle from "../components/RoleToggle";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, googleAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Email validation (only @gmail.com allowed)
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError("Please Enter Valid Gmail addresses (example@gmail.com) only");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
      alert("Login successful!");
      navigate(role === "tailor" ? "/tailor-dashboard" : role === "admin" ? "/admin-dashboard" : "/customer-dashboard");
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await googleAuth(credentialResponse.credential, role);
      alert("Google sign-in successful!");
      navigate(role === "tailor" ? "/tailor-dashboard" : role === "admin" ? "/admin-dashboard" : "/customer-dashboard");
    } catch {
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => setError("Google sign-in failed.");

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue">
      <form onSubmit={handleSubmit} className="space-y-5">
        <RoleToggle selectedRole={role} onSelectRole={setRole} />

        <div className="space-y-4">
          <InputField
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            required
          />
          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[15px] cursor-pointer text-slate-400 hover:text-indigo-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-semibold rounded-2xl p-3 text-center">
            {error}
          </div>
        )}

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 hover:text-indigo-700 font-bold transition"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="text-center text-slate-400 text-xs font-black uppercase tracking-widest mb-5">
          Or log in with
        </p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
