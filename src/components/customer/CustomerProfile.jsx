import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const CustomerProfile = () => {
  const { t, isUrdu } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get(`/customer/profile`);
      setProfileData(data);
      setFormData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/customer/profile`, formData);
      setProfileData(data);
      setFormData(data);
      alert(t("profileSaved") || "Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(t("profileSaveFailed"));
    }
  };

  if (isLoading || !formData) {
    return (
      <div className={`text-center text-blue-600 ${isUrdu ? "font-urdu" : ""}`}>
        {t("loadingProfile")}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8">
      <h2 className={`text-2xl font-semibold text-gray-800 mb-6 ${isUrdu ? "font-urdu" : ""}`}>
        {t("yourProfile")}
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${isUrdu ? "font-urdu" : ""}`}>
            {t("name")}
          </label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${isUrdu ? "font-urdu" : ""}`}>
            {t("email")}
          </label>
          <input
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${isUrdu ? "font-urdu" : ""}`}>
            {t("phone")}
          </label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-gray-700 ${isUrdu ? "font-urdu" : ""}`}>
            {t("cnic")}
          </label>
          <input
            name="cnic"
            value={formData.cnic || ""}
            onChange={handleChange}
            placeholder="42101-1234567-1"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ${isUrdu ? "font-urdu" : ""}`}
        >
          {t("saveProfile")}
        </button>
      </form>
    </div>
  );
};

export default CustomerProfile;
