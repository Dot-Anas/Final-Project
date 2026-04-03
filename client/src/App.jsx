import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* أول صفحة تفتح هي الـ Login */}
        <Route path="/" element={<Login />} />
        
        {/* صفحة إنشاء حساب */}
        <Route path="/register" element={<Register />} />
        
        {/* صفحة لوحة المهام */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* إذا كتب أي مسار غلط، يرجعه للـ Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;