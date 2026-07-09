import React, { useState, useRef } from "react";
import AuthLayout from "./AuthLayout";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // Assuming 6-digit OTP
  const inputRefs = useRef([]); // To manage focus on OTP inputs

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index !== 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    console.log("Verifying OTP:", fullOtp);
    alert(`Verifying OTP: ${fullOtp}`);
    // Simulate verification success and redirect
    // navigate('/customer-dashboard'); or '/tailor-dashboard' based on role
  };

  const userEmail = "user.email@example.com"; // Replace with actual user email

  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="Please enter the 6-digit code sent to your email address."
    >
      <p className="text-indigo-600 font-bold text-center lg:text-left mb-5">{userEmail}</p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-14 text-2xl font-bold text-center rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
              required
            />
          ))}
        </div>
        <Button type="submit">VERIFY</Button>
      </form>
      <div className="mt-6 text-sm text-center lg:text-left text-slate-500">
        <p className="mb-2">Didn't receive the code?</p>
        <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-bold mr-4">
          Resend Email
        </Link>
        <Link to="#" className="text-indigo-600 hover:text-indigo-700 font-bold">
          Change Email Address
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
