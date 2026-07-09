import React, { useEffect, useState } from "react";
import { FaBell, FaBox, FaCalendarAlt, FaTruck, FaTag, FaCheck, FaTrash } from "react-icons/fa";
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
  order_confirmation: "Order Confirmation",
  appointment_reminder: "Appointment Reminder",
  delivery_notification: "Delivery Update",
  promotion: "Promotion & Offer",
};

const NotificationsList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!userId) return;
    try {
      const res = await getNotifications(userId);
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading alerts...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FaBell className="text-indigo-500" /> Notifications & Alerts
          </h2>
          <p className="text-slate-500 mt-1">Order updates, appointments, deliveries, and offers.</p>
        </div>
        <button
          onClick={() => markAllNotificationsRead(userId).then(fetchData)}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <FaBell className="text-5xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex gap-4 p-5 rounded-2xl border-2 transition ${
                n.isRead ? "border-slate-100 bg-white" : "border-indigo-100 bg-indigo-50/30"
              }`}
            >
              <div className="text-2xl mt-1">{typeIcons[n.type]}</div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {typeLabels[n.type]}
                </span>
                <h3 className="font-bold text-slate-800 text-lg">{n.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                {!n.isRead && (
                  <button onClick={() => markNotificationRead(n._id).then(fetchData)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <FaCheck />
                  </button>
                )}
                <button onClick={() => deleteNotification(n._id).then(fetchData)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
