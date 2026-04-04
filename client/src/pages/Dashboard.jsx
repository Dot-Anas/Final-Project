import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import TaskForm from "../component/TaskForm";
import TaskItem from "../component/TaskItem";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [commentText, setCommentText] = useState({});
  const [filter, setFilter] = useState("All");
  
  // التحكم في حالة السايد بار (فتح/إغلاق) في الجوال
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "مستخدم جديد";
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  // جلب المهام - تم تغيير الرابط ليكون نسبياً /api
  const fetchTasks = useCallback(async () => {
    if (!token) {
      handleLogout();
      return;
    }
    try {
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, [token, handleLogout]);

  // جلب المستخدمين للمسؤولين فقط
  const fetchUsers = useCallback(async () => {
    if (!token || userRole !== "admin") return;
    try {
      const res = await axios.get("/api/auth/users", {
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

  // إضافة مهمة جديدة
  const addTask = async (e) => {
    e.preventDefault();
    const targetUser = userRole === "admin" ? assignedTo : userId;
    if (!newTask.trim() || !targetUser) return;

    try {
      await axios.post(
        "/api/tasks",
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

  // إضافة تعليق
  const addComment = async (taskId) => {
    if (!commentText[taskId]?.trim()) return;
    try {
      await axios.post(
        `/api/tasks/${taskId}/comments`,
        { text: commentText[taskId] },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText((prev) => ({ ...prev, [taskId]: "" }));
      fetchTasks();
    } catch (err) {
      console.error("خطأ في التعليق:", err);
    }
  };

  // تحديث حالة المهمة
  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Done" ? "Todo" : "Done";
      await axios.patch(
        `/api/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch (err) {
      console.error("خطأ في التحديث:", err);
    }
  };

  // حذف مهمة
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Todo") return task.status === "Todo";
    if (filter === "Done") return task.status === "Done";
    if (filter === "Personal") return task.createdBy?._id === userId;
    if (filter === "Admin") return task.createdBy?._id !== userId;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-slate-50 flex font-sans text-right"
      dir="rtl"
    >
      {/* تمرير خصائص التحكم للسايد بار */}
      <Sidebar
        username={username}
        filter={filter}
        setFilter={setFilter}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          
          {/* زر الهامبرغر - يظهر فقط في الجوال lg:hidden */}
          <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black italic">A</div>
              <span className="font-black text-slate-800">نظام إنجاز</span>
            </div>
            <button 
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold active:scale-95 transition-all"
            >
              <span>القائمة</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          <Header filter={filter} username={username} />

          <TaskForm
            addTask={addTask}
            newTask={newTask}
            setNewTask={setNewTask}
            deadline={deadline}
            setDeadline={setDeadline}
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
            users={users}
            userRole={userRole}
          />

          <div className="space-y-8">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  userRole={userRole}
                  userId={userId}
                  toggleTaskStatus={toggleTaskStatus}
                  deleteTask={deleteTask}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  addComment={addComment}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">لا يوجد مهام حالياً في هذا القسم</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;