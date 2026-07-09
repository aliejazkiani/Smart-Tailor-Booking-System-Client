// src/components/TailorCard.jsx
import React from "react";
import { FaMapMarkerAlt, FaStar, FaStore, FaRegStar } from "react-icons/fa";

const TailorCard = ({ tailor }) => {
  // Logic to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 border border-gray-200">
      {/* Image Section */}
      <div className="relative">
        {tailor.shopImages?.length > 0 ? (
          <img src={tailor.shopImages[0]} alt={tailor.shopName} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-indigo-100 flex items-center justify-center text-indigo-500">
            <FaStore size={40} />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{tailor.shopName}</h3>
        
        {/* Rating Display */}
        <div className="flex items-center mt-2 mb-3">
          <div className="flex mr-2">
            {renderStars(Math.round(tailor.rating || 0))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            ({tailor.numReviews || 0} reviews)
          </span>
        </div>

        <p className="text-gray-600 flex items-center text-sm mb-2">
          <FaMapMarkerAlt className="mr-1 text-indigo-500" /> {tailor.address?.city}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-indigo-600 font-bold">${tailor.priceRange?.min} - ${tailor.priceRange?.max}</span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            View Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailorCard;