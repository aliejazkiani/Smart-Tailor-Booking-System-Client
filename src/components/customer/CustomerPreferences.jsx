import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { User, UserRound, Baby, Scissors, Ruler, ClipboardList, Shirt, MoveVertical } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const CustomerPreferences = () => {
  const { t, isUrdu, dir } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const urduClass = isUrdu ? "font-urdu" : "";

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/customer/preferences`);
      setPreferences(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (catId) => {
    if (!isEditing) return;
    setFormData((prev) => ({ ...prev, category: catId }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/customer/preferences`, formData);
      setPreferences(response.data);
      setFormData(response.data);
      setIsEditing(false);
      alert(t("preferencesSaved") || "Preferences updated successfully!");
    } catch (err) {
      alert(t("preferencesSaveFailed"));
    }
  };

  const categoryLabel = (cat) => {
    if (cat === "Men") return t("men");
    if (cat === "Women") return t("women");
    if (cat === "Child") return t("child");
    return cat;
  };

  const fieldLabel = (key) => {
    const map = {
      chest: "chest", neck: "neck", shoulderWidth: "shoulder", sleeveLength: "sleeve",
      shirtLength: "shirtLength", pantLength: "pantLength", pantWaist: "pantWaist",
      bust: "bust", underbust: "underbust", blouseLength: "blouseLength",
      skirtLength: "skirtLength", waist: "waist", hip: "hip", totalHeight: "totalHeight",
    };
    return t(map[key] || key);
  };

  if (isLoading) {
    return (
      <div className={`p-20 text-center font-bold text-indigo-600 animate-pulse text-xl ${urduClass}`}>
        {t("loadingPreferences")}
      </div>
    );
  }

  const InputField = ({ labelKey, name, value, icon: Icon }) => (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <label className={`text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2 ${urduClass}`}>
        {Icon && <Icon size={14} className="text-indigo-400" />} {fieldLabel(labelKey || name)}
      </label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            name={name}
            value={value || ""}
            onChange={handleChange}
            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 font-bold text-gray-800 outline-none p-2 rounded-lg"
            placeholder="0.0"
          />
        </div>
      ) : (
        <p className="text-xl font-black text-gray-800">
          {value || "0"}{" "}
          <span className={`text-xs font-normal text-gray-400 italic ${urduClass}`}>{t("inch")}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto my-10 p-4" dir={dir}>
      <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className={`text-3xl font-black flex items-center gap-3 tracking-tight ${urduClass}`}>
              <Scissors size={32} /> {t("tailoringSizes")}
            </h2>
            <p className={`text-sm opacity-90 mt-1 font-medium ${urduClass}`}>
              {t("personalizedFor")} {categoryLabel(formData.category)}
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={`bg-white text-indigo-700 px-8 py-3 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform ${urduClass}`}
            >
              {t("editDetails")}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`bg-green-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-green-600 ${urduClass}`}
              >
                {t("save")}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(preferences);
                }}
                className={`bg-white/20 text-white px-8 py-3 rounded-2xl font-bold backdrop-blur-md ${urduClass}`}
              >
                {t("cancel")}
              </button>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-center gap-6 mb-12">
            {[
              { id: "Men", labelKey: "men", icon: User, color: "blue" },
              { id: "Women", labelKey: "women", icon: UserRound, color: "pink" },
              { id: "Child", labelKey: "child", icon: Baby, color: "orange" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleTabChange(cat.id)}
                className={`flex flex-col items-center justify-center w-32 h-32 rounded-[2rem] border-4 transition-all ${
                  formData.category === cat.id
                    ? `border-${cat.color}-500 bg-${cat.color}-50 text-${cat.color}-600 scale-110 shadow-xl`
                    : "border-gray-50 text-gray-300 opacity-40 grayscale"
                }`}
              >
                <cat.icon size={44} />
                <span className={`font-black mt-2 text-sm uppercase tracking-tighter ${urduClass}`}>
                  {t(cat.labelKey)}
                </span>
              </button>
            ))}
          </div>

          <form className="space-y-10">
            {formData.category === "Men" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <InputField labelKey="chest" name="chest" value={formData.chest} icon={Ruler} />
                <InputField labelKey="neck" name="neck" value={formData.neck} icon={MoveVertical} />
                <InputField labelKey="shoulderWidth" name="shoulderWidth" value={formData.shoulderWidth} icon={Ruler} />
                <InputField labelKey="sleeveLength" name="sleeveLength" value={formData.sleeveLength} icon={Ruler} />
                <InputField labelKey="shirtLength" name="shirtLength" value={formData.shirtLength} icon={Shirt} />
                <InputField labelKey="pantLength" name="pantLength" value={formData.pantLength} icon={MoveVertical} />
                <InputField labelKey="pantWaist" name="pantWaist" value={formData.pantWaist} icon={Ruler} />
              </div>
            )}

            {formData.category === "Women" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <InputField labelKey="bust" name="bust" value={formData.bust} icon={Ruler} />
                <InputField labelKey="underbust" name="underbust" value={formData.underbust} icon={Ruler} />
                <InputField labelKey="shoulderWidth" name="shoulderWidth" value={formData.shoulderWidth} icon={Ruler} />
                <InputField labelKey="sleeveLength" name="sleeveLength" value={formData.sleeveLength} icon={Ruler} />
                <InputField labelKey="blouseLength" name="blouseLength" value={formData.blouseLength} icon={Shirt} />
                <InputField labelKey="skirtLength" name="skirtLength" value={formData.skirtLength} icon={MoveVertical} />
                <InputField labelKey="waist" name="waist" value={formData.waist} icon={Ruler} />
                <InputField labelKey="hip" name="hip" value={formData.hip} icon={Ruler} />
              </div>
            )}

            {formData.category === "Child" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm">
                    <label className={`text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1 mb-2 ${urduClass}`}>
                      <Baby size={16} /> {t("ageGroup")}
                    </label>
                    {isEditing ? (
                      <select
                        name="ageGroup"
                        value={formData.ageGroup || ""}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-orange-200 rounded-xl p-3 font-bold outline-none"
                      >
                        <option value="">{t("selectAge")}</option>
                        <option value="1Y-3Y">{t("age1to3")}</option>
                        <option value="4Y-7Y">{t("age4to7")}</option>
                        <option value="8Y-12Y">{t("age8to12")}</option>
                      </select>
                    ) : (
                      <p className="text-xl font-black text-gray-800">{formData.ageGroup || "N/A"}</p>
                    )}
                  </div>
                  <InputField labelKey="totalHeight" name="totalHeight" value={formData.totalHeight} icon={MoveVertical} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <InputField labelKey="chest" name="chest" value={formData.chest} icon={Ruler} />
                  <InputField labelKey="shoulderWidth" name="shoulderWidth" value={formData.shoulderWidth} icon={Ruler} />
                  <InputField labelKey="sleeveLength" name="sleeveLength" value={formData.sleeveLength} icon={Ruler} />
                  <InputField labelKey="shirtLength" name="shirtLength" value={formData.shirtLength} icon={Shirt} />
                  <InputField labelKey="pantLength" name="pantLength" value={formData.pantLength} icon={MoveVertical} />
                  <InputField labelKey="waist" name="waist" value={formData.waist} icon={Ruler} />
                </div>
              </div>
            )}

            <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <h3 className={`text-sm font-black text-gray-500 uppercase flex items-center gap-2 mb-4 ${urduClass}`}>
                <ClipboardList size={20} className="text-indigo-500" /> {t("specialInstructions")}
              </h3>
              {isEditing ? (
                <textarea
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border-2 border-white focus:border-indigo-500 p-4 rounded-2xl outline-none shadow-sm transition-all"
                  placeholder={t("specialNotesPlaceholder")}
                ></textarea>
              ) : (
                <p className={`text-gray-700 font-medium italic leading-relaxed ${urduClass}`}>
                  {formData.specialNotes || t("noSpecialNotes")}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerPreferences;
