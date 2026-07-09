import React, { useState, useEffect } from "react";
import axios from "axios";
// Icons
import { 
  FaCheckCircle, FaSpinner, FaTruck, FaBox, 
  FaCut, FaTshirt, FaClipboardCheck, FaBell, FaClock, FaHistory 
} from "react-icons/fa";

const OrderTracking = ({ orderId, userRole = "customer" }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [timeLeft, setTimeLeft] = useState("Calculating...");

  // -------------------------------------------------------------------------
  // FEATURE 1: Steps Configuration
  // -------------------------------------------------------------------------
  const steps = [
    { id: "Pending", icon: <FaBox /> },
    { id: "Fabric Picked", icon: <FaTruck /> },
    { id: "Cutting", icon: <FaCut /> }, 
    { id: "Stitching", icon: <FaTshirt /> },
    { id: "Quality Check", icon: <FaClipboardCheck /> },
    { id: "Ready", icon: <FaCheckCircle /> },
    { id: "Delivered", icon: <FaTruck /> }
  ];

  // -------------------------------------------------------------------------
  // FEATURE 4: Live Delivery Countdown Logic (Updates every second)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      if (!tracking?.deliveryDate) {
        setTimeLeft("Date Not Set");
        return;
      }

      const target = new Date(tracking.deliveryDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Delivery Due Today");
        clearInterval(timer);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tracking?.deliveryDate]);

  // Fetch Data on Mount
  useEffect(() => {
    if (orderId) fetchTrackingData();
  }, [orderId]);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/tracking/${orderId}`);
      setTracking(res.data);
    } catch (err) {
      // Mock Data for Testing if Backend is off
      setTracking({
        currentStatus: "Stitching",
        deliveryDate: "2025-12-31T23:59:59Z", // Future date for testing
        history: [
          { status: "Pending", time: "10:00 AM", message: "Order Received" },
          { status: "Cutting", time: "02:30 PM", message: "Fabric Processing started" }
        ]
      });
    } finally { setLoading(false); }
  };

  // -------------------------------------------------------------------------
  // FEATURE 2: Tailor Updates Order Progress
  // -------------------------------------------------------------------------
  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tracking/update/${orderId}`, {
        status: newStatus,
        message: `Master Tailor updated status to ${newStatus}`
      });

      // -------------------------------------------------------------------------
      // FEATURE 3: Real-time Notification
      // -------------------------------------------------------------------------
      setNotification(`Status updated to ${newStatus}!`);
      setTimeout(() => setNotification(""), 4000);

      fetchTrackingData(); 
    } catch (err) {
      console.error("Update failed");
    }
  };

  if (!orderId) return (
    <div className="p-20 text-center border-4 border-dashed rounded-[3rem] bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">
      Please select an order from history to track live
    </div>
  );

  const currentIdx = steps.findIndex(s => s.id === tracking?.currentStatus);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
      
      {/* FEATURE 3: Notification Toast */}
      {notification && (
        <div className="fixed top-10 right-10 z-[100] bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce font-black text-[10px] uppercase tracking-[0.2em]">
          <FaBell className="text-xl" /> {notification}
        </div>
      )}

      {/* Header Section & FEATURE 4: Countdown Widget */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 border-b pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Live Tracking</h2>
          <p className="text-sm font-bold text-indigo-600 mt-2 uppercase tracking-[0.3em]">Order #{orderId.slice(-8)}</p>
        </div>

        {/* FEATURE 4 UI CARD */}
        <div className="flex items-center gap-6 bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl w-full lg:w-auto">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            <FaClock className="animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Estimated Delivery Countdown</p>
            <p className="text-xl font-black font-mono tracking-tighter">{timeLeft}</p>
          </div>
        </div>
      </div>

      {/* FEATURE 1: Visual Stepper (Progress Bar) */}
      <div className="relative flex justify-between items-center mb-28 px-4 overflow-x-auto py-10 scrollbar-hide">
        <div className="absolute top-[68px] left-14 right-14 h-2 bg-slate-100 -z-0 rounded-full"></div>
        <div 
          className="absolute top-[68px] left-14 h-2 bg-indigo-600 transition-all duration-1000 -z-0 shadow-[0_0_15px_rgba(79,70,229,0.3)] rounded-full" 
          style={{ width: `${(currentIdx / (steps.length - 1)) * 92}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center flex-1 min-w-[130px]">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${
              index <= currentIdx 
              ? "bg-indigo-600 border-indigo-100 text-white scale-110 shadow-xl shadow-indigo-200" 
              : "bg-white border-slate-50 text-slate-200"
            }`}>
              {index === currentIdx ? <FaSpinner className="animate-spin text-2xl" /> : step.icon}
            </div>
            <p className={`mt-6 text-[10px] font-black uppercase tracking-widest text-center ${index <= currentIdx ? "text-slate-900" : "text-slate-300"}`}>
              {step.id}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Activity Log (History) */}
        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner">
          <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-4 uppercase tracking-widest">
            <FaHistory className="text-indigo-600" /> Activity Log
          </h3>
          <div className="space-y-10">
            {tracking?.history?.map((item, i) => (
              <div key={i} className="flex gap-8 border-l-4 border-indigo-600 pl-8 relative ml-2">
                <div className="absolute -left-[10px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-md"></div>
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.time}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1 uppercase">{item.status}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURE 2: Management Panel (Tailor Updates) */}
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <h3 className="text-xl font-black mb-10 text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-6 text-center">
            {userRole === "tailor" ? "Master Control Panel" : "Current Phase Details"}
          </h3>
          
          {userRole === "tailor" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStatusUpdate(s.id)}
                  disabled={s.id === tracking?.currentStatus}
                  className={`py-5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    s.id === tracking?.currentStatus 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105 cursor-not-allowed" 
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                >
                  Set to {s.id}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 relative z-10">
              <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mb-8 mx-auto border border-indigo-500/30">
                <FaTshirt className="text-indigo-400 text-4xl animate-bounce" />
              </div>
              <p className="text-2xl font-black text-white uppercase tracking-tighter">Processing with Tailor</p>
              <p className="text-xs text-slate-500 mt-6 leading-loose max-w-xs mx-auto uppercase tracking-[0.2em]">
                Your garment is currently being handled by our Master Tailor in the <b>{tracking?.currentStatus}</b> phase.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderTracking;