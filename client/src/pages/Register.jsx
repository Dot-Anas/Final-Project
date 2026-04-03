import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // ✅ استيراد مكتبة الإشعارات العصرية

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      if (res.status === 201) {
        // ✅ إشعار نجاح عصري بدل رسالة المتصفح
        toast.success("تم إنشاء الحساب بنجاح! ✅");
        navigate('/'); 
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "حدث خطأ في التسجيل";
      // ✅ إشعار خطأ عصري
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans" dir="rtl">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">إنشاء حساب جديد</h2>
          <p className="text-slate-500 mt-2">انضم إلينا في نظام المهام</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">اسم المستخدم</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            type="text" 
            placeholder="أدخل اسمك"
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">البريد الإلكتروني</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-left"
            type="email" 
            placeholder="example@mail.com"
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">كلمة السر</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-left"
            type="password" 
            placeholder="••••••••"
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-100"
        >
          تسجيل الحساب
        </button>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          لديك حساب بالفعل؟ 
          <span 
            onClick={() => navigate('/')} 
            className="text-emerald-600 font-black cursor-pointer hover:underline mr-1"
          >
            سجل دخولك هنا
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;