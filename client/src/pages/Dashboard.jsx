import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [filter, setFilter] = useState("All"); // حالة الفلترة
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || "أنس";
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/');
  }, [navigate]);

  const fetchTasks = useCallback(async () => {
    if (!token) { handleLogout(); return; }
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  }, [token, handleLogout]);

  const fetchUsers = useCallback(async () => {
    if (!token || userRole !== 'admin') return;
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      if (res.data.length > 0) setAssignedTo(res.data[0]._id);
    } catch (err) {
      console.error("خطأ في جلب الموظفين", err);
    }
  }, [token, userRole]);

// 4. تشغيل جلب البيانات عند فتح الصفحة بطريقة تحافظ على الأداء
  useEffect(() => {
    const loadInitialData = () => {
      // نستخدم setTimeout(0) لتأجيل التنفيذ قليلاً وتجنب cascading renders
      setTimeout(() => {
        fetchTasks();
        fetchUsers();
      }, 0);
    };

    loadInitialData();
  }, [fetchTasks, fetchUsers]);
  // منطق الفلترة قبل العرض
  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  const addTask = async (e) => {
    e.preventDefault();
    const targetUser = userRole === 'admin' ? assignedTo : userId;

    if (!newTask.trim() || !targetUser) return;

    try {
      await axios.post('http://localhost:5000/api/tasks', 
        { title: newTask, assignedTo: targetUser, status: "Todo" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTask(""); 
      fetchTasks(); 
    } catch (err) {
      console.error("خطأ في الإضافة:", err);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Done" ? "Todo" : "Done";
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) { console.error("خطأ في التحديث:", err); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) { console.error("خطأ في الحذف:", err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
      {/* التنقل */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-8 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 ${userRole === 'admin' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'} text-white rounded-full flex items-center justify-center font-black shadow-lg`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{userRole === 'admin' ? 'مدير النظام' : 'عضو الفريق'}</p>
              <h2 className="text-sm font-black text-slate-800">{username}</h2>
            </div>
          </div>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all text-xs">
            تسجيل الخروج
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <header className="mb-10 pr-2">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            {userRole === 'admin' ? "لوحة التوزيع" : "مهامي الشخصية"} <span className={userRole === 'admin' ? 'text-emerald-600' : 'text-blue-600'}>✓</span>
          </h1>
          <p className="text-slate-500">رتب العمل وأنجز المهام بكفاءة عالية.</p>
        </header>
        
        {/* فورم الإضافة المطور */}
        <form onSubmit={addTask} className={`bg-white p-6 rounded-3xl shadow-xl mb-10 border-t-8 ${userRole === 'admin' ? 'border-emerald-500 shadow-emerald-100' : 'border-blue-500 shadow-blue-100'}`}>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black text-slate-600 px-1">
              {userRole === 'admin' ? "تكليف بمهمة جديدة" : "أضف مهمة لنفسك"}
            </h3>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none text-lg transition-all"
              placeholder={userRole === 'admin' ? "ما هي المهمة؟" : "مثلاً: تجهيز طلبية بن أرحب..."}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              required
            />
            
            <div className="flex gap-3">
              {userRole === 'admin' ? (
                <select 
                  className="flex-1 p-4 rounded-2xl border border-slate-100 font-bold text-slate-600 bg-slate-50 outline-none"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  {users.map(user => (
                    <option key={user._id} value={user._id}>الموظف: {user.username}</option>
                  ))}
                </select>
              ) : (
                <div className="flex-1 p-4 rounded-2xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center pr-4">
                   ستضاف هذه المهمة إلى قائمتك الخاصة
                </div>
              )}

              <button 
                type="submit"
                className={`px-10 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${userRole === 'admin' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'}`}
              >
                إضافة
              </button>
            </div>
          </div>
        </form>

        {/* شريط الفلترة */}
        <div className="flex gap-2 mb-8 justify-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100 max-w-fit mx-auto">
          {["All", "Todo", "Done"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
                filter === type 
                ? (userRole === 'admin' ? 'bg-emerald-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md')
                : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {type === "All" ? "الكل" : type === "Todo" ? "قيد التنفيذ" : "المكتملة"}
            </button>
          ))}
        </div>

        {/* القائمة */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task._id} className={`bg-white p-6 rounded-3xl shadow-sm border flex justify-between items-center transition-all ${task.status === "Done" ? "opacity-50 grayscale bg-slate-50" : "border-slate-100 hover:shadow-md"}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(task._id, task.status)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${task.status === "Done" ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  > ✓ </button>
                  
                  <div>
                    <h3 className={`text-xl font-bold ${task.status === "Done" ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {task.title}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${task.assignedTo?._id === userId ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {userRole === 'admin' ? `للموظف: ${task.assignedTo?.username}` : (task.createdBy?._id === userId ? "مهمة شخصية" : "مكلفة من الإدارة")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {userRole === 'admin' && (
                  <button onClick={() => deleteTask(task._id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <span className="text-5xl block mb-4">☕</span>
              <p className="text-slate-400 font-bold">لا يوجد مهام في هذا القسم</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;