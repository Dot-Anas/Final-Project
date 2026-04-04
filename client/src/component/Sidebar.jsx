import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ username, filter, setFilter, handleLogout, isOpen, toggleSidebar }) {
  const handleMobileClick = (action) => {
    action();
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={toggleSidebar}
      ></div>

      <aside className={`
        fixed inset-y-0 right-0 z-[70] w-72 bg-slate-900 text-white p-5 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        lg:sticky lg:top-0 lg:translate-x-0 lg:flex lg:flex-col h-screen
      `}>
        
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden absolute left-4 top-5 text-slate-400 hover:text-white transition-colors"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>

        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black italic text-white shadow-lg shadow-emerald-900/20">
            A
          </div>
          <h2 className="text-xl font-black tracking-wider text-emerald-400">
             إنجاز
          </h2>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
            عرض حسب الحالة
          </p>
          
          <button
            onClick={() => handleMobileClick(() => setFilter("All"))}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "All" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "text-slate-400 hover:bg-slate-800"}`}
          >
            📊 الكل
          </button>
          
          <button
            onClick={() => handleMobileClick(() => setFilter("Todo"))}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Todo" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "text-slate-400 hover:bg-slate-800"}`}
          >
            ⏳ قيد التنفيذ
          </button>

          <button
            onClick={() => handleMobileClick(() => setFilter("Done"))}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Done" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "text-slate-400 hover:bg-slate-800"}`}
          >
            ✅ المكتملة
          </button>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
              تصنيف المصدر
            </p>
            <button
              onClick={() => handleMobileClick(() => setFilter("Personal"))}
              className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Personal" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
            >
              👤 مهامي الخاصة
            </button>
            <button
              onClick={() => handleMobileClick(() => setFilter("Admin"))}
              className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Admin" ? "bg-amber-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}
            >
              🏢 تكليفات الإدارة
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
              روابط النظام
            </p>
            <Link
              to="/profile"
              onClick={() => handleMobileClick(() => {})}
              className="w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 text-slate-400 hover:bg-slate-800"
            >
              ⚙️ الملف الشخصي
            </Link>
            <Link
              to="/team"
              onClick={() => handleMobileClick(() => {})}
              className="w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 text-slate-400 hover:bg-slate-800"
            >
              🤝 فريق العمل
            </Link>
          </div>
        </nav>

        <div className="mt-auto p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-500 mb-1">مسجل كـ:</p>
          <p className="font-bold text-sm text-emerald-400 truncate mb-2">{username}</p>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;