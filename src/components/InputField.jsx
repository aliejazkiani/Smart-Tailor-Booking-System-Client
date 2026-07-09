import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  isInvalid = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-slate-50/50 text-base font-semibold text-slate-700 placeholder:text-slate-300 outline-none transition-all ${
            icon ? "pl-11" : ""
          } ${
            isInvalid
              ? "border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-50"
              : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          }`}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
