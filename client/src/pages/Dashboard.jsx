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
  // --- إضافة الـ State للسايد بار ---
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

  const fetchTasks = useCallback(async () => {
    if (!token) {
      handleLogout();
      return;
    }
    try {
      // تعديل الرابط ليكون نسبي
      const res = await axios.get("/api/tasks", {
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
      // تعديل الرابط ليكون نسبي
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

  const addTask = async (e) => {
    e.preventDefault();
    const targetUser = userRole === "admin" ? assignedTo : userId;
    if (!newTask.trim() || !targetUser) return;

    try {
      // تعديل الرابط ليكون نسبي
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

  const addComment = async (taskId) => {
    if (!commentText[taskId]?.trim()) return;
    try {
      // تعديل الرابط ليكون نسبي
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

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Done" ? "Todo" : "Done";
      // تعديل الرابط ليكون نسبي
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

  const deleteTask = async (id) => {
    try {
      // تعديل الرابط ليكون نسبي
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
      {/* تمرير الـ Props للسايد بار */}
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
          {/* إضافة زر لفتح القائمة يظهر فقط في الموبايل */}
          <div className="lg:hidden mb-4 flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
            <span className="font-black text-slate-800">نظام إنجاز</span>
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold"
            >
              ☰ القائمة
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
            {filteredTasks.map((task) => (
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;