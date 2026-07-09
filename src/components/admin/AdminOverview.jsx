import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { FaFileInvoiceDollar, FaStore, FaUsers, FaCheckCircle, FaBoxOpen, FaUserClock, FaUserSlash } from "react-icons/fa";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    revenue: 0, tailors: 0, customers: 0, pending: 0,
    totalOrders: 0, pendingShops: 0, blockedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `Rs. ${stats.revenue}`, color: "bg-green-500", icon: <FaFileInvoiceDollar /> },
    { label: "Active Tailors", value: stats.tailors, color: "bg-blue-500", icon: <FaStore /> },
    { label: "Total Customers", value: stats.customers, color: "bg-purple-500", icon: <FaUsers /> },
    { label: "Pending Orders", value: stats.pending, color: "bg-orange-500", icon: <FaCheckCircle /> },
    { label: "Total Orders", value: stats.totalOrders, color: "bg-indigo-500", icon: <FaBoxOpen /> },
    { label: "Pending Shop Approvals", value: stats.pendingShops, color: "bg-yellow-500", icon: <FaUserClock /> },
    { label: "Blocked Accounts", value: stats.blockedUsers, color: "bg-red-500", icon: <FaUserSlash /> },
  ];

  if (loading) return <div className="p-10 text-center font-bold">Loading Stats...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;