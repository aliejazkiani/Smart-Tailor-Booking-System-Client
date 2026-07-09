import React from "react";

const PaymentMethods = ({ formData, handleCheckboxChange }) => {
  const options = ["Cash", "Online Transfer"];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <label className="block text-lg font-semibold text-gray-800 mb-3">
        Payment Methods
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((method) => {
          const isChecked = formData.paymentMethods.includes(method);
          return (
            <label
              key={method}
              className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer transition-all ${
                isChecked
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-white hover:border-indigo-400"
              }`}
            >
              <input
                type="checkbox"
                value={method}
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="hidden"
              />
              <span
                className={`text-sm font-medium ${
                  isChecked ? "text-indigo-700" : "text-gray-700"
                }`}
              >
                {method}
              </span>
            </label>
          );
        })}
      </div>

      {formData.paymentMethods.length > 0 && (
        <p className="text-sm text-gray-600 mt-3">
          Selected: {formData.paymentMethods.join(", ")}
        </p>
      )}
    </div>
  );
};

export default PaymentMethods;
