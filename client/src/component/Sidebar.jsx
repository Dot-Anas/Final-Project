import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ username, filter, setFilter, handleLogout }) {
  return (
    <aside className="w-72 bg-slate-900 text-white p-5 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
      {/* قللنا المسافة السفلية للوجو */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black italic">
          A
        </div>
        <h2 className="text-xl font-black tracking-wider text-emerald-400">
           قائمة المهام
        </h2>
      </div>

      {/* تم تقليل المسافات وإخفاء السكرول بار نهائياً */}
      <nav className="space-y-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
          عرض حسب الحالة
        </p>
        <button
          onClick={() => setFilter("All")}
          className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "All" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          📊 الكل
        </button>
        <button
          onClick={() => setFilter("Todo")}
          className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Todo" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          ⏳ قيد التنفيذ
        </button>
        <button
          onClick={() => setFilter("Done")}
          className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Done" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          ✅ المكتملة
        </button>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
            تصنيف المصدر
          </p>
          <button
            onClick={() => setFilter("Personal")}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Personal" ? "bg-blue-600 shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
          >
            👤 مهامي الخاصة
          </button>
          <button
            onClick={() => setFilter("Admin")}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Admin" ? "bg-amber-600 shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
          >
            🏢 تكليفات الإدارة
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
            صفحات النظام
          </p>
          <Link
            to="/profile"
            className="w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 text-slate-400 hover:bg-slate-800"
          >
            👤 الملف الشخصي
          </Link>
          <Link
            to="/team"
            className="w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 text-slate-400 hover:bg-slate-800"
          >
            🤝 فريق العمل
          </Link>
        </div>
      </nav>

      {/* بوكس البروفايل السفلي صار أرتب وأصغر شوي */}
      <div className="mt-auto p-3 bg-slate-800/50 rounded-2xl border border-slate-700">
        <p className="text-[11px] text-slate-500 mb-1">مسجل كـ:</p>
        <p className="font-bold text-sm text-emerald-400">{username}</p>
        <button
          onClick={handleLogout}
          className="mt-2 text-red-400 text-[11px] font-bold hover:underline"
        >
          خروج
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;