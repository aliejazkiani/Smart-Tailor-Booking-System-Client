import React, { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { reportReview } from "../../services/reviewService";

const REPORT_REASONS = [
  "Fake or misleading review",
  "Abusive or offensive language",
  "Spam or promotional content",
  "Not related to tailoring service",
  "Other",
];

const ReportReviewModal = ({ review, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalReason = reason === "Other" ? customReason.trim() : reason;
    if (!finalReason) {
      setError("Please select or enter a reason.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await reportReview(review._id, finalReason);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to report review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-red-500 p-6 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FaExclamationTriangle /> Report Review
          </h3>
          <button onClick={onClose} className="hover:bg-red-400 p-2 rounded-full">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Help us keep reviews honest. Why are you reporting this review?
          </p>

          <div className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${
                  reason === r
                    ? "border-red-400 bg-red-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-red-500"
                />
                <span className="text-sm font-medium text-gray-700">{r}</span>
              </label>
            ))}
          </div>

          {reason === "Other" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
              className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm outline-none focus:border-red-400"
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50"
          >
            {submitting ? "Reporting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportReviewModal;
