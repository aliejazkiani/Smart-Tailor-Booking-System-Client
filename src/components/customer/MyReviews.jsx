import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import { getCustomerReviews } from "../../services/reviewService";
import { useLanguage } from "../../context/LanguageContext";

const MyReviews = () => {
  const { t, isUrdu, dir } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const urduClass = isUrdu ? "font-urdu" : "";

  const userStr = localStorage.getItem("user");
  const customer = userStr ? JSON.parse(userStr) : null;
  const customerId = customer?._id || customer?.id;

  useEffect(() => {
    if (!customerId) return;
    const fetchReviews = async () => {
      try {
        const res = await getCustomerReviews(customerId);
        setReviews(res.data?.reviews || res.data || []);
      } catch (err) {
        console.error("Failed to load your reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [customerId]);

  if (loading) {
    return (
      <div className={`p-20 text-center animate-pulse ${urduClass}`}>
        {t("loadingReviews")}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" dir={dir}>
      <h2 className={`text-3xl font-black text-gray-800 mb-2 flex items-center gap-3 ${urduClass}`}>
        <FaStar className="text-yellow-400" /> {t("myReviews")}
      </h2>
      <p className={`text-gray-500 mb-8 ${urduClass}`}>{t("myReviewsSubtitle")}</p>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <FaStar className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className={`text-gray-500 font-medium ${urduClass}`}>{t("noReviewsYet")}</p>
          <p className={`text-sm text-gray-400 mt-2 ${urduClass}`}>{t("noReviewsHint")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">
                    {review.tailorId?.shopName ||
                      review.tailorId?.fullName ||
                      "Tailor"}
                  </p>
                  <StarRating rating={review.rating} size={16} />
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              )}
              {review.tailorReply?.text && (
                <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                    Shop Owner Replied
                  </p>
                  <p className="text-sm text-indigo-800">{review.tailorReply.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
