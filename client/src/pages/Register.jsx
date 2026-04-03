import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. استدعاء الموجه

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate(); // 2. تعريف دالة التنقل

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      if (res.status === 201) {
        alert("تم إنشاء الحساب بنجاح! ✅");
        // 3. التوجيه التلقائي لصفحة تسجيل الدخول
        navigate('/'); 
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "حدث خطأ في التسجيل";
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" dir="rtl">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <h2 className="text-3xl font-black mb-8 text-center text-slate-800">إنشاء حساب جديد</h2>
        
        {/* الحقول (Username, Email, Password) - زي ما هي عندك */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">اسم المستخدم</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            type="text" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            type="email" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold mb-2">كلمة السر</label>
          <input 
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            type="password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>

        <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all">
          تسجيل الحساب
        </button>

        {/* 4. إضافة زر "الرجوع" إذا غير رأيه قبل ما يسجل */}
        <p className="mt-6 text-center text-sm text-slate-500">
          لديك حساب بالفعل؟ 
          <span 
            onClick={() => navigate('/')} 
            className="text-emerald-600 font-bold cursor-pointer hover:underline mr-1"
          >
            سجل دخولك هنا
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;