// src/services/shopService.js
import axios from "axios";

const API_URL = "/api/shops"; // Adjust if your backend is on a different port/domain

// Assuming you have a way to get the user's token (e.g., from localStorage)
const getToken = () => localStorage.getItem("token");

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const findNearbyTailors = async (
  latitude,
  longitude,
  maxDistance = 10000,
  category = "All",
  sortBy = ""
) => {
  try {
    const response = await axios.get(`${API_URL}/nearby`, {
      params: { latitude, longitude, maxDistance, category, sortBy },
      ...getConfig(),
    });
    return response.data;
  } catch (error) {
    console.error("Error in findNearbyTailors service:", error);
    throw error.response?.data?.message || "Failed to fetch nearby tailors";
  }
};

const shopService = {
  findNearbyTailors,
};

export default shopService;
