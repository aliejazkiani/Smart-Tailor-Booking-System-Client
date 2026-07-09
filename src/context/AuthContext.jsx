// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const AuthContext = createContext();

// Attempting "admin" gets its own clearer message since it's a restricted
// role, not just a mismatched selection like customer vs tailor.
const roleMismatchMessage = (actualRole, attemptedRole) => {
  if (attemptedRole === "admin") {
    return "You cannot log in as admin with this email. Please use a valid admin account.";
  }
  return `You are registered as a ${actualRole}, not a ${attemptedRole}. Select the correct role.`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Load user on app start ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          isProfileCompleted: parsedUser.isProfileCompleted ?? false,
        });
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid stored user data:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // --- Helper: Save auth data ---
  const setAuthData = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // --- Login ---
  const login = async (email, password, role) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, ...userData } = res.data;

      if (userData.role !== role) {
        throw new Error(roleMismatchMessage(userData.role, role));
      }

      const finalUser = {
        ...userData,
        isProfileCompleted: userData.isProfileCompleted ?? false,
      };

      setAuthData(token, finalUser);
      return finalUser;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      console.error("Login failed:", msg);
      throw msg;
    }
  };

  // --- Signup ---
  const signup = async (fullName, email, password, role) => {
    try {
      const res = await API.post("/auth/signup", {
        fullName,
        email,
        password,
        role,
      });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      console.error("Signup failed:", msg);
      throw msg;
    }
  };

  // --- Google Login/Signup ---
  const googleAuth = async (idToken, role) => {
    try {
      const res = await API.post("/auth/google", { idToken, role });
      const { token, user: userData } = res.data;

      if (userData.role !== role) {
        throw new Error(roleMismatchMessage(userData.role, role));
      }

      setAuthData(token, userData);
      return userData;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Google login failed";
      console.error("Google auth failed:", msg);
      throw msg;
    }
  };

  // --- Update Profile Status ---
  const updateUserProfileStatus = (updatedUser) => {
    if (!updatedUser) return;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // --- Logout ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  // --- Context Value ---
  const value = {
    user,
    loading,
    login,
    signup,
    googleAuth,
    logout,
    updateUserProfileStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
