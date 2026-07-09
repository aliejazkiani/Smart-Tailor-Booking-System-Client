import React, { useState } from "react";
import { FaUser, FaTimes } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import { submitCustomerFeedback } from "../../services/reviewService";

const CustomerFeedbackForm = ({ order, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const customerId = order?.customerId?._id || order?.customerId;
  const customerName = order?.customerId?.fullName || order?.customerId?.name || "Customer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating for this customer.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await submitCustomerFeedback({
        orderId: order._id,
        customerId,
        rating,
        comment: comment.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <FaUser /> Customer Feedback
            </h3>
            <p className="text-slate-400 text-sm mt-1">{customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              Rate this customer&apos;s cooperation and communication
            </p>
            <div className="flex justify-center">
              <StarRating rating={rating} onChange={setRating} size={28} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Notes (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Provided clear measurements, punctual for fitting..."
              rows={3}
              maxLength={300}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFeedbackForm;
