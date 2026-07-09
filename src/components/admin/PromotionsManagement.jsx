import React, { useEffect, useState } from "react";
import { FaTag, FaPlus, FaBroadcastTower, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import {
  getAllPromotions,
  createPromotion,
  broadcastPromotion,
  deletePromotion,
  updatePromotion,
} from "../../services/notificationService";

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountCode: "",
    discountPercent: 10,
    discountAmount: 0,
    validUntil: "",
    targetRole: "customer",
    sendNow: true,
  });

  const fetchPromotions = async () => {
    try {
      const res = await getAllPromotions();
      setPromotions(res.data?.promotions || []);
    } catch (err) {
      console.error("Failed to load promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPromotion(form);
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        discountCode: "",
        discountPercent: 10,
        discountAmount: 0,
        validUntil: "",
        targetRole: "customer",
        sendNow: true,
      });
      fetchPromotions();
      alert("Promotion created and notifications sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create promotion");
    }
  };

  const handleBroadcast = async (id) => {
    try {
      const res = await broadcastPromotion(id);
      alert(res.data?.message || "Broadcast sent!");
    } catch {
      alert("Broadcast failed");
    }
  };

  const handleToggle = async (id, isActive) => {
    await updatePromotion(id, { isActive: !isActive });
    fetchPromotions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this promotion?")) {
      await deletePromotion(id);
      fetchPromotions();
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading promotions...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FaTag className="text-orange-500" /> Promotions & Discounts
          </h2>
          <p className="text-slate-500 mt-1">Create and broadcast offers to customers and tailors.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          <FaPlus /> New Offer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Offer Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
              required
            />
            <input
              placeholder="Discount Code (e.g. STITCH20)"
              value={form.discountCode}
              onChange={(e) => setForm({ ...form, discountCode: e.target.value.toUpperCase() })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-mono"
              required
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
            rows={3}
            required
          />
          <div className="grid sm:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Discount %"
              value={form.discountPercent}
              onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
              min={0}
              max={100}
            />
            <input
              type="number"
              placeholder="Flat amount (Rs)"
              value={form.discountAmount}
              onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
              min={0}
            />
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
              required
            />
            <select
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              className="border-2 border-slate-100 rounded-xl px-4 py-3 text-sm"
            >
              <option value="customer">Customers</option>
              <option value="tailor">Tailors</option>
              <option value="all">Everyone</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.sendNow}
              onChange={(e) => setForm({ ...form, sendNow: e.target.checked })}
            />
            Send notification immediately to all users
          </label>
          <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800">
            Create & Send
          </button>
        </form>
      )}

      <div className="space-y-3">
        {promotions.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No promotions created yet.</p>
        ) : (
          promotions.map((p) => (
            <div key={p._id} className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-800">{p.title}</h3>
                  <code className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold">
                    {p.discountCode}
                  </code>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{p.description}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {p.discountPercent > 0 ? `${p.discountPercent}% off` : `Rs. ${p.discountAmount} off`}
                  &bull; Target: {p.targetRole}
                  &bull; Until: {new Date(p.validUntil).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBroadcast(p._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="Broadcast">
                  <FaBroadcastTower />
                </button>
                <button onClick={() => handleToggle(p._id, p.isActive)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl" title="Toggle">
                  {p.isActive ? <FaToggleOn className="text-green-500" /> : <FaToggleOff />}
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionsManagement;
