import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [commentText, setCommentText] = useState({});
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "أنس";
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      handleLogout();
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, [token, handleLogout]);

  const fetchUsers = useCallback(async () => {
    if (!token || userRole !== "admin") return;
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      if (res.data.length > 0) setAssignedTo(res.data[0]._id);
    } catch (err) {
      console.error("خطأ في جلب الموظفين", err);
    }
  }, [token, userRole]);

  useEffect(() => {
    const loadInitialData = () => {
      setTimeout(() => {
        fetchTasks();
        fetchUsers();
      }, 0);
    };
    loadInitialData();
  }, [fetchTasks, fetchUsers]);

  const addTask = async (e) => {
    e.preventDefault();
    const targetUser = userRole === "admin" ? assignedTo : userId;
    if (!newTask.trim() || !targetUser) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask, assignedTo: targetUser, status: "Todo", deadline },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewTask("");
      setDeadline("");
      fetchTasks();
    } catch (err) {
      console.error("خطأ في الإضافة:", err);
    }
  };

  const addComment = async (taskId) => {
    if (!commentText[taskId]?.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/comments`,
        { text: commentText[taskId] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText((prev) => ({ ...prev, [taskId]: "" }));
      fetchTasks();
    } catch (err) {
      console.error("خطأ في التعليق:", err);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Done" ? "Todo" : "Done";
      await axios.patch(
        `http://localhost:5000/api/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch (err) {
      console.error("خطأ في التحديث:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  // 🔥 منطق الفلترة المطور للتقسيم
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Todo") return task.status === "Todo";
    if (filter === "Done") return task.status === "Done";
    // فلاتر النوع
    if (filter === "Personal") return task.createdBy?._id === userId;
    if (filter === "Admin") return task.createdBy?._id !== userId;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-slate-50 flex font-sans text-right"
      dir="rtl"
    >
      {/* 1. السايد بار المطور 🛠️ */}
      <aside className="w-72 bg-slate-900 text-white p-6 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl font-black italic">
            A
          </div>
          <h2 className="text-xl font-black tracking-wider text-emerald-400">
            بن أرحب
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

      {/* 2. المحتوى الرئيسي */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
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

          <form
            onSubmit={addTask}
            className={`bg-white p-8 rounded-[40px] shadow-2xl mb-12 border-t-[12px] ${userRole === "admin" ? "border-emerald-500" : "border-blue-500"}`}
          >
            <div className="flex flex-col gap-5">
              <input
                type="text"
                className="w-full p-5 rounded-2xl border-none bg-slate-100 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none text-xl font-bold transition-all"
                placeholder={
                  userRole === "admin"
                    ? "ما هو التكليف الجديد؟"
                    : "أضف مهمة لنفسك..."
                }
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">
                    موعد التسليم
                  </label>
                  <input
                    type="date"
                    className="p-4 rounded-2xl border-none bg-slate-100 font-bold outline-none"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                {userRole === "admin" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">
                      الموظف المسؤول
                    </label>
                    <select
                      className="p-4 rounded-2xl border-none bg-slate-100 font-bold outline-none cursor-pointer"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-blue-50 rounded-2xl text-blue-600 text-[10px] font-black border border-blue-100">
                    💡 المهام المضافة هنا تظهر لك وحدك
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl transition-all active:scale-95 ${userRole === "admin" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
              >
                تأكيد الإضافة
              </button>
            </div>
          </form>

          <div className="space-y-8">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-xl"
              >
                <div className="p-8 flex justify-between items-start gap-4">
                  <div className="flex gap-5">
                    <button
                      onClick={() => toggleTaskStatus(task._id, task.status)}
                      className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === "Done" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" : "border-slate-200 text-transparent hover:border-emerald-500"}`}
                    >
                      ✓
                    </button>
                    <div>
                      <div className="flex gap-2 mb-2">
                        {task.createdBy?._id === task.assignedTo?._id ? (
                          <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-black">
                            📍 مهمة شخصية
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-600 text-[9px] px-2 py-0.5 rounded-full font-black">
                            🏢 تكليف إداري
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-2xl break-all font-black break-words overflow-hidden max-w-full ${task.status === "Done" ? "line-through text-slate-300" : "text-slate-700"}`}
                      >
                        {task.title}
                      </h3>{" "}
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase">
                          👤 {task.assignedTo?.username}
                        </span>
                        {task.deadline && (
                          <span
                            className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${new Date(task.deadline) < new Date() && task.status !== "Done" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
                          >
                            📅{" "}
                            {new Date(task.deadline).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 🔥 تم تعديل شرط الحذف: للمدير أو صاحب المهمة الشخصية فقط */}
                  {(userRole === "admin" || task.createdBy?._id === userId) && (
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-slate-200 hover:text-red-500 p-2 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 mb-4 px-2 uppercase tracking-widest">
                    النقاش المباشر 💬
                  </p>
                  <div className="space-y-3 mb-5 max-h-52 overflow-y-auto px-2">
                    {task.comments?.length > 0 ? (
                      task.comments.map((c, i) => (
                        <div
                          key={i}
                          className={`flex flex-col p-3 rounded-2xl max-w-[80%] shadow-sm border ${c.user?._id === userId ? "bg-emerald-50 border-emerald-100 mr-auto" : "bg-white border-slate-100 ml-auto text-right"}`}
                        >
                          <span className="text-[9px] font-black text-slate-400 mb-1">
                            {c.user?.username}
                          </span>
                          <p className="text-sm font-bold text-slate-700">
                            {c.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[10px] text-slate-300 py-4 italic">
                        لا يوجد نقاشات بعد..
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="اكتب شيئاً..."
                      className="flex-1 p-4 rounded-2xl border-none bg-white shadow-inner outline-none text-sm font-medium"
                      value={commentText[task._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [task._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => addComment(task._id)}
                      className="bg-slate-900 text-white px-6 rounded-2xl text-xs font-black hover:bg-black transition-all"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
