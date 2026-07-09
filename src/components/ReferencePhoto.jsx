import React, { useState } from 'react';
import { ImagePlus, X, Lightbulb, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ReferencePhoto = ({ setPhoto }) => {
  const { t, isUrdu, dir } = useLanguage();
  const [preview, setPreview] = useState(null);
  const urduClass = isUrdu ? "font-urdu" : "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setPhoto(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6" dir={dir}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold text-gray-800 flex items-center ${urduClass}`}>
          <ImagePlus className="mr-2 text-pink-600" /> {t("designReference")}
        </h2>

        <div className="mt-3 bg-pink-50 border-l-4 border-pink-400 p-4 rounded-r-md">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0 text-pink-600" />
            <p className={`text-[13px] text-pink-900 leading-relaxed ${urduClass}`}>
              {t("designIdea")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {!preview ? (
          <label className="group w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all duration-300">
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            <div className="bg-pink-100 p-3 rounded-full group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-pink-600" />
            </div>
            <span className={`text-gray-500 text-xs font-bold mt-2 ${urduClass}`}>{t("addDesignPhoto")}</span>
          </label>
        ) : (
          <div className="relative group w-48 h-60">
            <img
              src={preview}
              alt="Reference"
              className="w-full h-full object-cover rounded-2xl border-2 border-pink-200 shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className={`text-white text-xs font-bold ${urduClass}`}>{t("selectedDesign")}</p>
            </div>
            <button
              onClick={handleRemove}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors border-2 border-white"
              title={t("removePhoto")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!preview && (
          <div className="flex-1 min-w-[200px]">
            <h4 className={`text-sm font-bold text-gray-700 mb-2 ${urduClass}`}>{t("tipsTitle")}</h4>
            <ul className={`text-xs text-gray-500 space-y-1.5 ${urduClass}`}>
              <li className="flex items-center gap-2">✨ {t("tip1")}</li>
              <li className="flex items-center gap-2">✨ {t("tip2")}</li>
              <li className="flex items-center gap-2">✨ {t("tip3")}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferencePhoto;
