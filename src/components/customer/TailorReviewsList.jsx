import React, { useEffect, useMemo, useState } from "react";
import { FaFlag, FaStar, FaStore, FaReply } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import ReportReviewModal from "./ReportReviewModal";
import { getTailorReviews, getShopRating } from "../../services/reviewService";

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "highest", label: "Highest Rating" },
  { id: "lowest", label: "Lowest Rating" },
];

const TailorReviewsList = ({ tailorId, shopName, compact = false }) => {
  const [reviews, setReviews] = useState([]);
  const [shopRating, setShopRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportTarget, setReportTarget] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [starFilter, setStarFilter] = useState(0);

  const fetchReviews = async () => {
    if (!tailorId) return;
    setLoading(true);
    try {
      const [reviewsRes, ratingRes] = await Promise.allSettled([
        getTailorReviews(tailorId),
        getShopRating(tailorId),
      ]);

      if (reviewsRes.status === "fulfilled") {
        setReviews(reviewsRes.value.data?.reviews || reviewsRes.value.data || []);
      }
      if (ratingRes.status === "fulfilled") {
        setShopRating(ratingRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tailorId]);

  const avgRating =
    shopRating?.averageRating ??
    (reviews.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0);
  const totalReviews = shopRating?.totalReviews ?? reviews.length;

  const visibleReviews = useMemo(() => {
    let list = starFilter ? reviews.filter((r) => r.rating === starFilter) : reviews;
    list = [...list].sort((a, b) => {
      if (sortBy === "highest") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "lowest") return (a.rating || 0) - (b.rating || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }, [reviews, sortBy, starFilter]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className={compact ? "" : "max-w-3xl mx-auto"}>
      {/* Shop-wise overall rating */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaStore size={20} />
          <h3 className="text-lg font-black">{shopName || "Shop Rating"}</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black">{avgRating.toFixed(1)}</span>
          <div>
            <StarRating rating={avgRating} readOnly size={20} />
            <p className="text-indigo-200 text-sm mt-1">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaStar className="text-4xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setStarFilter(0)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                  starFilter === 0 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarFilter(star)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1 ${
                    starFilter === star ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {star} <FaStar size={9} />
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {visibleReviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="font-medium">No reviews match this filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">
                        {review.customerId?.fullName || "Customer"}
                      </p>
                      <StarRating rating={review.rating} readOnly size={14} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  {review.tailorReply?.text && (
                    <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <FaReply size={9} /> Shop Owner Replied
                      </p>
                      <p className="text-sm text-indigo-800">{review.tailorReply.text}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setReportTarget(review)}
                    className="mt-3 text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 uppercase tracking-widest"
                  >
                    <FaFlag size={10} /> Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {reportTarget && (
        <ReportReviewModal
          review={reportTarget}
          onClose={() => setReportTarget(null)}
          onSuccess={() => {
            alert("Review reported. Our team will review it shortly.");
            setReportTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default TailorReviewsList;
