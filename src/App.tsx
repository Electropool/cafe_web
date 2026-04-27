import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Coffee, Phone, Mail, Moon, Sun, X, Menu as MenuIcon } from 'lucide-react';
import Home from './pages/Home';
import Menu from './pages/Menu';
import { MenuContainer, MenuItem } from './components/ui/fluid-menu';
import { AdminProvider } from './contexts/AdminContext';
import { ConfigProvider } from './contexts/ConfigContext';
import AdminApp from './pages/admin/AdminApp';
import { useConfig } from './contexts/ConfigContext';


function AppContent() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const audioRef = useRef<HTMLAudioElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { homepageData } = useConfig();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Play mildly
      if (isAudioPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio autoplay blocked', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden selection:bg-[#D4A853] selection:text-black">
      {/* Global Audio Player */}
      <audio ref={audioRef} src="/cafe_bg_loop.mp3" loop />
      
      {/* Global Fixed Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 bg-white/40 dark:bg-black/30 backdrop-blur-md border-b border-black/5 dark:border-white/5 pointer-events-none transition-all duration-300">
        <div className="w-full h-full pr-4 md:pr-6 flex justify-end items-center">
          {/* Top Right: Glass Nav Button */}
          <div className="pointer-events-auto mr-0">
            <button
              onClick={() => navigate(location.pathname === '/' ? '/menu' : '/')}
              className="flex items-center gap-2 px-5 py-2 md:px-7 md:py-2.5 rounded-full bg-white/10 dark:bg-white/5 hover:bg-[#D4A853] dark:hover:bg-[#F5D547] text-gray-900 dark:text-white hover:text-black dark:hover:text-black transition-all duration-300 shadow-sm border border-black/20 dark:border-white/20 backdrop-blur-sm group"
            >
              {location.pathname === '/' ? (
                <>
                  <Coffee size={18} className="md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs md:text-sm font-black tracking-widest uppercase">Explore Menu</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  <span className="text-xs md:text-sm font-black tracking-widest uppercase">Go Home</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global Bottom Left Menu (Contact + Controls) */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <MenuContainer direction="up">
          <MenuItem 
            icon={
              <div className="relative w-6 h-6 flex items-center justify-center text-black">
                <MenuIcon size={20} strokeWidth={2.5} className="absolute inset-0 transition-all duration-300 origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0" />
                <X size={20} strokeWidth={2.5} className="absolute inset-0 transition-all duration-300 origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0" />
              </div>
            } 
          />
          {/* Call Us */}
          <MenuItem onClick={() => window.location.href = `tel:${homepageData.footer.contact.phone}`}>
            <div className="flex flex-col items-center justify-center h-full w-full px-2 text-gray-900 dark:text-gray-100">
              <Phone size={18} className="mb-0.5" />
              <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase">Call</span>
            </div>
          </MenuItem>
          {/* Email Us */}
          <MenuItem onClick={() => window.location.href = `mailto:${homepageData.footer.contact.email}`}>
            <div className="flex flex-col items-center justify-center h-full w-full px-2 text-gray-900 dark:text-gray-100">
              <Mail size={18} className="mb-0.5" />
              <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase">Email</span>
            </div>
          </MenuItem>
          {/* Theme Toggle */}
          <MenuItem onClick={toggleTheme}>
            <div className="flex flex-col items-center justify-center h-full w-full px-2 text-gray-900 dark:text-gray-100">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-600 dark:text-yellow-400 mb-0.5" /> : <Moon size={18} className="text-gray-600 dark:text-gray-400 mb-0.5" />}
              <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </div>
          </MenuItem>
          {/* Audio Toggle */}
          <MenuItem onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
            <div className="flex flex-col items-center justify-center h-full w-full px-2 text-gray-900 dark:text-gray-100">
              {isAudioPlaying ? <Volume2 size={18} className="text-[#B48A33] mb-0.5" /> : <VolumeX size={18} className="text-gray-400 mb-0.5" />}
              <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase">{isAudioPlaying ? 'Mute' : 'Play'}</span>
            </div>
          </MenuItem>
        </MenuContainer>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AdminProvider>
    </ConfigProvider>
  );
}

export default App;
