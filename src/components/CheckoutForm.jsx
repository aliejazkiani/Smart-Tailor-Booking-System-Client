import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 border-2 border-gray-100 rounded-2xl bg-white focus-within:border-indigo-500 transition-all shadow-sm">
        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">
          Secure Card Payment (Stripe)
        </label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
          }} 
        />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">
        <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded italic">SSL Encrypted Connection</span>
      </div>
    </div>
  );
};

export default CheckoutForm;