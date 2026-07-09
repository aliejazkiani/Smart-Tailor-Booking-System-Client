import React from 'react';
import { UserCheck, Lock, ClipboardCheck } from 'lucide-react';

const TailorUpdateView = ({ notes }) => {
  const isUpdated = notes && notes.length > 0;

  return (
    <div className={`p-6 rounded-xl border-2 transition-all ${
      isUpdated ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold flex items-center ${isUpdated ? 'text-green-800' : 'text-blue-800'}`}>
          {isUpdated ? <ClipboardCheck className="mr-2" /> : <UserCheck className="mr-2" />}
          4. Tailor Final Verification
        </h2>
        {isUpdated ? (
           <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">VERIFIED</span>
        ) : (
           <Lock className="text-blue-400 w-5 h-5" />
        )}
      </div>

      <p className="text-sm font-medium leading-relaxed">
        {isUpdated ? (
          <span className="text-slate-700 italic">"{notes}"</span>
        ) : (
          <span className="text-blue-700 italic">* Locked: Tailor will update after your physical trial.</span>
        )}
      </p>
    </div>
  );
};

export default TailorUpdateView;