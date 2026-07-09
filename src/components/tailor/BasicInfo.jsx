import React from "react";

const BasicInfo = ({ formData, handleChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Shop Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Shop / Business Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="shopName"
        value={formData.shopName}
        onChange={handleChange}
        placeholder="Enter your shop name"
        required
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Owner Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Owner Name
      </label>
      <input
        type="text"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        placeholder="Enter owner's full name"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Mobile Number */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Mobile Number <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
        placeholder="03XX-XXXXXXX"
        required
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* CNIC Number (Naya Field) */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        CNIC Number <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="cnic"
        value={formData.cnic}
        onChange={handleChange}
        placeholder="XXXXX-XXXXXXX-X"
        required
        maxLength="15"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);

export default BasicInfo;