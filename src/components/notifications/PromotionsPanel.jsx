import React, { useEffect, useState } from "react";
import { FaTag, FaCopy, FaPercent } from "react-icons/fa";
import { getActivePromotions } from "../../services/notificationService";

const PromotionsPanel = ({ role = "customer" }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getActivePromotions(role);
        setPromotions(res.data?.promotions || []);
      } catch (err) {
        console.error("Failed to load promotions:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-400 animate-pulse">Loading offers...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3">
        <FaTag className="text-orange-500" /> Promotions & Offers
      </h2>
      <p className="text-slate-500 mb-8">Exclusive discounts and special deals for you.</p>

      {promotions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <FaTag className="text-5xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No active offers right now.</p>
          <p className="text-sm text-slate-400 mt-2">Check back soon for new promotions!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {promotions.map((p) => (
            <div
              key={p._id}
              className="relative bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-100 rounded-2xl p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-black px-4 py-1 rounded-bl-2xl flex items-center gap-1">
                <FaPercent size={10} />
                {p.discountPercent > 0
                  ? `${p.discountPercent}% OFF`
                  : `Rs. ${p.discountAmount} OFF`}
              </div>
              <h3 className="font-black text-lg text-slate-800 mt-4">{p.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{p.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <code className="flex-1 bg-white border-2 border-dashed border-orange-300 rounded-xl px-4 py-2 font-mono font-bold text-orange-600 text-center">
                  {p.discountCode}
                </code>
                <button
                  onClick={() => copyCode(p.discountCode)}
                  className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                  title="Copy code"
                >
                  <FaCopy />
                </button>
              </div>
              {copied === p.discountCode && (
                <p className="text-xs text-green-600 font-bold mt-2 text-center">Copied!</p>
              )}
              <p className="text-[10px] text-slate-400 mt-3 text-right">
                Valid until {new Date(p.validUntil).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPanel;
