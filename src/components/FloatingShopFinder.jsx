// FloatingShopFinder.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const FloatingShopFinder = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/shop-finder')}
      className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center transition-transform hover:scale-110"
      title="Find Tailors Nearby"
    >
      <MapPin className="w-6 h-6" />
      <span className="ml-2 font-bold hidden md:inline">Find Shop</span>
    </button>
  );
};

export default FloatingShopFinder;