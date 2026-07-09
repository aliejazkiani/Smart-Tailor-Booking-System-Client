import React from "react";

const ShopDetails = ({ formData, handleChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Shop Address */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Shop Address <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="shopAddress"
        value={formData.shopAddress}
        onChange={handleChange}
        placeholder="Enter full shop address"
        required
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Shop Category */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Shop Category <span className="text-red-500">*</span>
      </label>
      <select
        name="shopCategory"
        value={formData.shopCategory}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Shop Category</option>
        <option>Women's Wear</option>
        <option>Men's Wear</option>
        <option>Bridal & Formal</option>
        <option>All Types</option>
        <option>Uniforms & Bulk</option>
      </select>
    </div>

    {/* Price Range */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Price Range
      </label>
      <select
        name="priceRange"
        value={formData.priceRange}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Price Range</option>
        <option>₨1000 - ₨2000</option>
        <option>₨1500 - ₨5000</option>
        <option>₨5000+</option>
      </select>
    </div>

    {/* Years of Experience */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Years of Experience
      </label>
      <input
        type="number"
        name="yearsOfExperience"
        value={formData.yearsOfExperience}
        onChange={handleChange}
        placeholder="e.g. 5"
        min="0"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Business Hours */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Business Hours
      </label>
      <input
        type="text"
        name="businessHours"
        value={formData.businessHours}
        onChange={handleChange}
        placeholder="e.g. 9:00 AM - 8:00 PM"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Shop Description */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Shop Description
      </label>
      <textarea
        name="shopDescription"
        value={formData.shopDescription}
        onChange={handleChange}
        placeholder="Describe your shop and services"
        rows="3"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);

export default ShopDetails;
