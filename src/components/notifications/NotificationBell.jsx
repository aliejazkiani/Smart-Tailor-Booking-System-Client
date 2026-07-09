import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaCheck, FaTrash, FaBox, FaCalendarAlt, FaTruck, FaTag } from "react-icons/fa";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/notificationService";

const typeIcons = {
  order_confirmation: <FaBox className="text-blue-500" />,
  appointment_reminder: <FaCalendarAlt className="text-purple-500" />,
  delivery_notification: <FaTruck className="text-green-500" />,
  promotion: <FaTag className="text-orange-500" />,
};

const typeLabels = {
  order_confirmation: "Order",
  appointment_reminder: "Appointment",
  delivery_notification: "Delivery",
  promotion: "Offer",
};

const NotificationBell = ({ userId, onPromotionsClick }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data?.notifications || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead(userId);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition"
      >
        <FaBell className="text-slate-600" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
            <h3 className="font-bold text-sm">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleReadAll}
                  className="text-[10px] bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30"
                >
                  Mark all read
                </button>
              )}
              {onPromotionsClick && (
                <button
                  onClick={() => { setOpen(false); onPromotionsClick(); }}
                  className="text-[10px] bg-orange-500 px-2 py-1 rounded-lg hover:bg-orange-400"
                >
                  Offers
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-slate-400 text-sm">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-slate-400 text-sm">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition ${
                    !n.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{typeIcons[n.type] || <FaBell />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {typeLabels[n.type] || n.type}
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="font-bold text-sm text-slate-800 truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!n.isRead && (
                        <button
                          onClick={() => handleRead(n._id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark read"
                        >
                          <FaCheck size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
