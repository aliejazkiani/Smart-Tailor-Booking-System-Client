import React, { useEffect, useState } from "react";
import { FaUserTie, FaStore } from "react-icons/fa";
import StarRating from "../shared/StarRating";
import { getCustomerReceivedFeedback } from "../../services/reviewService";
import { useLanguage } from "../../context/LanguageContext";

const MyTailorFeedback = () => {
  const { t, isUrdu, dir } = useLanguage();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const urduClass = isUrdu ? "font-urdu" : "";

  const userStr = localStorage.getItem("user");
  const customer = userStr ? JSON.parse(userStr) : null;
  const customerId = customer?._id || customer?.id;

  useEffect(() => {
    if (!customerId) return;
    const fetchFeedback = async () => {
      try {
        const res = await getCustomerReceivedFeedback(customerId);
        setFeedbackList(res.data?.feedback || []);
      } catch (err) {
        console.error("Failed to load tailor feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [customerId]);

  if (loading) {
    return (
      <div className={`p-20 text-center animate-pulse ${urduClass}`}>
        {t("loadingTailorFeedback")}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" dir={dir}>
      <h2 className={`text-3xl font-black text-gray-800 mb-2 flex items-center gap-3 ${urduClass}`}>
        <FaUserTie className="text-indigo-600" /> {t("tailorFeedbackTitle")}
      </h2>
      <p className={`text-gray-500 mb-8 ${urduClass}`}>{t("tailorFeedbackSubtitle")}</p>

      {feedbackList.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <FaStore className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className={`text-gray-500 font-medium ${urduClass}`}>{t("noTailorFeedbackYet")}</p>
          <p className={`text-sm text-gray-400 mt-2 ${urduClass}`}>{t("noTailorFeedbackHint")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((item) => {
            const shopName =
              item.tailorId?.shopName ||
              item.tailorId?.fullName ||
              "Tailor";
            const orderRef =
              item.orderId?.invoiceNumber ||
              (item.orderId?._id ? `#${item.orderId._id.toString().slice(-6)}` : null);

            return (
              <div
                key={item._id}
                className="bg-white border-2 border-indigo-50 rounded-2xl p-6 shadow-sm hover:border-indigo-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{shopName}</p>
                    {orderRef && (
                      <p className={`text-xs text-indigo-500 font-bold uppercase tracking-widest mt-1 ${urduClass}`}>
                        {t("order")}: {orderRef}
                      </p>
                    )}
                    <div className="mt-2">
                      <StarRating rating={item.rating} size={16} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {item.comment ? (
                  <p className="text-gray-600 text-sm leading-relaxed bg-slate-50 rounded-xl p-4">
                    {item.comment}
                  </p>
                ) : (
                  <p className={`text-sm text-gray-400 italic ${urduClass}`}>{t("noCommentProvided")}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTailorFeedback;
