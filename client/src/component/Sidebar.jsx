import React from "react";

function Sidebar({ username, filter, setFilter, handleLogout }) {
  return (
    <aside className="w-72 bg-slate-900 text-white p-6 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black italic">
          A
        </div>
        <h2 className="text-xl font-black tracking-wider text-emerald-400">
           قائمة المهام
        </h2>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-500 mb-4 px-3 uppercase tracking-widest">
          عرض حسب الحالة
        </p>
        <button
          onClick={() => setFilter("All")}
          className={`w-full text-right p-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${filter === "All" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          📊 الكل
        </button>
        <button
          onClick={() => setFilter("Todo")}
          className={`w-full text-right p-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${filter === "Todo" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          ⏳ قيد التنفيذ
        </button>
        <button
          onClick={() => setFilter("Done")}
          className={`w-full text-right p-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${filter === "Done" ? "bg-emerald-600" : "text-slate-400 hover:bg-slate-800"}`}
        >
          ✅ المكتملة
        </button>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[10px] font-black text-slate-500 mb-4 px-3 uppercase tracking-widest">
            تصنيف المصدر
          </p>
          <button
            onClick={() => setFilter("Personal")}
            className={`w-full text-right p-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${filter === "Personal" ? "bg-blue-600 shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
          >
            👤 مهامي الخاصة
          </button>
          <button
            onClick={() => setFilter("Admin")}
            className={`w-full text-right p-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${filter === "Admin" ? "bg-amber-600 shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
          >
            🏢 تكليفات الإدارة
          </button>
        </div>
      </nav>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-3xl border border-slate-700">
        <p className="text-xs text-slate-500 mb-1">مسجل كـ:</p>
        <p className="font-bold text-sm text-emerald-400">{username}</p>
        <button
          onClick={handleLogout}
          className="mt-4 text-red-400 text-xs font-bold hover:underline"
        >
          خروج
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;