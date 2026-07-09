import React, { createContext, useContext, useState, useEffect } from "react";
import translations from "../utils/translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("appLanguage") || "en"
  );

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const t = (key) =>
    translations[language]?.[key] ?? translations.en[key] ?? key;

  const isUrdu = language === "ur";
  const dir = isUrdu ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isUrdu, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
