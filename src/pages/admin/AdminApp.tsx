import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminMenu from './AdminMenu';
import AdminAnalytics from './AdminAnalytics';
import AdminEditItem from './AdminEditItem';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'xyz' && password === '1234567890') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white font-sans">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-sm">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-[#D4A853]">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A853]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A853]"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-[#D4A853] hover:bg-[#F5D547] text-black font-bold py-2 rounded-lg transition-colors mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="menu" replace />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="menu/add" element={<AdminEditItem />} />
        <Route path="menu/edit/:category/:id" element={<AdminEditItem />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
