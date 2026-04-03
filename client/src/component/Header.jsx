import React from "react";

function Header({ filter, username }) {
  return (
    <header className="mb-10">
      <h1 className="text-4xl font-black text-slate-800 tracking-tight">
        {filter === "Personal"
          ? "مساحتي الخاصة 👤"
          : filter === "Admin"
          ? "توجيهات الإدارة 🏢"
          : "لوحة التحكم العامة"}
      </h1>
      <p className="text-slate-500 mt-2 font-medium">
        أهلاً يا {username}، إليك تحديثات اليوم.
      </p>
    </header>
  );
}

export default Header;