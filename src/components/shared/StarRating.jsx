import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({
  rating = 0,
  onChange,
  size = 18,
  readOnly = false,
  showValue = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = star <= Math.round(rating);
        const Icon = filled ? FaStar : FaRegStar;

        if (readOnly) {
          return (
            <Icon
              key={star}
              size={size}
              className={filled ? "text-yellow-400" : "text-gray-300"}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Icon
              size={size}
              className={
                star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
              }
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-gray-500 font-medium">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
