import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Scissors, ShoppingBag, Clock, ChevronRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Top Welcome Section */}
      <div className="bg-indigo-700 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Salam, User! 👋</h1>
            <p className="text-indigo-200 text-sm">Need a stitch? Let's find a tailor.</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="font-bold text-lg">U</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        
        {/* 2. DIRECT ACCESS: Shop Finder (Hero Card) */}
        {/* Yeh wo Direct Icon/Card hai jo aap mang rahe thay */}
        <div 
          onClick={() => navigate('/shop-finder')}
          className="bg-white rounded-2xl p-5 shadow-xl border border-indigo-50 flex items-center gap-4 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
        >
          {/* Decorative Background Circle */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition"></div>
          
          <div className="bg-indigo-100 p-4 rounded-full z-10">
            <MapPin className="w-8 h-8 text-indigo-600" />
          </div>
          
          <div className="flex-1 z-10">
            <h2 className="text-xl font-bold text-gray-800">Find Nearby Tailors</h2>
            <p className="text-sm text-gray-500">View map, check ratings & navigate</p>
          </div>

          <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md z-10">
             <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* 3. Other Quick Actions (Grid) */}
        <h3 className="text-gray-800 font-bold mt-8 mb-4 ml-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition">
            <div className="bg-purple-100 p-3 rounded-full">
                <Scissors className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-700">New Order</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition">
            <div className="bg-green-100 p-3 rounded-full">
                <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-semibold text-gray-700">My Orders</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition">
            <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="font-semibold text-gray-700">History</span>
          </div>

          {/* Dummy for layout */}
          <div className="bg-gray-100 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
            <span className="text-gray-400 text-sm">Coming Soon</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;