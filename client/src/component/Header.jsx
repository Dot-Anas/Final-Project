import React from "react";

function Header({ filter, username }) {
  return (
    <header className="mb-6 md:mb-10 px-1">
      <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
        {filter === "Personal"
          ? "مساحتي الخاصة 👤"
          : filter === "Admin"
          ? "توجيهات الإدارة 🏢"
          : "لوحة التحكم العامة"}
      </h1>
      <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">
        أهلاً يا <span className="text-emerald-600 font-bold">{username}</span>، إليك تحديثات اليوم.
      </p>
    </header>
  );
}

export default Header;