import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Scissors, Shirt, Clock, CheckCircle, ChevronLeft, ChevronRight, 
  ShoppingBag, Loader2, CreditCard, ShieldCheck, Receipt, Wallet // Added Wallet icon
} from 'lucide-react';
import axios from 'axios';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm'; 

// Stripe Public Key
const stripePromise = loadStripe('pk_test_51TIvIOAbS2sf1xJ0fJqjaphffqpFmpUKlauq9aFkuo995BE3oKPyWzQyogrreVw8VlhLwCzLBoZmAaSvrYEqo7if00hxyc4TFn');

const OrderBooking = () => {
  const navigate = useNavigate();
  const { tailorId } = useParams();

  // State Management
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // NEW: 'card' or 'cash'
  const [paymentOption, setPaymentOption] = useState('full'); 
  const [orderDetails, setOrderDetails] = useState({
    stitchingType: null,
    fabricSource: null,
    serviceType: 'standard', 
    basePrice: 0,
  });

  const stitchingTypes = [
    { id: 1, name: 'Shalwar Kameez', price: 1500, icon: <Shirt className="w-8 h-8"/> },
    { id: 2, name: 'Kurta Pajama', price: 1200, icon: <Scissors className="w-8 h-8"/> },
    { id: 3, name: 'Pant Coat (Suit)', price: 5000, icon: <ShoppingBag className="w-8 h-8"/> },
    { id: 4, name: 'Waistcoat', price: 2000, icon: <Shirt className="w-8 h-8"/> },
  ];

  const getEstimatedDate = (type) => {
    const date = new Date();
    date.setDate(date.getDate() + (type === 'urgent' ? 2 : 7));
    return date.toDateString();
  };

  const totalPrice = orderDetails.basePrice + (orderDetails.serviceType === 'urgent' ? 500 : 0);
  const payableNow = paymentOption === 'full' ? totalPrice : totalPrice * 0.5;

  const handleBooking = async () => {
    const userStr = localStorage.getItem("user");
    const customer = userStr ? JSON.parse(userStr) : null;
    const customerId = customer?._id || customer?.id;

    if (!customerId) {
        alert("Session Expired! Please login again.");
        navigate('/login');
        return;
    }

    const payload = {
      customerId,
      tailorId,
      stitchingType: orderDetails.stitchingType,
      fabricSource: orderDetails.fabricSource,
      serviceType: orderDetails.serviceType,
      totalPrice: Number(totalPrice),
      // NEW: Agar cash hai to paidAmount 0 hoga
      paidAmount: paymentMethod === 'card' ? Number(payableNow) : 0, 
      paymentOption: paymentMethod === 'card' ? paymentOption : 'full',
      paymentMethod: paymentMethod, // NEW: 'card' or 'cash'
      deliveryDate: getEstimatedDate(orderDetails.serviceType)
    };

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/customer/process-payment', payload);
      
      if (response.data.success) {
        alert(`✅ Order Successful!\nMethod: ${paymentMethod.toUpperCase()}\nInvoice: ${response.data.order.invoiceNumber}`);
        navigate('/customer-dashboard');
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step Components ---
  const StepOne = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h3 className="text-xl font-bold text-gray-800">1. Stitching Type</h3>
      <div className="grid grid-cols-2 gap-4">
        {stitchingTypes.map((type) => (
          <button key={type.id} onClick={() => { setOrderDetails({ ...orderDetails, stitchingType: type.name, basePrice: type.price }); setStep(2); }}
            className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all 
              ${orderDetails.stitchingType === type.name ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100 bg-white hover:border-indigo-200'}`}>
            <div className="text-indigo-600">{type.icon}</div>
            <span className="font-bold text-gray-700">{type.name}</span>
            <span className="text-xs text-indigo-500 font-bold">Rs. {type.price}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const StepTwo = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">2. Fabric Source</h3>
      {['own', 'tailor'].map((source) => (
        <button key={source} onClick={() => setOrderDetails({ ...orderDetails, fabricSource: source })}
          className={`w-full p-5 border-2 rounded-2xl flex items-center justify-between transition-all 
            ${orderDetails.fabricSource === source ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white'}`}>
          <div className="text-left">
            <p className="font-bold text-gray-800 capitalize">{source === 'own' ? 'I have my own Fabric' : 'Select from Tailor Shop'}</p>
            <p className="text-xs text-gray-400">{source === 'own' ? 'Pickup will be arranged' : 'Premium catalog available'}</p>
          </div>
          {orderDetails.fabricSource === source && <CheckCircle className="text-indigo-600" />}
        </button>
      ))}
    </div>
  );

  const StepThree = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">3. Delivery Speed</h3>
      {['standard', 'urgent'].map((type) => (
        <button key={type} onClick={() => setOrderDetails({ ...orderDetails, serviceType: type })}
          className={`w-full p-5 border-2 rounded-2xl flex justify-between items-center transition-all 
            ${orderDetails.serviceType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white'}`}>
          <div className="text-left">
            <p className="font-bold text-gray-800 capitalize">{type} Delivery</p>
            <p className="text-xs text-gray-400">{type === 'urgent' ? 'Ready in 2 Days (+Rs. 500)' : 'Standard 7 Days delivery'}</p>
          </div>
          {orderDetails.serviceType === type && <CheckCircle className="text-indigo-600" />}
        </button>
      ))}
    </div>
  );

  const StepFour = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">4. Summary</h3>
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 space-y-3">
        <div className="flex justify-between text-sm"><span className="text-gray-400">Items:</span><span className="font-bold">{orderDetails.stitchingType}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Fabric:</span><span className="font-bold capitalize">{orderDetails.fabricSource}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Est. Date:</span><span className="font-bold text-indigo-600">{getEstimatedDate(orderDetails.serviceType)}</span></div>
        <div className="pt-3 border-t flex justify-between items-center">
          <span className="font-bold text-lg">Total Bill:</span>
          <span className="text-2xl font-black text-indigo-700">Rs. {totalPrice}</span>
        </div>
      </div>
    </div>
  );

  // --- Step 5 Updated with Card vs Cash ---
  const StepFive = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">5. Payment Method</h3>
        <Receipt className="text-indigo-600" />
      </div>

      {/* NEW: Payment Method Toggles */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>
          <CreditCard size={18} /> Card
        </button>
        <button onClick={() => setPaymentMethod('cash')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>
          <Wallet size={18} /> Cash
        </button>
      </div>

      {paymentMethod === 'card' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaymentOption('full')} className={`p-4 border-2 rounded-2xl text-center ${paymentOption === 'full' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Full</p>
              <p className="font-bold">Rs. {totalPrice}</p>
            </button>
            <button onClick={() => setPaymentOption('advance')} className={`p-4 border-2 rounded-2xl text-center ${paymentOption === 'advance' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase">50% Adv.</p>
              <p className="font-bold">Rs. {totalPrice * 0.5}</p>
            </button>
          </div>
          <Elements stripe={stripePromise}><CheckoutForm /></Elements>
          <div className="bg-indigo-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-xl">
            <div><p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest leading-none">Payable Now</p><p className="text-2xl font-black italic">Rs. {payableNow}</p></div>
            <ShieldCheck size={32} className="opacity-30" />
          </div>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-green-200 rounded-[2rem] bg-green-50 text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600"><Receipt size={32}/></div>
          <h4 className="text-xl font-bold text-green-800">Cash on Delivery</h4>
          <p className="text-sm text-green-600 px-4">You will pay the total amount at the time of delivery.</p>
          <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase">Total to Pay</p>
            <p className="text-3xl font-black text-green-700">Rs. {totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-black tracking-tight uppercase">Order Booking</h2>
          <p className="text-indigo-100 text-xs font-medium opacity-80">Module 9: Payment & Billing System</p>
          <div className="mt-6 flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-white' : 'bg-indigo-400'}`} />
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-8 min-h-[440px]">
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}
          {step === 5 && <StepFive />}
        </div>

        {/* Navigation */}
        <div className="p-8 pt-0 flex justify-between items-center">
          <button onClick={() => setStep(step - 1)} disabled={step === 1 || isLoading}
            className={`flex items-center gap-1 font-bold text-gray-400 hover:text-indigo-600 transition-colors ${step === 1 ? 'invisible' : ''}`}>
            <ChevronLeft size={20} /> Back
          </button>
          
          {step < 5 ? (
            <button onClick={() => setStep(step + 1)} disabled={(step === 1 && !orderDetails.stitchingType) || (step === 2 && !orderDetails.fabricSource)}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-gray-200">
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={handleBooking} disabled={isLoading}
              className={`px-10 py-4 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 ${paymentMethod === 'card' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'CONFIRM ORDER'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBooking;