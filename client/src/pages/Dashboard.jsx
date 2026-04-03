import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// استدعاء المكونات الفرعية من مجلد component
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      <Sidebar
        username={username}
        filter={filter}
        setFilter={setFilter}
        handleLogout={handleLogout}
      />

      {/* 2. المحتوى الرئيسي */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
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