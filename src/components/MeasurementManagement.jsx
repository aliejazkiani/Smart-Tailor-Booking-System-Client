import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MeasurementForm from './MeasurementForm';
import RecordUploader from './RecordUploader';
import ReferencePhoto from './ReferencePhoto';
import TailorUpdateView from './TailorUpdateView';
import { Loader2, Save, ClipboardList } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MeasurementManagement = () => {
  const navigate = useNavigate();
  const { t, isUrdu, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [measurements, setMeasurements] = useState({});
  const [category, setCategory] = useState('men');
  const [tailorNotes, setTailorNotes] = useState("");
  const [recordFile, setRecordFile] = useState(null);
  const [referencePhoto, setReferencePhoto] = useState(null);
  const urduClass = isUrdu ? "font-urdu" : "";

  useEffect(() => {
    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) { setFetching(false); return; }
      const user = JSON.parse(userStr);

      try {
        const response = await fetch(`http://localhost:5000/api/measurements/${user._id || user.id}`);
        const data = await response.json();
        if (data) {
          setMeasurements(data.measurements || {});
          setCategory(data.category || 'men');
          setTailorNotes(data.tailorNotes || "");
        }
      } catch (err) {
        console.log("No previous data found.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveAll = async () => {
    if (loading) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) return alert(t("pleaseLogin"));
    const user = JSON.parse(userStr);

    setLoading(true);
    const formData = new FormData();
    formData.append('userId', user._id || user.id);
    formData.append('category', category);
    formData.append('measurements', JSON.stringify(measurements));
    formData.append('tailorNotes', tailorNotes);

    if (recordFile) formData.append('previousRecords', recordFile);
    if (referencePhoto) formData.append('referencePhoto', referencePhoto);

    try {
      const response = await fetch('http://localhost:5000/api/measurements/save', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${t("profileSynced")}`);
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      alert(`❌ ${t("serverError")}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={`text-center p-20 text-gray-400 font-bold ${urduClass}`}>
        {t("syncingServer")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4" dir={dir}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className={`text-4xl font-black text-slate-900 tracking-tight ${urduClass}`}>
              {t("digitalSizeCard")}
            </h1>
            <p className={`text-slate-500 ${urduClass}`}>{t("measurementsSubtitle")}</p>
          </div>
          <button
            onClick={() => navigate('/my-measurements')}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg"
          >
            <ClipboardList size={18} /> View My Measurement Sheet
          </button>
        </div>

        <MeasurementForm
          data={measurements}
          updateData={setMeasurements}
          category={category}
          setCategory={setCategory}
        />

        <RecordUploader setFile={setRecordFile} fileName={recordFile?.name} />
        <ReferencePhoto setPhoto={setReferencePhoto} />
        <TailorUpdateView notes={tailorNotes} />

        <button
          onClick={handleSaveAll}
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl transition-all ${urduClass} ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save /> {t("syncAllDetails")}</>}
        </button>
      </div>
    </div>
  );
};

export default MeasurementManagement;
