import React, { useEffect, useState } from "react";
import { FaStar, FaStore, FaFlag, FaReply } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import ReportReviewModal from "../customer/ReportReviewModal";
import { getTailorReviews, getShopRating, replyToReview } from "../../services/reviewService";

const ShopReviewsPanel = ({ tailorId, shopName }) => {
  const [reviews, setReviews] = useState([]);
  const [shopRating, setShopRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportTarget, setReportTarget] = useState(null);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const load = async () => {
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
      console.error("Failed to load shop reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tailorId]);

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      await replyToReview(reviewId, replyText.trim());
      setReplyingId(null);
      setReplyText("");
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const avgRating =
    shopRating?.averageRating ??
    (reviews.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0);
  const totalReviews = shopRating?.totalReviews ?? reviews.length;

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 animate-pulse">
        Loading shop reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop-wise overall rating summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 text-white p-6 rounded-[2rem] col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <FaStore />
            <span className="text-xs font-black uppercase tracking-widest opacity-80">
              Shop Rating
            </span>
          </div>
          <p className="text-4xl font-black">{avgRating.toFixed(1)}</p>
          <StarRating rating={avgRating} readOnly size={16} />
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] col-span-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Reviews
          </p>
          <p className="text-3xl font-black text-slate-800">{totalReviews}</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] col-span-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Shop Name
          </p>
          <p className="text-lg font-black text-slate-800 truncate">
            {shopName || "Your Shop"}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
        <FaStar className="text-yellow-400" /> Customer Reviews
      </h3>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100">
          <FaStar className="text-4xl text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No customer reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-800">
                    {review.customerId?.fullName || "Customer"}
                  </p>
                  <StarRating rating={review.rating} readOnly size={14} />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <p className="text-sm text-slate-600 italic">&ldquo;{review.comment}&rdquo;</p>
              {review.isReported && (
                <span className="inline-block mt-2 text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black uppercase">
                  Reported
                </span>
              )}

              {review.tailorReply?.text ? (
                <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <FaReply size={9} /> Your Reply
                  </p>
                  <p className="text-sm text-indigo-800">{review.tailorReply.text}</p>
                </div>
              ) : replyingId === review._id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a public reply to this customer..."
                    rows={2}
                    maxLength={500}
                    className="w-full text-sm border-2 border-indigo-100 rounded-xl p-3 outline-none focus:border-indigo-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={submittingReply}
                      onClick={() => handleSubmitReply(review._id)}
                      className="text-xs font-black bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {submittingReply ? "Posting..." : "Post Reply"}
                    </button>
                    <button
                      onClick={() => { setReplyingId(null); setReplyText(""); }}
                      className="text-xs font-black text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setReplyingId(review._id); setReplyText(""); }}
                  className="mt-2 mr-4 text-[10px] text-indigo-500 hover:text-indigo-700 font-black flex items-center gap-1 uppercase tracking-widest"
                >
                  <FaReply size={8} /> Reply
                </button>
              )}

              <button
                onClick={() => setReportTarget(review)}
                className="mt-2 text-[10px] text-slate-400 hover:text-red-500 font-black flex items-center gap-1 uppercase tracking-widest"
              >
                <FaFlag size={8} /> Report as abusive
              </button>
            </div>
          ))}
        </div>
      )}

      {reportTarget && (
        <ReportReviewModal
          review={reportTarget}
          onClose={() => setReportTarget(null)}
          onSuccess={() => {
            alert("Review reported for moderation.");
            setReportTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default ShopReviewsPanel;
