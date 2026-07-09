import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TailorProfileSetupForm from "../components/tailor/TailorProfileSetupForm";
import { useNavigate } from "react-router-dom";
import { 
  FaStore, FaMoneyBillWave, FaShoppingCart, FaStar, 
  FaBoxOpen, FaUser, FaPhone, FaSignOutAlt, FaCog,
  FaCut, FaTshirt, FaTruck, FaCheckCircle, FaClipboardCheck, FaRulerCombined, FaExternalLinkAlt
} from "react-icons/fa";
import {
  Calendar, Clock, MapPin, Bell, X,
  Loader2, ChevronRight, RefreshCw, Eye, Save, Mail, MessageSquare, AlertTriangle
} from 'lucide-react';
import API from "../utils/api";
import ShopReviewsPanel from "../components/tailor/ShopReviewsPanel";
import CustomerFeedbackForm from "../components/tailor/CustomerFeedbackForm";
import { getShopRating, getOrderCustomerFeedback } from "../services/reviewService";
import NotificationBell from "../components/notifications/NotificationBell";

const TailorDashboard = () => {
  const { user, updateUserProfileStatus } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);
  const [stats, setStats] = useState({ earnings: 0, rating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("orders");
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState(null); 
  const [updatingVisitId, setUpdatingVisitId] = useState(null);

  // --- NEW STATES FOR TRACKING & MEASUREMENTS ---
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false); // NEW
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerMeasurements, setCustomerMeasurements] = useState(null); // NEW
  const [tailorNotes, setTailorNotes] = useState(""); // NEW
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // --- NEW STATE: Customer Profile/Address/Preferences (per order) ---
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);

  const navigate = useNavigate();

  const trackingStages = [
    { id: "Fabric Picked", icon: <FaTruck /> },
    { id: "Cutting", icon: <FaCut /> },
    { id: "Stitching", icon: <FaTshirt /> },
    { id: "Quality Check", icon: <FaClipboardCheck /> },
    { id: "Ready", icon: <FaCheckCircle /> },
    { id: "Delivered", icon: <FaTruck /> }
  ];

  const fetchDashboardData = async () => {
    try {
      const profileRes = await API.get("/auth/profile");
      const tailorData = profileRes.data;
      setCurrentUser(tailorData);

      if (tailorData?.isProfileCompleted) {
        const tailorId = tailorData._id || tailorData.id;
        const [ordersRes, visitsRes] = await Promise.all([
          API.get("/tailor/orders"),
          API.get(`/visits/tailor/${tailorId}`)
        ]);
        
        setOrders(ordersRes.data || []);
        setVisitRequests(visitsRes.data || []);
        
        const totalEarnings = (ordersRes.data || [])
          .filter(o => o.status === 'completed' || o.status === 'Delivered' || o.status === 'Ready')
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const ratingRes = await getShopRating(tailorId).catch(() => null);
        const ratingData = ratingRes?.data || {};

        const completedOrders = (ordersRes.data || []).filter(
          (o) => ["completed", "delivered", "ready"].includes(o.status?.toLowerCase())
        );
        const feedbackChecks = await Promise.allSettled(
          completedOrders.map(async (o) => {
            try {
              const res = await getOrderCustomerFeedback(o._id);
              return { orderId: o._id, given: !!res.data?.feedback || !!res.data?._id };
            } catch {
              return { orderId: o._id, given: false };
            }
          })
        );
        const given = {};
        feedbackChecks.forEach((r) => {
          if (r.status === "fulfilled") given[r.value.orderId] = r.value.given;
        });
        setFeedbackGiven(given);
        
        setStats({
          earnings: totalEarnings,
          rating: ratingData.averageRating || 0,
          totalReviews: ratingData.totalReviews || 0,
        });
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  // --- NEW: FETCH CUSTOMER MEASUREMENTS ---
  const handleViewMeasurements = async (order) => {
    setSelectedOrder(order);
    setShowMeasurementModal(true);
    setCustomerMeasurements(null);
    try {
      const customerId = order.customerId?._id || order.customerId;
      // Backend route for measurement retrieval
      const res = await fetch(`http://localhost:5000/api/measurements/${customerId}`);
      const data = await res.json();
      if (data) {
        setCustomerMeasurements(data);
        setTailorNotes(data.tailorNotes || "");
      }
    } catch (err) {
      console.error("Measurement Fetch Error:", err);
    }
  };

  // --- NEW: VIEW CUSTOMER PROFILE / ADDRESS / PREFERENCES FOR AN ORDER ---
  const handleViewCustomerDetails = async (order) => {
    setShowCustomerDetailsModal(true);
    setCustomerDetails(null);
    setLoadingCustomerDetails(true);
    try {
      const customerId = order.customerId?._id || order.customerId;
      const res = await API.get(`/tailor/customer-details/${customerId}`);
      setCustomerDetails(res.data);
    } catch (err) {
      console.error("Customer Details Fetch Error:", err);
    } finally {
      setLoadingCustomerDetails(false);
    }
  };

  // --- NEW: SAVE TAILOR NOTES ---
  const handleSaveTailorNotes = async () => {
    try {
      const customerId = selectedOrder.customerId?._id || selectedOrder.customerId;
      const formData = new FormData();
      formData.append('userId', customerId);
      formData.append('tailorNotes', tailorNotes);
      formData.append('measurements', JSON.stringify(customerMeasurements.measurements));

      const res = await fetch('http://localhost:5000/api/measurements/save', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Tailor Fitting Notes Saved Successfully!");
        setShowMeasurementModal(false);
      }
    } catch (err) {
      alert("Error saving notes");
    }
  };

  // --- VISIT REQUEST HANDLERS ---
  const handleVisitStatus = async (id, newStatus) => {
    setUpdatingVisitId(id);
    try {
      await API.patch(`/visits/${id}/status`, { status: newStatus });
      setVisitRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
    } catch (error) { alert("Error updating status"); }
    finally { setUpdatingVisitId(null); }
  };

  const handleReschedule = async (id) => {
    const newDate = prompt("Enter New Date (YYYY-MM-DD):");
    const newTime = prompt("Enter New Time:");
    if (!newDate || !newTime) return;
    setUpdatingVisitId(id);
    try {
      await API.patch(`/visits/${id}`, { date: newDate, time: newTime, status: 'scheduled' });
      setVisitRequests(prev => prev.map(req => req._id === id ? { ...req, date: newDate, time: newTime, status: 'scheduled' } : req));
    } catch (error) { alert("Reschedule failed"); }
    finally { setUpdatingVisitId(null); }
  };

  const sendReminder = async (id) => {
    setUpdatingVisitId(id);
    try {
      await API.post(`/visits/${id}/remind`);
      alert("Reminder sent!");
    } catch (error) { alert("Reminder failed"); }
    finally { setUpdatingVisitId(null); }
  };

  // --- ORDER HANDLERS ---
  const handleConfirmOrder = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      await API.put(`/tailor/orders/${orderId}/status`, { status: "confirmed" });
      await API.post(`/tracking/init/${orderId}`, {
        status: "Pending",
        message: "Order confirmed by tailor. Ready for processing."
      });
      alert("Order Confirmed! Tracking has been started.");
      fetchDashboardData();
    } catch (error) { console.error(error); }
    finally { setUpdatingOrderId(null); }
  };

  // --- DEMO/TESTING: advance the virtual clock 1 day without changing status,
  // so Order Deadline Risk Detection can be demoed without waiting real days ---
  const [simulatingOrderId, setSimulatingOrderId] = useState(null);
  const handleSimulateDay = async (orderId) => {
    setSimulatingOrderId(orderId);
    try {
      await API.post(`/tracking/simulate-day/${orderId}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Simulate day error:", error);
    } finally {
      setSimulatingOrderId(null);
    }
  };

  const handleUpdateProgress = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await API.put(`/tracking/update/${selectedOrder._id}`, {
        status: newStatus,
        message: `Your order has moved to ${newStatus} stage.`
      });
      alert(`Status updated to ${newStatus}.`);
      setShowTrackingModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleProfileComplete = (updatedUser) => {
    updateUserProfileStatus?.(updatedUser);
    setCurrentUser(updatedUser);
    setEditing(false);
    fetchDashboardData();
  };

  if (loading) return <div className="flex h-screen justify-center items-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48}/></div>;

  if (!currentUser?.isProfileCompleted || editing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 md:p-10">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-6 md:p-12 border border-slate-100">
          <TailorProfileSetupForm initialData={currentUser} onProfileComplete={handleProfileComplete} />
          {editing && <button onClick={() => setEditing(false)} className="mt-6 text-slate-400 font-bold text-sm w-full hover:text-indigo-600 transition tracking-widest uppercase">← Back to Dashboard</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20 md:pb-10">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <FaStore className="text-white text-xl" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-800 leading-tight">{currentUser?.shopName}</h1>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Tailor Pro Dashboard</p>
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell userId={currentUser?._id || currentUser?.id} />
            <button onClick={() => setEditing(true)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition"><FaCog /></button>
            <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white transition">
               <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-10">
        
        {/* Welcome Section */}
        <section className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-slate-200">
           <div className="relative z-10 text-white">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Welcome back, <br className="md:hidden"/> <span className="text-indigo-400">Master!</span></h2>
              <p className="mt-4 text-slate-400 max-w-md text-sm md:text-base leading-relaxed">Update your order progress and check customer measurements below.</p>
           </div>
           <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={<FaMoneyBillWave />} label="Earnings" value={`Rs. ${stats.earnings}`} color="bg-emerald-500" />
          <StatCard icon={<FaShoppingCart />} label="Orders" value={orders.length} color="bg-amber-500" />
          <StatCard icon={<FaStar />} label="Rating" value={`${stats.rating.toFixed(1)} (${stats.totalReviews})`} color="bg-indigo-500" />
          <StatCard icon={<Bell />} label="Requests" value={visitRequests.length} color="bg-rose-500" />
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
          {[
            { id: "orders", label: "Orders" },
            { id: "reviews", label: "Shop Reviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${
                activeSection === tab.id
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSection === "reviews" && (
          <ShopReviewsPanel
            tailorId={currentUser?._id || currentUser?.id}
            shopName={currentUser?.shopName}
          />
        )}

        {activeSection === "orders" && (
        <>
        {/* Visit Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div> Visit Requests
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visitRequests.map((req) => (
              <div key={req._id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 transition-colors">
                      <FaUser size={20}/>
                   </div>
                   <StatusBadge status={req.status} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{req.name}</h3>
                <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mb-1 tracking-wide"><FaPhone size={10}/> {req.phone}</p>
                {req.email && (
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mb-4 tracking-wide"><Mail size={12}/> {req.email}</p>
                )}
                <div className="bg-slate-50 p-4 rounded-2xl space-y-3 mb-6">
                  <p className="text-xs text-slate-600 flex items-start gap-2"><MapPin size={14} className="text-rose-500 shrink-0"/> {req.address}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs"><Calendar size={14}/> {req.date}</div>
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs"><Clock size={14}/> {req.time}</div>
                  </div>
                  {req.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-200/50 text-slate-600 text-xs">
                      <MessageSquare size={14} className="text-indigo-500 shrink-0 mt-0.5"/> {req.notes}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => handleVisitStatus(req._id, 'scheduled')} className="bg-indigo-600 text-white py-3 rounded-xl text-[10px] font-black uppercase">Accept</button>
                      <button onClick={() => handleVisitStatus(req._id, 'rejected')} className="bg-slate-100 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase">Decline</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleReschedule(req._id)} className="bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Reschedule</button>
                      <button disabled={req.status === 'rejected'} onClick={() => sendReminder(req._id)} className="bg-indigo-100 text-indigo-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Remind</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Deadline Risk Warnings */}
        {orders.some((o) => o.risk && o.risk.level !== 'low') && (
          <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 space-y-3">
            <h3 className="flex items-center gap-2 text-red-700 font-black uppercase text-xs tracking-widest">
              <AlertTriangle size={16} /> Deadline Risk Warnings
            </h3>
            {orders.filter((o) => o.risk && o.risk.level !== 'low').map((o) => (
              <p key={o._id} className="text-sm text-red-700 font-semibold flex items-center gap-2">
                <span>{o.risk.emoji}</span> {o.risk.message}
              </p>
            ))}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h2 className="text-2xl font-black text-slate-800">Manage Orders</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total {orders.length} orders found</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5">Risk</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-xs font-black text-slate-500 tracking-tighter">#{order._id.slice(-6)}</td>
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{order.customerId?.fullName || "Guest"}</span>
                            <button
                                onClick={() => handleViewMeasurements(order)}
                                className="text-[10px] text-indigo-600 font-black uppercase flex items-center gap-1 mt-1 hover:underline"
                            >
                                <FaRulerCombined size={10}/> View Measurements
                            </button>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                          {order.status}
                       </span>
                    </td>
                    <td className="px-8 py-6"><RiskBadge risk={order.risk} /></td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 flex-wrap">
                            {order.status === 'pending' ? (
                                <div className="flex flex-col items-end gap-2 w-full">
                                    <button
                                        disabled={updatingOrderId === order._id}
                                        onClick={() => handleConfirmOrder(order._id)}
                                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                                    >
                                        {updatingOrderId === order._id ? "Confirming..." : "Confirm Order"}
                                    </button>
                                    <button
                                        onClick={() => handleViewCustomerDetails(order)}
                                        className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
                                    >
                                        <FaUser size={12} /> View Customer Details
                                    </button>
                                </div>
                            ) : (
                                <>
                                <button
                                    onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }}
                                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-lg"
                                >
                                    <RefreshCw size={14} /> Update Status
                                </button>
                                <button
                                    onClick={() => handleViewCustomerDetails(order)}
                                    className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
                                >
                                    <FaUser size={12} /> View Customer Details
                                </button>
                                {order.risk && (
                                    <button
                                        disabled={simulatingOrderId === order._id}
                                        onClick={() => handleSimulateDay(order._id)}
                                        title="Testing aid: advances the delivery clock by 1 day without changing status, to demo risk detection"
                                        className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 hover:text-amber-700 transition"
                                    >
                                        <Clock size={14} /> {simulatingOrderId === order._id ? "Advancing..." : "Simulate +1 Day"}
                                    </button>
                                )}
                                {["completed", "delivered", "ready"].includes(order.status?.toLowerCase()) && (
                                  feedbackGiven[order._id] ? (
                                    <span className="text-[10px] font-black text-green-600 uppercase">Feedback Given</span>
                                  ) : (
                                    <button
                                      onClick={() => setFeedbackOrder(order)}
                                      className="bg-amber-400 text-amber-900 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition"
                                    >
                                      Rate Customer
                                    </button>
                                  )
                                )}
                                </>
                            )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>

      {feedbackOrder && (
        <CustomerFeedbackForm
          order={feedbackOrder}
          onClose={() => setFeedbackOrder(null)}
          onSuccess={() => {
            setFeedbackGiven((prev) => ({ ...prev, [feedbackOrder._id]: true }));
            alert("Customer feedback submitted! An email notification has been sent to the customer.");
          }}
        />
      )}

      {/* --- MODULE 1: MEASUREMENT VIEW MODAL (NEW) --- */}
      {showMeasurementModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 bg-white p-8 border-b flex justify-between items-center z-10">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Customer Measurements</h3>
                        <p className="text-xs font-bold text-indigo-600 uppercase mt-1">For Order #{selectedOrder._id.slice(-8)}</p>
                    </div>
                    <button onClick={() => setShowMeasurementModal(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition"><X size={20}/></button>
                </div>

                {!customerMeasurements ? (
                    <div className="p-20 text-center text-slate-400">
                        <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                        <p className="font-bold">Fetching latest measurements...</p>
                    </div>
                ) : (
                    <div className="p-10 space-y-10">
                        {/* Section 1: Dynamic Sizes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(customerMeasurements.measurements).map(([key, val]) => (
                                <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </p>
                                    <p className="text-lg font-black text-slate-800">{val || "N/A"}</p>
                                </div>
                            ))}
                        </div>

                        {/* Section 2: Photos (Design Reference & Old Slips) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {customerMeasurements.referencePhoto && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Design Reference</h4>
                                    <img 
                                        src={`http://localhost:5000/${customerMeasurements.referencePhoto}`} 
                                        className="w-full h-64 object-cover rounded-[2rem] border-4 border-slate-50 shadow-md"
                                        alt="Reference"
                                    />
                                </div>
                            )}
                            {customerMeasurements.previousRecords && customerMeasurements.previousRecords.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Old Receipts / Notes</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {customerMeasurements.previousRecords.map((path, idx) => (
                                            <img 
                                                key={idx}
                                                src={`http://localhost:5000/${path}`} 
                                                className="w-48 h-64 object-cover rounded-[2rem] border-4 border-slate-50 shadow-md flex-shrink-0"
                                                alt={`Old Record ${idx}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Tailor Updates (The Verification Feature) */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                            <h4 className="text-xl font-black mb-4 flex items-center gap-2 text-indigo-400">
                                <FaClipboardCheck /> 4. Tailor Fitting Updates
                            </h4>
                            <p className="text-xs text-slate-400 mb-4 font-bold uppercase tracking-widest italic">
                                * Trial ke baad fitting ki adjustments yahan likhein (e.g. Chest need 1 inch loose).
                            </p>
                            <textarea 
                                value={tailorNotes}
                                onChange={(e) => setTailorNotes(e.target.value)}
                                className="w-full bg-slate-800 border-none rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Enter fitting adjustments after physical visit..."
                                rows="4"
                            />
                            <button 
                                onClick={handleSaveTailorNotes}
                                className="mt-6 w-full bg-indigo-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition shadow-xl"
                            >
                                <Save size={16}/> Save Fitting Notes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* --- MODULE 2: ORDER TRACKING MODAL --- */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Update Tracking</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase mt-1">Order #{selectedOrder._id.slice(-8)}</p>
              </div>
              <button onClick={() => setShowTrackingModal(false)} className="p-3 bg-white text-slate-400 rounded-2xl hover:text-red-500 transition shadow-sm"><X size={20}/></button>
            </div>

            <div className="p-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trackingStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => handleUpdateProgress(stage.id)}
                  className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all duration-300 ${
                    selectedOrder.status === stage.id 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  <span className="text-2xl">{stage.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{stage.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODULE 3: CUSTOMER PROFILE / ADDRESS / PREFERENCES MODAL --- */}
      {showCustomerDetailsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white p-8 border-b flex justify-between items-center z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Customer Details</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase mt-1">Profile, Address &amp; Preferences</p>
              </div>
              <button onClick={() => setShowCustomerDetailsModal(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition"><X size={20}/></button>
            </div>

            {loadingCustomerDetails || !customerDetails ? (
              <div className="p-20 text-center text-slate-400">
                <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                <p className="font-bold">Fetching customer details...</p>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                {/* Personal Information */}
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaUser className="text-indigo-500" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Name</p>
                      <p className="font-bold text-slate-800">{customerDetails.profile?.name || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-slate-800">{customerDetails.profile?.email || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                      <p className="font-bold text-slate-800">{customerDetails.profile?.phone || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CNIC</p>
                      <p className="font-bold text-slate-800">{customerDetails.profile?.cnic || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Addresses */}
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" /> Delivery Addresses
                  </h4>
                  {customerDetails.addresses?.length ? (
                    <div className="space-y-3">
                      {customerDetails.addresses.map((addr) => (
                        <div key={addr._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{addr.name}</p>
                            <p className="text-sm text-slate-600">{addr.street}, {addr.city}, {addr.zip}, {addr.country}</p>
                          </div>
                          {addr.isDefault && (
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">Default</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No delivery address saved yet.</p>
                  )}
                </div>

                {/* Tailoring Preferences */}
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaRulerCombined className="text-indigo-500" /> Tailoring Preferences ({customerDetails.preferences?.category || "N/A"})
                  </h4>
                  {customerDetails.preferences ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(customerDetails.preferences)
                        .filter(([key, value]) =>
                          !["_id", "customerId", "createdAt", "updatedAt", "__v", "category"].includes(key) &&
                          value !== "" && value !== 0
                        )
                        .map(([key, value]) => (
                          <div key={key} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </p>
                            <p className="font-bold text-slate-800 text-sm">{String(value)}</p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No tailoring preferences saved yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Original Stat Card Helper
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 group hover:shadow-lg transition-all">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-md`}>{icon}</div>
    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p><p className="text-xl font-black text-slate-800">{value}</p></div>
  </div>
);

const RiskBadge = ({ risk }) => {
  if (!risk) return <span className="text-[10px] font-bold text-slate-300 uppercase">—</span>;
  const styles = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    medium: "bg-amber-50 text-amber-700 border-amber-100",
    high: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${styles[risk.level]}`} title={risk.message || risk.label}>
      {risk.emoji} {risk.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = { pending: "bg-amber-100 text-amber-700", scheduled: "bg-indigo-100 text-indigo-700", rejected: "bg-slate-100 text-slate-500", completed: "bg-emerald-100 text-emerald-700" };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || styles.pending}`}>{status}</span>;
};

export default TailorDashboard;