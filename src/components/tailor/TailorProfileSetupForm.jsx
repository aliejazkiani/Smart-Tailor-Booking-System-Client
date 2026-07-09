import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import BasicInfo from "./BasicInfo";
import ShopDetails from "./ShopDetails";
import PaymentMethods from "./PaymentMethods";
import FileUploads from "./FileUploads";

const TailorProfileSetupForm = ({ onProfileComplete, initialData }) => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    mobileNumber: "",
    shopAddress: "",
    shopCategory: "",
    priceRange: "",
    yearsOfExperience: 0,
    shopDescription: "",
    businessHours: "",
    paymentMethods: [],
  });

  const [shopPhotos, setShopPhotos] = useState([]);
  const [portfolioSamples, setPortfolioSamples] = useState([]);
  const [existingShopPhotos, setExistingShopPhotos] = useState([]);
  const [existingPortfolioSamples, setExistingPortfolioSamples] = useState([]);

  const [warnings, setWarnings] = useState({
    payment: false,
    shopPhotos: false,
    portfolioSamples: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        paymentMethods: Array.isArray(initialData.paymentMethods)
          ? initialData.paymentMethods
          : [],
      }));
      setExistingShopPhotos(initialData.shopPhotoUrls || []);
      setExistingPortfolioSamples(initialData.portfolioUrls || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      paymentMethods: checked
        ? [...prev.paymentMethods, value]
        : prev.paymentMethods.filter((m) => m !== value),
    }));
    if (checked) setWarnings((prev) => ({ ...prev, payment: false }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "shopPhotos") {
      setShopPhotos(files);
      if (files.length > 0)
        setWarnings((prev) => ({ ...prev, shopPhotos: false }));
    } else {
      setPortfolioSamples(files);
      if (files.length > 0)
        setWarnings((prev) => ({ ...prev, portfolioSamples: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWarnings = {
      payment: formData.paymentMethods.length === 0,
      shopPhotos: shopPhotos.length === 0 && existingShopPhotos.length === 0,
      portfolioSamples:
        portfolioSamples.length === 0 && existingPortfolioSamples.length === 0,
    };

    setWarnings(newWarnings);

    // if any warning is true, block submission
    if (Object.values(newWarnings).some(Boolean)) return;

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "paymentMethods") {
          value.forEach((method) => payload.append("paymentMethods", method));
        } else {
          payload.append(key, value);
        }
      });
      shopPhotos.forEach((file) => payload.append("shopPhotos", file));
      portfolioSamples.forEach((file) =>
        payload.append("portfolioSamples", file)
      );

      const response = await API.post("/tailor/profile/complete", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (onProfileComplete) onProfileComplete(response.data.user);
      setExistingShopPhotos(response.data.user?.shopPhotoUrls || existingShopPhotos);
      setExistingPortfolioSamples(response.data.user?.portfolioUrls || existingPortfolioSamples);
      setShopPhotos([]);
      setPortfolioSamples([]);
      alert("Profile saved successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save profile.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-700">
          Tailor Profile Setup
        </h2>
        <p className="text-gray-500 mt-2">
          Complete your profile to attract more customers and showcase your
          work.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 divide-y divide-gray-200"
      >
        <section className="pt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-2">
            Basic Information
          </h3>
          <BasicInfo formData={formData} handleChange={handleChange} />
        </section>

        <section className="pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-2">
            Shop Details
          </h3>
          <ShopDetails formData={formData} handleChange={handleChange} />
        </section>

        <section className="pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-2">
            Payment Methods
          </h3>
          <PaymentMethods
            formData={formData}
            handleCheckboxChange={handleCheckboxChange}
          />
          {warnings.payment && (
            <p className="text-sm text-red-500 mt-2">
              Please select at least one payment method.
            </p>
          )}
        </section>

        <section className="pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-2">
            File Uploads
          </h3>
          <FileUploads
            shopPhotos={shopPhotos}
            portfolioSamples={portfolioSamples}
            existingShopPhotos={existingShopPhotos}
            existingPortfolioSamples={existingPortfolioSamples}
            handleFileChange={handleFileChange}
          />
          {warnings.shopPhotos && (
            <p className="text-sm text-red-500 mt-2">
              Please upload at least one shop photo.
            </p>
          )}
          {warnings.portfolioSamples && (
            <p className="text-sm text-red-500 mt-2">
              Please upload at least one portfolio sample.
            </p>
          )}
        </section>

        <div className="pt-8">
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default TailorProfileSetupForm;  