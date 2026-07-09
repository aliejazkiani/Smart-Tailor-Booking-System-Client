import React from "react";

const ROLES = ["customer", "tailor", "admin"];

const RoleToggle = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="flex gap-1 mb-6 w-full bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
      {ROLES.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => onSelectRole(role)}
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
            selectedRole === role
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;