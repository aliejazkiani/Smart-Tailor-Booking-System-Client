import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Ruler } from 'lucide-react';
import MeasurementGuideDiagram from '../components/MeasurementGuideDiagram';

const formatLabel = (text) => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const MeasurementSheet = () => {
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) { setLoading(false); return; }
      const user = JSON.parse(userStr);

      try {
        const res = await fetch(`http://localhost:5000/api/measurements/${user._id || user.id}`);
        const data = await res.json();
        setRecord(data);
      } catch (err) {
        console.error('Failed to load measurement sheet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const measurementEntries = record?.measurements ? Object.entries(record.measurements) : [];
  const fields = measurementEntries.map(([key]) => key);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Measurement Sheet</h1>
            <p className="text-slate-500">A complete view of your saved sizes and what each term means.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {!record || measurementEntries.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 text-center text-slate-400 font-semibold">
            No measurements saved yet. Go to the Measurements tab to add yours.
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><Ruler size={20} /></span>
                Saved Measurements ({formatLabel(record.category || 'men')})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                      <th className="px-4 py-3 border-b">Measurement</th>
                      <th className="px-4 py-3 border-b">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurementEntries.map(([key, value]) => (
                      <tr key={key} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-700">{formatLabel(key)}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {value || 'N/A'}{key !== 'neckDesign' && key !== 'age' && value ? ' in' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {record.lastUpdated && (
                <p className="mt-4 text-xs text-slate-400 font-semibold">
                  Last updated: {new Date(record.lastUpdated).toLocaleDateString()}
                </p>
              )}
              {record.tailorNotes && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                  <span className="font-bold">Tailor's Note: </span>{record.tailorNotes}
                </div>
              )}
            </div>

            <MeasurementGuideDiagram fields={fields} category={record.category || 'men'} />
          </>
        )}
      </div>
    </div>
  );
};

export default MeasurementSheet;
