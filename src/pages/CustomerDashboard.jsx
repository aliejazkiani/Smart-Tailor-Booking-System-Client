import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaMapMarkerAlt,
  FaCogs,
  FaHistory,
  FaUserTie,
  FaStore,
  FaCalendarAlt,
  FaSignOutAlt,
  FaTimes,
  FaChevronRight,
  FaRulerCombined,
  FaTruck,
  FaStar,
  FaTag,
  FaBell,
  FaCommentDots,
  FaShoppingBag,
  FaInfoCircle,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

// Components Imports
import CustomerProfile from "../components/customer/CustomerProfile";
import CustomerAddresses from "../components/customer/CustomerAddresses";
import CustomerPreferences from "../components/customer/CustomerPreferences";
import OrderHistory from "../components/customer/OrderHistory";
import TailorsList from "../components/customer/TailorsList";
import ShopFinder from "../components/ShopFinder";
import MeasurementManagement from "../components/MeasurementManagement";
import OrderTracking from "../components/OrderTracking/OrderTracking";
import MyReviews from "../components/customer/MyReviews";
import MyTailorFeedback from "../components/customer/MyTailorFeedback";
import NotificationBell from "../components/notifications/NotificationBell";
import PromotionsPanel from "../components/notifications/PromotionsPanel";
import NotificationsList from "../components/notifications/NotificationsList";
import ChatWidget from "../Chatbot/ChatWidget";

// Order Booking and Visit Scheduler both need a specific tailor selected first
// (they run at /book-order/:tailorId and /schedule-visit/:tailorId) — this
// screen replaces the raw form when reached from the sidebar with no tailor
// chosen yet, so the customer isn't dropped into a broken form.
const FlowGuide = ({ steps, ctaLabel, onCta }) => (
  <div className="max-w-xl mx-auto text-center py-10 md:py-16">
    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <FaInfoCircle size={28} />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-wide">Read This First</h3>
    <ol className="text-left bg-slate-50 rounded-2xl p-6 space-y-4 mb-8">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4 text-slate-700 font-medium">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
    <button
      onClick={onCta}
      className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
    >
      {ctaLabel}
    </button>
  </div>
);

const CustomerDashboard = () => {
  const { t, dir, isUrdu } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userData, setUserData] = useState({ name: "Customer", role: "customer" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed) setUserData(parsed);
      } catch (e) {
        console.error("Data error", e);
      }
    }
  }, []);

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab("ordertracking");
    setShowWelcome(false);
  };

  const tabGroups = [
    {
      groupLabel: "group_myAccount",
      tabs: [
        { id: "profile", labelKey: "tab_profile", icon: <FaUser /> },
        { id: "addresses", labelKey: "tab_addresses", icon: <FaMapMarkerAlt /> },
        { id: "preferences", labelKey: "tab_preferences", icon: <FaCogs /> },
        { id: "measurements", labelKey: "tab_measurements", icon: <FaRulerCombined /> },
      ],
    },
    {
      groupLabel: "group_orders",
      tabs: [
        { id: "ordertracking", labelKey: "tab_ordertracking", icon: <FaTruck /> },
        { id: "orders", labelKey: "tab_orders", icon: <FaHistory /> },
        { id: "orderbooking", labelKey: "tab_orderbooking", icon: <FaShoppingBag /> },
        { id: "visitscheduler", labelKey: "tab_visitscheduler", icon: <FaCalendarAlt /> },
      ],
    },
    {
      groupLabel: "group_discover",
      tabs: [
        { id: "tailors", labelKey: "tab_tailors", icon: <FaUserTie /> },
        { id: "shopfinder", labelKey: "tab_shopfinder", icon: <FaStore /> },
      ],
    },
    {
      groupLabel: "group_feedback",
      tabs: [
        { id: "reviews", labelKey: "tab_reviews", icon: <FaStar /> },
        { id: "tailor-feedback", labelKey: "tab_tailor_feedback", icon: <FaCommentDots /> },
      ],
    },
    {
      groupLabel: "group_updates",
      tabs: [
        { id: "promotions", labelKey: "tab_promotions", icon: <FaTag /> },
        { id: "notifications", labelKey: "tab_notifications", icon: <FaBell /> },
        { id: "chatbot", labelKey: "tab_chatbot", icon: <FaCommentDots /> },
      ],
    },
  ];

  const tabs = tabGroups.flatMap((group) => group.tabs);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setShowWelcome(false);
    setIsSidebarOpen(false);
    if (id !== "ordertracking") setSelectedOrderId(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userName = userData?.fullName || userData?.name || t("customer");
  const firstName = userName.split(" ")[0];
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const userId = userData?._id || userData?.id;

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.labelKey;

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden" dir={dir}>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FaCogs className="text-white" />
            </div>
            <h2 className={`text-xl font-bold tracking-tight ${isUrdu ? "font-urdu" : ""}`}>
              {t("appName")}
            </h2>
          </div>
          <button className="md:hidden text-slate-400 p-2" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
          {tabGroups.map((group) => (
            <div key={group.groupLabel} className="space-y-1">
              <p
                className={`px-4 mb-1 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isUrdu ? "font-urdu" : ""}`}
              >
                {t(group.groupLabel)}
              </p>
              {group.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg">{tab.icon}</span>
                    <span className={`font-medium text-[15px] ${isUrdu ? "font-urdu" : ""}`}>
                      {t(tab.labelKey)}
                    </span>
                  </div>
                  {activeTab === tab.id && <FaChevronRight size={10} className="opacity-50" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold"
          >
            <FaSignOutAlt />
            <span className={isUrdu ? "font-urdu" : ""}>{t("logout")}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-slate-50 text-slate-600 rounded-xl md:hidden"
            >
              <FaBars size={20} />
            </button>
            <div className="hidden sm:block">
              <p
                className={`text-sm font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1 ${isUrdu ? "font-urdu" : ""}`}
              >
                {t("menu")}
              </p>
              <p className={`text-lg font-bold text-slate-800 ${isUrdu ? "font-urdu" : ""}`}>
                {activeTabLabel ? t(activeTabLabel) : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <NotificationBell
              userId={userId}
              onPromotionsClick={() => {
                setActiveTab("promotions");
                setShowWelcome(false);
              }}
            />
            <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100 pl-1 pr-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <p
                  className={`text-[10px] text-indigo-600 font-bold uppercase ${isUrdu ? "font-urdu" : ""}`}
                >
                  {userData?.role === "customer" ? t("customer") : userData?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {showWelcome ? (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="relative bg-slate-900 rounded-[2rem] p-8 md:p-14 overflow-hidden text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                  <span
                    className={`bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${isUrdu ? "font-urdu" : ""}`}
                  >
                    {t("dashboardHome")}
                  </span>
                  <h2
                    className={`text-3xl md:text-5xl font-black mt-6 mb-4 tracking-tight ${isUrdu ? "font-urdu" : ""}`}
                  >
                    {t("welcomeBack")}{" "}
                    <span className="text-indigo-400">{firstName}!</span> ✂️
                  </h2>
                  <p className={`text-slate-400 text-base md:text-lg ${isUrdu ? "font-urdu" : ""}`}>
                    {t("welcomeSubtitle")}
                  </p>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className={`mt-8 px-8 py-3.5 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all flex items-center gap-3 text-sm ${isUrdu ? "font-urdu" : ""}`}
                  >
                    {t("getStarted")} <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 p-4 md:p-10 min-h-[60vh]">
                {activeTab === "profile" && <CustomerProfile />}
                {activeTab === "addresses" && <CustomerAddresses />}
                {activeTab === "preferences" && <CustomerPreferences />}
                {activeTab === "measurements" && <MeasurementManagement />}
                {activeTab === "ordertracking" && (
                  selectedOrderId ? (
                    <OrderTracking orderId={selectedOrderId} userRole={userData.role} />
                  ) : (
                    <FlowGuide
                      steps={[
                        "Go to Order History.",
                        "Find the order you want to track.",
                        "Click \"Track\" on that order to see its live status here.",
                      ]}
                      ctaLabel="Go to Order History"
                      onCta={() => handleTabClick("orders")}
                    />
                  )
                )}
                {activeTab === "orders" && <OrderHistory onTrackOrder={handleTrackOrder} />}
                {activeTab === "reviews" && <MyReviews />}
                {activeTab === "tailor-feedback" && <MyTailorFeedback />}
                {activeTab === "tailors" && <TailorsList />}
                {activeTab === "shopfinder" && <ShopFinder />}
                {activeTab === "orderbooking" && (
                  <FlowGuide
                    steps={[
                      "Go to Shop Finder.",
                      "Select a registered Tailor from the list.",
                      "Click \"Book Now\" on that tailor to start and confirm your order.",
                    ]}
                    ctaLabel="Go to Shop Finder"
                    onCta={() => handleTabClick("shopfinder")}
                  />
                )}
                {activeTab === "visitscheduler" && (
                  <FlowGuide
                    steps={[
                      "Go to Tailor List.",
                      "Registered tailors are shown there — choose one.",
                      "Click \"Book Home Visit\" on that tailor to send your visit request.",
                    ]}
                    ctaLabel="Go to Tailor List"
                    onCta={() => handleTabClick("tailors")}
                  />
                )}
                {activeTab === "promotions" && <PromotionsPanel role="customer" />}
                {activeTab === "notifications" && <NotificationsList userId={userId} />}
                {activeTab === "chatbot" && <ChatWidget />}
              </div>
            </div>
          )}
        </div>

        <footer
          className={`py-4 px-8 text-center md:text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-white border-t border-slate-100 ${isUrdu ? "font-urdu" : ""}`}
        >
          {t("footer")}
        </footer>
      </main>
    </div>
  );
};

export default CustomerDashboard;
