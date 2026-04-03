import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (res.data.token) {
        // 🔥 تخزين البيانات كاملة في الـ LocalStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('role', res.data.user.role); // ✅ هاد اللي بيفتح صلاحيات المدير
        localStorage.setItem('userId', res.data.user.id); // ✅ هاد اللي بيحدد هويتك للمهمات الشخصية

        console.log("User Role set to:", res.data.user.role);

        alert(`أهلاً بك يا ${res.data.user.username}! جاري التحويل...`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "خطأ في البريد أو كلمة السر";
      alert("فشل تسجيل الدخول: " + errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans" dir="rtl">
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-200"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            تسجيل الدخول <span className="text-emerald-600">☕</span>
          </h2>
          <p className="text-slate-500 mt-2">مرحباً بك في نظام "بن أرحب"</p>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">البريد الإلكتروني</label>
          <input 
            type="email" 
            placeholder="example@mail.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-left"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">كلمة السر</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-left"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-100"
        >
          دخول للنظام
        </button>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          ليس لديك حساب؟ 
          <span 
            onClick={() => navigate('/register')}
            className="text-emerald-600 font-black cursor-pointer hover:underline mr-1"
          >
             سجل الآن
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;