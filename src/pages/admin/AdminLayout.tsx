import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, LogOut, Menu as MenuIcon, X } from 'lucide-react';

const AdminLayout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Ensure dark mode for admin
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navItems = [
    { to: "/admin/menu", icon: List, label: "Menu Management" },
    { to: "/admin/analytics", icon: LayoutDashboard, label: "Analytics" },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/5 z-[70]">
        <h2 className="text-lg font-serif font-bold text-[#D4A853]">Cafe Admin</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300
        md:translate-x-0 md:static
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex p-6 border-b border-white/5 items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#D4A853]">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#D4A853]/10 text-[#D4A853]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => {
              onLogout();
              navigate('/');
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[55] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
