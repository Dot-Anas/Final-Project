import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "مستخدم";
  const userRole = localStorage.getItem("role") || "user";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("خطأ في جلب المهام", err);
      }
    };
    fetchTasks();
  }, [token, navigate]);

  const myTasks = tasks.filter(
    (t) => t.assignedTo?._id === userId || t.createdBy?._id === userId
  );
  const completedTasks = myTasks.filter((t) => t.status === "Done").length;
  const pendingTasks = myTasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            الملف الشخصي 👤
          </h1>
          <Link
            to="/dashboard"
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            العودة للوحة التحكم
          </Link>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 mb-8 flex flex-col items-center">
          <div className="h-32 w-32 bg-emerald-500 rounded-full flex items-center justify-center text-6xl font-black text-white italic mb-6 shadow-emerald-200 shadow-2xl">
            {username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-black text-slate-800">{username}</h2>
          <span className={`mt-3 px-4 py-1 rounded-full text-sm font-black ${userRole === "admin" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
            {userRole === "admin" ? "مدير النظام" : "موظف"}
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-700 mb-6">إحصائيات المهام 📊</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-500 font-bold mb-2">إجمالي المهام</p>
            <p className="text-5xl font-black text-slate-800">{myTasks.length}</p>
          </div>
          <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border border-emerald-100 text-center">
            <p className="text-emerald-600 font-bold mb-2">المهام المكتملة</p>
            <p className="text-5xl font-black text-emerald-600">{completedTasks}</p>
          </div>
          <div className="bg-amber-50 p-8 rounded-3xl shadow-sm border border-amber-100 text-center">
            <p className="text-amber-600 font-bold mb-2">قيد التنفيذ</p>
            <p className="text-5xl font-black text-amber-600">{pendingTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;