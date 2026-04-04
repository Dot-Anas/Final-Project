import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Team() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    if (userRole === "admin") {
      const fetchUsers = async () => {
        try {
          const res = await axios.get("/api/auth/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.error("خطأ في جلب الموظفين", err);
        }
      };
      fetchUsers();
    }
  }, [token, userRole, navigate]);

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-right p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
            فريق العمل 🤝
          </h1>
          <Link
            to="/dashboard"
            className="w-full md:w-auto text-center bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg text-sm md:text-base"
          >
            العودة للوحة التحكم
          </Link>
        </div>

        {userRole !== "admin" ? (
          <div className="bg-red-50 text-red-600 p-6 md:p-8 rounded-3xl border border-red-100 text-center text-lg md:text-xl font-bold mt-10 md:mt-20">
            🚫 عذراً، هذه الصفحة مخصصة لمدراء النظام فقط للاطلاع على فريق العمل.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 md:gap-5 hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-slate-500 italic">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-black text-slate-800 truncate">
                    {user.username}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">
                    {user.role === "admin" ? "مدير" : "موظف"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
