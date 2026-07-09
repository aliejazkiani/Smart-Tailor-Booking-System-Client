import React from "react";

const BACKEND_URL = "http://localhost:5000";
const toImageUrl = (url) => (url?.startsWith("/") ? `${BACKEND_URL}${url}` : url);

const FileUploads = ({
  shopPhotos,
  portfolioSamples,
  existingShopPhotos,
  existingPortfolioSamples,
  handleFileChange,
}) => (
  <div className="space-y-8">
    {/* Shop Photos Section */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Shop Photos
      </label>

      {/* Existing Photos */}
      {existingShopPhotos?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {existingShopPhotos.map((url, i) => (
            <div
              key={i}
              className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={toImageUrl(url)}
                alt={`shop-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e, "shopPhotos")}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {shopPhotos?.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {shopPhotos.length} new shop photo(s) selected
        </p>
      )}
    </div>

    {/* Portfolio Samples Section */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Portfolio Samples
      </label>

      {/* Existing Portfolio Samples */}
      {existingPortfolioSamples?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {existingPortfolioSamples.map((url, i) => (
            <div
              key={i}
              className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={toImageUrl(url)}
                alt={`portfolio-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e, "portfolioSamples")}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {portfolioSamples?.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {portfolioSamples.length} new portfolio sample(s) selected
        </p>
      )}
    </div>
  </div>
);

export default FileUploads;
