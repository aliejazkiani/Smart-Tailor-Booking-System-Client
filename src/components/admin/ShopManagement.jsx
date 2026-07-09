import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import {
  FaStore, FaExclamationTriangle, FaCheck, FaTimes, FaTrash,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaUser, FaBriefcase, FaIdCard
} from "react-icons/fa";
import StarRating from "../shared/StarRating";
import {
  getReportedReviews,
  deleteReview,
  dismissReportedReview,
} from "../../services/reviewService";

const BACKEND_URL = "http://localhost:5000";
const toImageUrl = (url) => (url?.startsWith("/") ? `${BACKEND_URL}${url}` : url);

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsRes, reportsRes] = await Promise.allSettled([
        API.get("/admin/shops/pending"),
        getReportedReviews(),
      ]);
      if (shopsRes.status === "fulfilled") {
        setShops(shopsRes.value.data);
      }
      if (reportsRes.status === "fulfilled") {
        setReports(reportsRes.value.data?.reviews || reportsRes.value.data || []);
      }
    } catch (err) {
      console.error("Error fetching shop data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyShop = async (id, status) => {
    try {
      await API.patch(`/admin/shops/verify/${id}`, { status });
      alert(`Shop ${status} successfully!`);
      fetchData();
    } catch (err) {
      alert("Action failed!");
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this abusive review?")) {
      try {
        await deleteReview(id);
        fetchData();
      } catch (err) {
        alert("Could not delete review");
      }
    }
  };

  const handleDismissReport = async (id) => {
    try {
      await dismissReportedReview(id);
      fetchData();
    } catch (err) {
      alert("Could not dismiss report");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading shop data...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* 1. Shop Verification Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FaStore size={20} /></div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Pending Approvals</h3>
          </div>
          <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">{shops.length} NEW</span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {shops.length === 0 ? (
            <p className="text-slate-400 text-center py-10 font-medium">No pending shop requests.</p>
          ) : (
            shops.map((shop) => (
              <div key={shop._id} className="p-6 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all bg-slate-50/50">
                <div className="mb-4">
                  <h4 className="font-black text-slate-800 text-lg">{shop.shopName || "Unnamed Shop"}</h4>
                  <span className="inline-block mt-1 text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    {shop.shopCategory || "General Tailoring"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaUser className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Owner</p>
                      <p className="font-semibold">{shop.ownerName || shop.fullName || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaEnvelope className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p>
                      <p className="font-semibold break-all">{shop.email || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaPhone className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</p>
                      <p className="font-semibold">{shop.mobileNumber || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaIdCard className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CNIC</p>
                      <p className="font-semibold">{shop.cnic || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaMapMarkerAlt className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Address</p>
                      <p className="font-semibold">{shop.shopAddress || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaBriefcase className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Experience</p>
                      <p className="font-semibold">
                        {shop.yearsOfExperience ? `${shop.yearsOfExperience} years` : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <FaMoneyBillWave className="text-blue-500 mt-0.5 shrink-0" size={13} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price Range</p>
                      <p className="font-semibold">{shop.priceRange || "—"}</p>
                    </div>
                  </div>
                  {shop.businessHours && (
                    <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                      <FaClock className="text-blue-500 mt-0.5 shrink-0" size={13} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Business Hours</p>
                        <p className="font-semibold">{shop.businessHours}</p>
                      </div>
                    </div>
                  )}
                  {shop.paymentMethods?.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payment Methods</p>
                      <div className="flex flex-wrap gap-2">
                        {shop.paymentMethods.map((method) => (
                          <span key={method} className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg capitalize">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {shop.shopDescription && (
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Description</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{shop.shopDescription}</p>
                    </div>
                  )}
                  {shop.shopPhotoUrls?.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Shop Photos</p>
                      <div className="flex flex-wrap gap-2">
                        {shop.shopPhotoUrls.map((url, i) => (
                          <img
                            key={i}
                            src={toImageUrl(url)}
                            alt={`shop-${i}`}
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {shop.portfolioUrls?.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Portfolio Samples</p>
                      <div className="flex flex-wrap gap-2">
                        {shop.portfolioUrls.map((url, i) => (
                          <img
                            key={i}
                            src={toImageUrl(url)}
                            alt={`portfolio-${i}`}
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => handleVerifyShop(shop._id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl text-xs font-black hover:bg-green-600 transition-all shadow-md shadow-green-200">
                    <FaCheck /> APPROVE
                  </button>
                  <button 
                    onClick={() => handleVerifyShop(shop._id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-red-500 border border-red-100 rounded-2xl text-xs font-black hover:bg-red-50 transition-all">
                    <FaTimes /> REJECT
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Review Moderation Section */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl"><FaExclamationTriangle size={20} /></div>
            <h3 className="text-xl font-black tracking-tight text-white">Reported Reviews</h3>
          </div>
          <p className="text-slate-400 text-sm mb-8 font-medium">Remove fake or abusive feedback reported by users.</p>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {reports.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-slate-500 font-bold">Inbox clear. No reports!</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">From: {report.customerId?.fullName}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shop: {report.shopId?.shopName}</span>
                  </div>
                  {report.rating && (
                    <div className="mb-2">
                      <StarRating rating={report.rating} readOnly size={12} />
                    </div>
                  )}
                  <p className="italic text-sm text-slate-200 leading-relaxed">&ldquo;{report.comment}&rdquo;</p>
                  {report.reportReason && (
                    <p className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-widest">
                      Reason: {report.reportReason}
                    </p>
                  )}
                  <div className="mt-5 flex justify-end gap-4 border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleDismissReport(report._id)}
                      className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest"
                    >
                      Dismiss Report
                    </button>
                    <button 
                        onClick={() => handleDeleteReview(report._id)}
                        className="text-[10px] font-black text-red-400 hover:text-red-300 flex items-center gap-1 uppercase tracking-widest">
                        <FaTrash size={10} /> Delete Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ShopManagement;
