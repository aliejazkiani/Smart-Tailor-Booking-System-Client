import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          language === "en"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ur")}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          language === "ur"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        اردو
      </button>
    </div>
  );
};

export default LanguageToggle;
