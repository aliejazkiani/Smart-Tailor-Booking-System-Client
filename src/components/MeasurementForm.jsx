import React from 'react';
import { User, UserRound, Baby, Ruler } from 'lucide-react'; // 'ruler' ko 'Ruler' kar diya

const MeasurementForm = ({ data, updateData, category, setCategory }) => {
  // Category ke mutabiq fields ki list
  const fieldConfigs = {
    men: [
      'shirtLength', 'chest', 'waist', 'shoulder', 
      'sleeves', 'neck', 'trouserLength', 'bottom'
    ],
    women: [
      'shirtLength', 'bust', 'waist', 'hips', 
      'shoulder', 'sleeves', 'trouserLength', 'neckDesign'
    ],
    child: [
      'age', 'shirtLength', 'chest', 'waist', 
      'shoulder', 'sleeves', 'trouserLength', 'bottom'
    ]
  };

  // Label formatting: shirtLength -> Shirt Length
  const formatLabel = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Ruler size={20} /> {/* Yahan Ruler use kiya hai */}
        </span>
        1. Select Category & Measurements
      </h2>

      {/* Category Selection Tabs */}
      <div className="flex gap-3 mb-8">
        {[
          { id: 'men', label: 'Men', icon: <User className="w-4 h-4" /> },
          { id: 'women', label: 'Women', icon: <UserRound className="w-4 h-4" /> },
          { id: 'child', label: 'Child', icon: <Baby className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-200 ${
              category === tab.id
                ? 'bg-blue-600 text-white shadow-lg scale-[1.02]'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Form Fields Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {fieldConfigs[category].map((field) => (
          <div key={field} className="flex flex-col group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1 transition-colors group-focus-within:text-blue-500">
              {formatLabel(field)}
            </label>
            <div className="relative">
              <input
                type={field === 'neckDesign' || field === 'age' ? "text" : "number"}
                name={field}
                value={data[field] || ''}
                onChange={handleChange}
                placeholder={field === 'neckDesign' ? "e.g. V-Shape" : "0.0"}
                className="w-full p-3 border-2 border-gray-50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-gray-50/50 transition-all text-gray-700 font-semibold placeholder:text-gray-300 shadow-sm"
              />
              {field !== 'neckDesign' && field !== 'age' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">
                  IN
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-400 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
        <span className="text-blue-500 font-bold">TIP:</span>
        <span>Please provide measurements in inches for the best fit.</span>
      </div>
    </div>
  );
};

export default MeasurementForm;