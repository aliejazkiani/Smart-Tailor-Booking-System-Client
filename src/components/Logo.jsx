import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src="Logo.png"
        alt="Stitch & Fit Logo"
        className="w-14 h-14 rounded-2xl shadow-lg shadow-indigo-100 object-cover"
      />
      <h2 className="mt-3 text-lg font-black text-slate-800 tracking-widest uppercase">Stitch &amp; Fit</h2>
    </div>
  );
};

export default Logo;
