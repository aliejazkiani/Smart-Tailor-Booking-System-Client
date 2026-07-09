import React from "react";
import { FaStore, FaCheckCircle } from "react-icons/fa";
import Logo from "../components/Logo";

const features = [
  "Book trusted tailors near you",
  "Track your order live, stitch by stitch",
  "Save & manage measurements digitally",
];

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Left branding hero panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12 xl:p-16">
        <div className="absolute top-[-15%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <FaStore className="text-white text-xl" />
          </div>
          <span className="text-white font-black tracking-widest text-sm uppercase">Stitch &amp; Fit</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Tailoring, <br /> simplified.
          </h2>
          <p className="mt-5 text-slate-400 max-w-sm text-sm leading-relaxed">
            One platform to connect customers, tailors, and shop owners — from measurement to delivery.
          </p>

          <ul className="mt-10 space-y-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <FaCheckCircle className="text-indigo-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Stitch &amp; Fit
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 md:p-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center lg:text-left">{title}</h1>
          <p className="text-slate-500 mb-8 text-center lg:text-left">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
