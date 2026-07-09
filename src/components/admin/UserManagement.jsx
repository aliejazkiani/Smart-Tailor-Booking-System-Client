import React, { useState, useEffect, useMemo } from "react";
import API from "../../utils/api";
import { FaEye, FaTimes, FaMapMarkerAlt, FaRulerCombined, FaUser, FaSearch, FaUsers, FaStore } from "react-icons/fa";

const HIDDEN_KEYS = ["_id", "customerId", "createdAt", "updatedAt", "__v"];

const cleanEntries = (obj) =>
  Object.entries(obj || {}).filter(([key]) => !HIDDEN_KEYS.includes(key));

// Lets a plain word like "customer" or "tailor" typed into the search box
// double as a quick role filter, on top of the explicit filter buttons.
const ROLE_KEYWORDS = {
  customer: "customer",
  customers: "customer",
  tailor: "tailor",
  tailors: "tailor",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const counts = useMemo(() => ({
    all: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    tailor: users.filter((u) => u.role === "tailor").length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const keywordRole = ROLE_KEYWORDS[term];

    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!term) return true;
      if (keywordRole) return u.role === keywordRole;
      return (
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.cnic?.toLowerCase().includes(term)
      );
    });
  }, [users, roleFilter, searchTerm]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    try {
      await API.patch(`/admin/users/${id}`, { status: newStatus });
      fetchUsers();
      alert(`User ${newStatus} successfully`);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers();
      alert("Role updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Role update failed");
    }
  };

  const handleViewProfile = async (user) => {
    setViewingUser(user);
    setProfileInfo(null);
    setProfileLoading(true);
    try {
      const { data } = await API.get(`/admin/customers/${user._id}/profile-info`);
      setProfileInfo(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load customer info");
      setViewingUser(null);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-500">Loading users...</div>;
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">System Users Management</h3>
          <p className="text-sm text-slate-400 mt-1">Manage roles and block or unblock user accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter("all")}
              className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all ${
                roleFilter === "all" ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <FaUsers size={12} /> All ({counts.all})
            </button>
            <button
              onClick={() => setRoleFilter("customer")}
              className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all ${
                roleFilter === "customer" ? "bg-purple-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <FaUser size={12} /> Customers ({counts.customer})
            </button>
            <button
              onClick={() => setRoleFilter("tailor")}
              className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all ${
                roleFilter === "tailor" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <FaStore size={12} /> Tailors ({counts.tailor})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, CNIC or type customer/tailor..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-center py-16 text-slate-400 font-medium">No users found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">User Details</th>
                <th className="px-8 py-4">CNIC</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                    {user.cnic || "—"}
                  </td>
                  <td className="px-8 py-5">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="text-sm font-medium uppercase bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="tailor">Tailor</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      user.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {user.role === "customer" && (
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <FaEye size={11} /> View Profile
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(user._id, user.status || "active")}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                          user.status === "active"
                            ? "border-red-200 text-red-500 hover:bg-red-50"
                            : "border-green-200 text-green-500 hover:bg-green-50"
                        }`}
                      >
                        {user.status === "active" ? "Block User" : "Unblock User"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewingUser && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div
            className="bg-white rounded-[2rem] shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-black text-slate-800 text-lg">{viewingUser.fullName}</p>
                <p className="text-xs text-slate-500">{viewingUser.email}</p>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <FaTimes size={18} />
              </button>
            </div>

            {profileLoading ? (
              <p className="text-center py-16 text-slate-400 font-medium">Loading...</p>
            ) : profileInfo && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUser className="text-indigo-500" />
                    <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Personal Information</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {cleanEntries(profileInfo.profile).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 rounded-xl border border-slate-100 px-3 py-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{key}</p>
                        <p className="font-semibold text-slate-800">{String(value) || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Delivery Addresses</h4>
                  </div>
                  {profileInfo.addresses?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profileInfo.addresses.map((addr) => (
                        <div key={addr._id} className="bg-slate-50 rounded-xl border border-slate-100 px-3 py-2 text-sm">
                          <p className="font-semibold text-slate-800 flex items-center justify-between">
                            {addr.name}
                            {addr.isDefault && (
                              <span className="text-[10px] text-green-600 font-black bg-green-100 px-2 py-0.5 rounded-full">DEFAULT</span>
                            )}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">{addr.street}, {addr.city}, {addr.zip}, {addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No saved addresses.</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaRulerCombined className="text-emerald-500" />
                    <h4 className="font-black text-slate-700 text-sm uppercase tracking-widest">Tailoring Preferences</h4>
                  </div>
                  {profileInfo.preferences ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {cleanEntries(profileInfo.preferences).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 rounded-xl border border-slate-100 px-3 py-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{key}</p>
                          <p className="font-semibold text-slate-800">{String(value) || "—"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No preferences set.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
