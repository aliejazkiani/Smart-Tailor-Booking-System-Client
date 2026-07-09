import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import API from "../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await API.put(`/auth/resetpassword/${token}`, {
        password: newPassword,
      });
      console.log(response.data);
      alert("Password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter your new password below. Make sure it's strong and secure."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type={showPassword ? "text" : "password"}
          label="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          icon={
            <div
              className="cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          }
          required
        />
        <InputField
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          icon={
            <div
              className="cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          }
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>

      <div className="mt-6 text-sm text-center lg:text-left text-slate-500 space-x-4">
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
          Back to Login
        </Link>
        <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold">
          Create New Account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
