import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const CustomerAddresses = () => {
  const { t, isUrdu } = useLanguage();
  const initialForm = {
    name: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    isDefault: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get(`/customer/addresses`);
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = `/customer/addresses${formData._id ? `/${formData._id}` : ""}`;
    const method = formData._id ? "put" : "post";

    try {
      await API[method](url, formData);
      await fetchAddresses();
      setFormData(initialForm);
      setIsFormOpen(false);
      alert(formData._id ? t("addressUpdated") || "Address updated successfully!" : t("addressAdded") || "Address added successfully!");
    } catch (err) {
      console.error("Error saving address:", err);
      alert(t("saveAddressFailed"));
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteAddress"))) return;
    try {
      await API.delete(`/customer/addresses/${id}`);
      setAddresses(addresses.filter((a) => a._id !== id));
      alert(t("deleteSuccess"));
    } catch (err) {
      console.error(err);
      alert(t("deleteFailed"));
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await API.put(`/customer/addresses/${id}`, { isDefault: true });
      await fetchAddresses();
    } catch (err) {
      console.error(err);
      alert(t("setDefaultFailed"));
    }
  };

  if (isLoading) {
    return (
      <div className={`text-center text-blue-600 ${isUrdu ? "font-urdu" : ""}`}>
        {t("loadingAddresses")}
      </div>
    );
  }

  const urduClass = isUrdu ? "font-urdu" : "";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {isFormOpen && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4"
        >
          <h2 className={`text-xl font-semibold text-gray-800 ${urduClass}`}>
            {formData._id ? t("editAddress") : t("addNewAddress")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder={t("name")}
              value={formData.name || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="street"
              placeholder={t("street")}
              value={formData.street || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="city"
              placeholder={t("city")}
              value={formData.city || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="zip"
              placeholder={t("zip")}
              value={formData.zip || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="country"
              placeholder={t("country")}
              value={formData.country || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            className={`px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ${urduClass}`}
          >
            {formData._id ? t("updateAddress") : t("addAddress")}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 && (
          <p className={`text-gray-500 ${urduClass}`}>{t("noAddresses")}</p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800 flex items-center justify-between">
                {addr.name}
                {addr.isDefault && (
                  <span
                    className={`ml-2 text-green-600 font-semibold text-sm bg-green-100 px-2 py-0.5 rounded-full ${urduClass}`}
                  >
                    {t("default")}
                  </span>
                )}
              </p>
              <p className="text-gray-600 mt-1">
                {addr.street}, {addr.city}, {addr.zip}, {addr.country}
              </p>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                className={`text-blue-600 hover:text-blue-800 font-medium ${urduClass}`}
                onClick={() => handleEdit(addr)}
              >
                {t("edit")}
              </button>
              <button
                className={`text-red-600 hover:text-red-800 font-medium ${urduClass}`}
                onClick={() => handleDelete(addr._id)}
              >
                {t("delete")}
              </button>
              {!addr.isDefault && (
                <button
                  className={`text-green-600 hover:text-green-800 font-medium ${urduClass}`}
                  onClick={() => handleSetDefault(addr._id)}
                >
                  {t("setDefault")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerAddresses;
