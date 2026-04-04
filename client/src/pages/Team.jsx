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
          const res = await axios.get("http://localhost:5000/api/auth/users", {
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
    <div className="min-h-screen bg-slate-50 font-sans text-right p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            فريق العمل 🤝
          </h1>
          <Link
            to="/dashboard"
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            العودة للوحة التحكم
          </Link>
        </div>

        {userRole !== "admin" ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center text-xl font-bold mt-20">
            🚫 عذراً، هذه الصفحة مخصصة لمدراء النظام فقط للاطلاع على فريق العمل.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-500 italic">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{user.username}</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">
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