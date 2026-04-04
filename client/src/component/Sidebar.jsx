import React from "react";
import { Link } from "react-router-dom";

// ضفنا الـ isOpen والـ toggleSidebar عشان نتحكم بالظهور في الموبايل
function Sidebar({ username, filter, setFilter, handleLogout, isOpen, toggleSidebar }) {
  return (
    <>
      {/* 1. الطبقة الشفافة خلف السايد بار (Backdrop) - تظهر فقط في الموبايل عند الفتح */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* 2. السايد بار نفسه */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white p-5 shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        lg:static lg:translate-x-0 lg:flex lg:flex-col h-screen sticky top-0
      `}>
        
        {/* زر إغلاق صغير للموبايل فقط */}
        <button onClick={toggleSidebar} className="lg:hidden absolute left-4 top-5 text-slate-400">
           ✕
        </button>

        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black italic text-white">
            A
          </div>
          <h2 className="text-xl font-black tracking-wider text-emerald-400">
             قائمة المهام
          </h2>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
            عرض حسب الحالة
          </p>
          <button
            onClick={() => { setFilter("All"); if(window.innerWidth < 1024) toggleSidebar(); }}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "All" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
          >
            📊 الكل
          </button>
          
          {/* ... باقي الأزرار بنفس الطريقة ... */}
          {/* ملاحظة: ضفت كود صغير عند الـ onClick عشان تسكر السايد بار لما تختار تصنيف بالموبايل */}
          
          <button
            onClick={() => { setFilter("Todo"); if(window.innerWidth < 1024) toggleSidebar(); }}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Todo" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
          >
            ⏳ قيد التنفيذ
          </button>
          <button
            onClick={() => { setFilter("Done"); if(window.innerWidth < 1024) toggleSidebar(); }}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Done" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
          >
            ✅ المكتملة
          </button>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-[10px] font-black text-slate-500 mb-3 px-3 uppercase tracking-widest">
              تصنيف المصدر
            </p>
            <button
              onClick={() => { setFilter("Personal"); if(window.innerWidth < 1024) toggleSidebar(); }}
              className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Personal" ? "bg-blue-600 shadow-lg text-white" : "text-slate-400 hover:bg-slate-800"}`}
            >
              👤 مهامي الخاصة
            </button>
            <button
              onClick={() => { setFilter("Admin"); if(window.innerWidth < 1024) toggleSidebar(); }}
              className={`w-full text-right py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${filter === "Admin" ? "bg-amber-600 shadow-lg text-white" : "text-slate-400 hover:bg-slate-800"}`}
            >
              🏢 تكليفات الإدارة
            </button>
          </div>
        </nav>

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
    </>
  );
}

export default Sidebar;