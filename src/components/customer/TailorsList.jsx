import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaRegStar,
  FaCut,
  FaCalendarCheck,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import API from "../../utils/api";
import TailorReviewsList from "./TailorReviewsList";
import { useLanguage } from "../../context/LanguageContext";

const BACKEND_URL = "http://localhost:5000";
const toImageUrl = (url) => (url?.startsWith("/") ? `${BACKEND_URL}${url}` : url);

const TailorsList = () => {
  const { t, isUrdu, dir } = useLanguage();
  const navigate = useNavigate();
  const urduClass = isUrdu ? "font-urdu" : "";

  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsTailor, setReviewsTailor] = useState(null);

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const res = await API.get("/tailor/all");
        setTailors(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Fetch Tailors Error:", err);
        setError("failedLoadTailors");
      } finally {
        setLoading(false);
      }
    };

    fetchTailors();
  }, []);

  if (loading) {
    return <div className={`p-10 text-center ${urduClass}`}>{t("loading")}</div>;
  }

  if (error) {
    return (
      <div className={`text-center mt-10 text-red-600 ${urduClass}`}>
        {t(error)}
      </div>
    );
  }

  if (!tailors.length) {
    return (
      <div className={`flex flex-col items-center justify-center mt-20 text-gray-400 ${urduClass}`}>
        <FaCut className="text-6xl mb-4" />
        <p className="text-xl font-medium">{t("noTailorsFound")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <h2 className={`text-3xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-600 pl-4 ${urduClass}`}>
        {t("discoverTailors")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tailors.map((tailor) => (
          <div
            key={tailor._id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col"
          >
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
              <div className="absolute -bottom-8 left-6">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                  {tailor.profilePicture || tailor.shopPhotoUrls?.[0] ? (
                    <img
                      src={toImageUrl(tailor.profilePicture || tailor.shopPhotoUrls[0])}
                      alt={tailor.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 text-2xl font-bold">
                      {tailor.fullName?.charAt(0) || "T"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-10 px-6 pb-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900">
                {tailor.shopName || tailor.fullName}
              </h3>

              <p className={`text-sm text-gray-500 mt-1 ${urduClass}`}>
                {tailor.specialization || t("generalTailoring")}
              </p>

              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = tailor.rating || 0;
                  return (
                    <span key={index}>
                      {index < Math.round(rating) ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </span>
                  );
                })}

                <span className={`ml-2 text-sm text-gray-500 ${urduClass}`}>
                  {tailor.rating?.toFixed(1) || "0.0"}
                  {tailor.totalReviews
                    ? ` (${tailor.totalReviews} ${t("reviews")})`
                    : ` ${t("noReviews")}`}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600 flex-grow">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-400 mt-1" />
                  <span className="line-clamp-2">
                    {tailor.shopAddress || t("addressNotAvailable")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setReviewsTailor(tailor)}
                  className={`w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-xl transition flex items-center justify-center gap-2 ${urduClass}`}
                >
                  <FaComments size={14} />
                  {t("viewReviews")}
                </button>

                <button
                  onClick={() => navigate(`/schedule-visit/${tailor._id}`)}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition ${urduClass}`}
                >
                  <FaCalendarCheck size={16} />
                  {t("bookHomeVisit")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviewsTailor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col" dir={dir}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {reviewsTailor.shopName || reviewsTailor.fullName} — {t("reviewsTitle")}
              </h3>
              <button
                onClick={() => setReviewsTailor(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <TailorReviewsList
                tailorId={reviewsTailor._id}
                shopName={reviewsTailor.shopName || reviewsTailor.fullName}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorsList;
