import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import { submitReview } from "../../services/reviewService";

const ReviewForm = ({ order, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tailorId = order?.tailorId?._id || order?.tailorId;
  const shopName =
    order?.tailorId?.shopName ||
    order?.tailorId?.fullName ||
    order?.shopName ||
    "Tailor";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short review.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await submitReview({
        orderId: order._id,
        tailorId,
        rating,
        comment: comment.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaStar /> Rate Your Tailor
            </h3>
            <p className="text-indigo-200 text-sm mt-1">{shopName}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-indigo-500 p-2 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              How was your experience?
            </p>
            <div className="flex justify-center">
              <StarRating rating={rating} onChange={setRating} size={32} />
            </div>
            {rating > 0 && (
              <p className="text-xs text-indigo-600 font-bold mt-2 uppercase tracking-widest">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about stitching quality, delivery time, communication..."
              rows={4}
              maxLength={500}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-indigo-500 focus:ring-0 outline-none resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {comment.length}/500
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
