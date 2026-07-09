import React from 'react';
import { FileText, UploadCloud, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RecordUploader = ({ setFile, fileName }) => {
  const { t, isUrdu, dir } = useLanguage();
  const urduClass = isUrdu ? "font-urdu" : "";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6" dir={dir}>
      <div className="mb-4">
        <h2 className={`text-xl font-bold text-gray-800 flex items-center ${urduClass}`}>
          <FileText className="mr-2 text-blue-600" /> {t("previousSlips")}
        </h2>

        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
          <div className="flex gap-3">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <p className={`text-[13px] text-blue-900 leading-relaxed ${urduClass}`}>
              {t("recordNote")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden group">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,application/pdf"
        />

        {fileName ? (
          <div className="flex flex-col items-center text-green-600 animate-in zoom-in-95 duration-300">
            <CheckCircle className="w-14 h-14 mb-2 drop-shadow-sm" />
            <p className={`font-bold text-sm ${urduClass}`}>{t("fileSelected")}</p>
            <p className="text-xs text-gray-500 mt-1">{fileName}</p>
            <span className={`mt-3 text-[10px] bg-green-100 px-3 py-1 rounded-full text-green-700 font-bold uppercase tracking-wider ${urduClass}`}>
              {t("clickToChange")}
            </span>
          </div>
        ) : (
          <>
            <div className="bg-blue-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-blue-600" />
            </div>
            <p className={`text-gray-700 font-bold text-lg ${urduClass}`}>{t("uploadOldReceipt")}</p>
            <p className={`text-gray-400 text-xs mt-1 ${urduClass}`}>{t("tapSelectPhoto")}</p>

            <div className="mt-4 flex gap-2">
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded">JPG</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded">PNG</span>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded">PDF</span>
            </div>
          </>
        )}
      </div>

      <p className={`mt-4 text-[11px] text-gray-400 italic text-center ${urduClass}`}>
        {t("recordExample")}
      </p>
    </div>
  );
};

export default RecordUploader;
