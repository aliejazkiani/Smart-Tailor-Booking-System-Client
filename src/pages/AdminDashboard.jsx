
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars, FaUsers, FaChartBar, FaStore, FaShieldAlt,
  FaSignOutAlt, FaTimes, FaChevronRight, FaUserShield,
  FaFileInvoiceDollar, FaCheckCircle, FaExclamationTriangle, FaTag, FaStar
} from "react-icons/fa";

// Sub-component Imports (Created below)
import AdminOverview from "../components/admin/AdminOverview";
import UserManagement from "../components/admin/UserManagement";
import ShopManagement from "../components/admin/ShopManagement";
import TopRatedTailors from "../components/admin/TopRatedTailors";
import RevenueReports from "../components/admin/RevenueReports";
import PromotionsManagement from "../components/admin/PromotionsManagement";

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "Admin", role: "admin" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData({ name: parsed.fullName || parsed.name || "Admin", role: parsed.role || "admin" });
      } catch (err) {
        console.error("Invalid stored user data:", err);
      }
    }
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartBar /> },
    { id: "users", label: "User Management", icon: <FaUsers /> },
    { id: "shops", label: "Shop Verification", icon: <FaStore /> },
    { id: "top-rated", label: "Top Rated", icon: <FaStar /> },
    { id: "reports", label: "Revenue Reports", icon: <FaFileInvoiceDollar /> },
    { id: "promotions", label: "Promotions & Alerts", icon: <FaTag /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 flex flex-col`}>
        
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg"><FaShieldAlt className="text-white" /></div>
            <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><FaTimes size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => {setActiveTab(tab.id); setIsSidebarOpen(false);}}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}>
              <div className="flex items-center gap-4">
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium text-[15px]">{tab.label}</span>
              </div>
              {activeTab === tab.id && <FaChevronRight size={10} className="opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold">
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-50 text-slate-600 rounded-xl md:hidden">
            <FaBars size={20} />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1">System Control</p>
            <p className="text-lg font-bold text-slate-800 capitalize">{activeTab} Management</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100 pr-4">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              {getInitials(userData.name)}
            </div>
            <div className="text-left"><p className="text-sm font-bold text-slate-800">{userData.name}</p></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && <AdminOverview />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "shops" && <ShopManagement />}
            {activeTab === "top-rated" && <TopRatedTailors />}
            {activeTab === "reports" && <RevenueReports />}
            {activeTab === "promotions" && <PromotionsManagement />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;