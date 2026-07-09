import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Scissors,
  Mail,
  MessageSquare,
} from "lucide-react";

const VisitScheduler = () => {
  const { tailorId } = useParams(); // URL se tailorId

  // ================= STATE =================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    notes: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const API_URL = "http://localhost:5000/api/visits";

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // ✅ Date validation (only future or today allowed)
    const today = new Date();
    const selectedDate = new Date(formData.date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setStatus({
        loading: false,
        success: false,
        error: "Please select a future date or today. Past dates are not allowed.",
      });
      return;
    }

    try {
      // 1. LocalStorage se token nikalna (Zaroori hai)
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first to book a visit.");
      }

      // 2. Debugging ke liye console log (Check karein tailorId aa raha hai ya nahi)
      console.log("Submitting to:", API_URL);
      console.log("Tailor ID:", tailorId);
      console.log("Token found:", !!token);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Ye line add karna zaroori hai
        },
        body: JSON.stringify({
          ...formData,
          tailorId: tailorId, // Iska naam backend model se match hona chahiye
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Agar backend se error aaye toh wo yahan dikhayega
        throw new Error(data.message || "Server rejected the request");
      }

      setStatus({ loading: false, success: true, error: null });
      resetForm();

      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus({
        loading: false,
        success: false,
        error: err.message || "Failed to submit request",
      });
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

        {/* LEFT PANEL */}
        <div className="bg-indigo-700 p-10 md:w-2/5 flex flex-col justify-between text-white relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full opacity-50 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg">
                <Scissors size={32} />
              </div>
              <h1 className="text-2xl font-bold">Tailor Services</h1>
            </div>

            <h2 className="text-3xl font-extrabold mb-6">
              Bring the Boutique <br /> To Your Doorstep
            </h2>

            <p className="text-indigo-100 mb-8">
              Schedule a professional tailor for measurements and design
              consultation at your home.
            </p>

            <div className="space-y-4">
              {[
                "Expert Measurements",
                "Fabric Quality Check",
                "Doorstep Delivery",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="bg-emerald-500/20 p-2 rounded-full">
                    <CheckCircle size={18} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-xs text-indigo-300 border-t border-indigo-600/50 pt-6">
            &copy; 2025 Tailor Services Inc.
          </p>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="p-10 md:w-3/5">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Book a Home Visit
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Submit details for a tailor visit.
          </p>

          {/* SUCCESS */}
          {status.success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex gap-3">
              <CheckCircle size={22} />
              <div>
                <p className="font-bold">Request Sent!</p>
                <p className="text-sm">
                  The selected tailor will contact you soon.
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {status.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-3">
              <AlertCircle size={22} />
              <p className="text-sm font-medium">{status.error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME & PHONE */}
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { name: "name", label: "Full Name", icon: User, type: "text" },
                { name: "phone", label: "Phone Number", icon: Phone, type: "tel" },
              ].map(({ name, label, icon: Icon, type }) => (
                <div key={name}>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      required
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Home Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { name: "date", icon: Calendar, type: "date" },
                { name: "time", icon: Clock, type: "time" },
              ].map(({ name, icon: Icon, type }) => (
                <div key={name}>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Preferred {name}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      required
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      min={
                        name === "date"
                          ? new Date().toISOString().split("T")[0]
                          : undefined
                      }
                      className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* NOTES */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Notes (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={status.loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition ${
                status.loading && "opacity-70 cursor-not-allowed"
              }`}
            >
              {status.loading ? "Submitting..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitScheduler;
