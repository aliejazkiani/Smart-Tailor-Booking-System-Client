import React, { useState, useEffect } from "react";
import API from "../../utils/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const RevenueReports = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get("/admin/revenue");
        setOrders(res.data.transactions || []);
        setTotalRevenue(res.data.totalAmount || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  const handleExport = () => {
    const headers = ["Invoice", "Customer", "Tailor", "Amount", "Status", "Date"];
    const rows = filteredOrders.map((o) => [
      o.invoiceNumber || "—",
      o.customerId?.fullName || "—",
      o.tailorId?.shopName || o.tailorId?.fullName || "—",
      o.totalPrice,
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Sales</p>
          <h2 className="text-4xl font-black">Rs. {totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-blue-400 font-bold uppercase text-xs tracking-widest">Platform Profit (10%)</p>
          <h2 className="text-2xl font-black text-blue-400">Rs. {(totalRevenue * 0.1).toLocaleString()}</h2>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Orders</p>
          <h2 className="text-2xl font-black">{orders.length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-black text-slate-800">Order Transactions</h3>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleExport}
              className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Export CSV
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center py-16 text-slate-400 font-medium">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Tailor / Shop</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {order.invoiceNumber || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{order.customerId?.fullName || "—"}</p>
                      <p className="text-xs text-slate-400">{order.customerId?.email || ""}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {order.tailorId?.shopName || order.tailorId?.fullName || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      Rs. {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                      {order.paymentMethod || "—"} / {order.paymentStatus || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueReports;
