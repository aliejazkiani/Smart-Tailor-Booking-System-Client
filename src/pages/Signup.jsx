import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "./AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import RoleToggle from "../components/RoleToggle";
import { useAuth } from "../context/AuthContext";

const ErrorText = ({ text, center }) => (
  <p className={`text-red-500 text-sm mt-1 ${center ? "text-center" : ""}`}>
    {text}
  </p>
);

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState("customer");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { signup, googleAuth } = useAuth();
  const navigate = useNavigate();

  // --- Handle input changes ---
  const handleChange = (field, value) => {
    if (field === "fullName") {
      // Only letters and spaces allowed
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, general: "" })); // clear general error
  };

  // --- Form validation ---
  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = form;
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email =
        "Please Enter Valid Gmail addresses (example@gmail.com) only.";
    }

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters required.";
    else if (password.length > 16)
      newErrors.password = "Password cannot exceed 16 characters.";
    else if (!/[a-z]/.test(password))
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    else if (!/[A-Z]/.test(password))
      newErrors.password =
        "Password must contain at least one uppercase letter.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Form submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(form.fullName, form.email, form.password, role);
      setErrors({});
      navigate("/login");
    } catch (error) {
      setErrors({ general: error?.message || "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  // --- Google auth ---
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const data = await googleAuth(credentialResponse.credential, role);

      if (data.exists) {
        setErrors({ general: `Email already registered: ${data.user.email}` });
        navigate("/login");
      } else {
        // ✅ ADMIN LOGIC ADDED HERE: Handles redirection for all 3 roles
        if (role === "admin") {
            navigate("/admin-dashboard");
        } else if (role === "tailor") {
            navigate("/tailor-dashboard");
        } else {
            navigate("/customer-dashboard");
        }
      }
    } catch (error) {
      setErrors({ general: error?.message || "Google sign-in failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: "Google sign-in failed. Please try again." });
  };

  return (
    <AuthLayout title="Join Us" subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <RoleToggle selectedRole={role} onSelectRole={setRole} />

        <div className="space-y-4">
          <InputField
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            icon={<FaUser />}
            isInvalid={!!errors.fullName}
          />
          {errors.fullName && <ErrorText text={errors.fullName} />}

          <InputField
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            icon={<FaEnvelope />}
            isInvalid={!!errors.email}
          />
          {errors.email && <ErrorText text={errors.email} />}

          {/* Password field */}
          <div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 bg-slate-50/50 font-semibold text-slate-700 outline-none transition-all ${
                  errors.password
                    ? "border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <ErrorText text={errors.password} />}
          </div>

          {/* Confirm password field */}
          <div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 bg-slate-50/50 font-semibold text-slate-700 outline-none transition-all ${
                  errors.confirmPassword
                    ? "border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <ErrorText text={errors.confirmPassword} />
            )}
          </div>
        </div>

        {errors.general && <ErrorText text={errors.general} center />}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 hover:text-indigo-700 font-bold transition"
        >
          Log In
        </Link>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="text-center text-slate-400 text-xs font-black uppercase tracking-widest mb-5">
          Or sign up with
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

export default Signup;