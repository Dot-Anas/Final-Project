import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ استيراد حاوية الإشعارات

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Team from './pages/Team';

function App() {
  return (
    <Router>
      {/* ✅ هاي هي القطعة السحرية اللي بتعرض الإشعارات في كل الموقع */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'inherit',
            fontWeight: 'bold'
          }
        }} 
      />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/team" element={<Team />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;