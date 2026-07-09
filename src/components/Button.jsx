import React from "react";

const Button = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const baseClasses =
    "w-full py-3.5 px-4 rounded-2xl text-sm font-black uppercase tracking-widest cursor-pointer transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";
  const primaryClasses =
    "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-100";
  const secondaryClasses =
    "bg-slate-100 text-slate-600 shadow-none hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100";

  const currentClasses =
    variant === "primary" ? primaryClasses : secondaryClasses;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${currentClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
