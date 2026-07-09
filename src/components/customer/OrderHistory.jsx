import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package, Calendar, Clock, Shirt, LocateFixed, Receipt,
  CreditCard, CheckCircle2, X, Download, User, Wallet, Star
} from "lucide-react";
import ReviewForm from "./ReviewForm";
import { getOrderReview } from "../../services/reviewService";
import { useLanguage } from "../../context/LanguageContext";

const API_BASE_URL = "http://localhost:5000/api/customer";

const getStatusClasses = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "completed": return "bg-green-100 text-green-800 border-green-200";
    case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentStatusClasses = (status) => {
  const s = status?.toLowerCase();
  if (s === 'paid') return "text-green-600 bg-green-50 border-green-100";
  if (s === 'partially_paid') return "text-orange-600 bg-orange-50 border-orange-100";
  return "text-red-600 bg-red-50 border-red-100";
};

const COMPLETED_STATUSES = ["completed", "delivered", "ready"];

const OrderHistory = ({ onTrackOrder }) => {
  const { t, isUrdu, dir } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState({});
  const urduClass = isUrdu ? "font-urdu" : "";

  const userStr = localStorage.getItem("user");
  const customer = userStr ? JSON.parse(userStr) : null;
  const customerId = customer?._id || customer?.id;

  useEffect(() => {
    if (customerId) fetchOrders();
  }, [customerId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders?customerId=${customerId}`);
      const orderList = response.data.orders || [];
      setOrders(orderList);

      const reviewChecks = await Promise.allSettled(
        orderList
          .filter((o) => COMPLETED_STATUSES.includes(o.status?.toLowerCase()))
          .map(async (o) => {
            try {
              const res = await getOrderReview(o._id);
              return { orderId: o._id, reviewed: !!res.data?.review || !!res.data?._id };
            } catch {
              return { orderId: o._id, reviewed: false };
            }
          })
      );
      const reviewed = {};
      reviewChecks.forEach((r) => {
        if (r.status === "fulfilled") reviewed[r.value.orderId] = r.value.reviewed;
      });
      setReviewedOrders(reviewed);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ReceiptModal = ({ order }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300" dir={dir}>
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${urduClass}`}>
            <Receipt /> {t("digitalReceipt")}
          </h3>
          <button onClick={() => setShowReceipt(null)} className="hover:bg-indigo-500 p-1 rounded-full"><X /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <h4 className={`text-2xl font-black text-gray-800 uppercase tracking-tighter ${urduClass}`}>
              {t("appName")}
            </h4>
            <p className={`text-gray-400 text-xs ${urduClass}`}>{t("officialInvoice")}</p>
          </div>

          <div className="space-y-3 border-y py-4 border-dashed">
            <div className="flex justify-between text-sm">
              <span className={`text-gray-500 ${urduClass}`}>{t("invoiceNo")}</span>
              <span className="font-mono font-bold">{order.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={`text-gray-500 ${urduClass}`}>{t("customerLabel")}</span>
              <span className="font-bold">{customer?.name || "User"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={`text-gray-500 ${urduClass}`}>{t("dateTime")}</span>
              <span className="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">{order.stitchingType}</span>
              <span className="font-bold">Rs. {order.totalPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 italic">
              <span className={urduClass}>{t("paymentMethod")}</span>
              <span className="capitalize font-bold text-indigo-600">{order.paymentMethod || 'Card'}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between text-sm text-green-600 font-bold">
              <span className={urduClass}>{t("amountPaid")}</span>
              <span>Rs. {order.paidAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-orange-600 font-bold border-t pt-2">
              <span className={urduClass}>{t("remainingBalance")}</span>
              <span>Rs. {order.totalPrice - order.paidAmount}</span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className={`w-full bg-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all ${urduClass}`}
          >
            <Download size={18} /> {t("downloadPdf")}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`p-20 text-center animate-pulse ${urduClass}`}>
        {t("loadingHistory")}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen" dir={dir}>
      <h2 className={`text-3xl font-black text-gray-800 mb-8 ${urduClass}`}>
        {t("billingHistory")}
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border-2 border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b rounded-t-[2rem]">
              <button
                onClick={() => setShowReceipt(order)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm"><Receipt size={18} /></div>
                <div className="text-left">
                  <p className={`text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none ${urduClass}`}>
                    {t("invoiceClickView")}
                  </p>
                  <p className="font-mono font-bold">{order.invoiceNumber}</p>
                </div>
              </button>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${order.paymentMethod === 'cash' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                  {order.paymentMethod === 'cash' ? <Wallet size={10}/> : <CreditCard size={10}/>}
                  {order.paymentMethod || 'Card'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPaymentStatusClasses(order.paymentStatus)}`}>
                  {order.paymentStatus?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Shirt /></div>
                <div>
                  <p className={`text-xs text-gray-400 font-bold uppercase ${urduClass}`}>{t("item")}</p>
                  <p className="font-bold">{order.stitchingType}</p>
                </div>
              </div>

              <div>
                <p className={`text-xs text-gray-400 font-bold uppercase ${urduClass}`}>{t("paymentSummary")}</p>
                <p className="font-bold text-gray-800">Rs. {order.paidAmount} / {order.totalPrice}</p>
                <p className={`text-[10px] font-bold ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'} ${urduClass}`}>
                  {order.paymentStatus === 'paid'
                    ? t("fullyPaid")
                    : `${t("balance")} Rs. ${order.totalPrice - order.paidAmount}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Calendar /></div>
                <div>
                  <p className={`text-xs text-gray-400 font-bold uppercase ${urduClass}`}>{t("delivery")}</p>
                  <p className="font-bold">{order.deliveryDate}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onTrackOrder(order._id)}
                  className={`bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 ${urduClass}`}
                >
                  <LocateFixed size={18} /> {t("trackOrder")}
                </button>
                {COMPLETED_STATUSES.includes(order.status?.toLowerCase()) && (
                  reviewedOrders[order._id] ? (
                    <span className={`text-center text-xs font-bold text-green-600 flex items-center justify-center gap-1 ${urduClass}`}>
                      <CheckCircle2 size={14} /> {t("reviewSubmitted")}
                    </span>
                  ) : (
                    <button
                      onClick={() => setReviewOrder(order)}
                      className={`bg-yellow-400 text-yellow-900 px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition text-sm ${urduClass}`}
                    >
                      <Star size={16} /> {t("rateTailor")}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showReceipt && <ReceiptModal order={showReceipt} />}
      {reviewOrder && (
        <ReviewForm
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => {
            setReviewedOrders((prev) => ({ ...prev, [reviewOrder._id]: true }));
            alert(t("thankYouReview"));
          }}
        />
      )}
    </div>
  );
};

export default OrderHistory;
