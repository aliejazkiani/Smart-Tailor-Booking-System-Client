import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { FaStore, FaStar, FaMedal } from "react-icons/fa";
import StarRating from "../shared/StarRating";

const TopRatedTailors = () => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await API.get("/admin/shops/top-rated?limit=10");
        setTailors(res.data);
      } catch (err) {
        console.error("Error fetching top-rated tailors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500">Loading top-rated shops...</div>;
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Top-Rated Tailors & Shops</h3>
          <p className="text-sm text-slate-400 mt-1">Ranked by customer ratings and review count</p>
        </div>
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
          <FaMedal size={20} />
        </div>
      </div>

      {tailors.length === 0 ? (
        <p className="text-center py-16 text-slate-400 font-medium">No rated shops yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Rank</th>
                <th className="px-8 py-4">Shop</th>
                <th className="px-8 py-4">Owner</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Rating</th>
                <th className="px-8 py-4">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tailors.map((tailor, index) => (
                <tr key={tailor._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-slate-200 text-slate-600" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                        <FaStore size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{tailor.shopName || "Unnamed Shop"}</p>
                        <p className="text-xs text-slate-400">{tailor.shopAddress || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-700">
                    {tailor.ownerName || tailor.fullName}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {tailor.shopCategory || "General"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <StarRating rating={tailor.rating} readOnly size={14} />
                      <span className="text-sm font-black text-slate-800 flex items-center gap-1">
                        <FaStar className="text-yellow-400" size={12} />
                        {(tailor.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {tailor.totalReviews || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopRatedTailors;
