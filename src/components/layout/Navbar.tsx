import React, { useState, useEffect, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isCollapsed }) => {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Dashboard';
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  };

  const changePrimaryColor = (color: string) => {
    // Convert hex to rgb tuple
    const bigint = parseInt(color.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    document.documentElement.style.setProperty('--color-primary', `${r} ${g} ${b}`);
    setColorPickerOpen(false);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="h-20 glass border-b sticky top-0 flex items-center justify-between px-4 sm:px-8 z-20 w-full transition-all duration-300">
      
      {/* Left Area: Toggle + Title */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-2.5 rounded-xl transition-all duration-300 ease-in-out hover:shadow-sm flex items-center justify-center relative overflow-hidden group"
          aria-label="Toggle Sidebar"
        >
          {/* Animated icon morph: Using rotation and opacity to fake morphing */}
          <div className={`transition-all duration-500 absolute scale-100 ${!isCollapsed ? 'rotate-180 opacity-0 scale-0' : 'rotate-0 opacity-100'}`}>
             <MenuIcon />
          </div>
          <div className={`transition-all duration-500 ${isCollapsed ? '-rotate-180 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}>
             <ArrowRightAltIcon />
          </div>
        </button>
        
        <h1 className="text-2xl font-semibold text-text-main hidden sm:block tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Area: Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-text-muted hover:text-primary transition-all duration-300"
          title="Toggle Theme"
        >
          {isDark ? <LightModeOutlinedIcon fontSize="small"/> : <DarkModeOutlinedIcon fontSize="small"/>}
        </button>

        {/* Color Picker Dropdown */}
        <div className="relative" ref={colorRef}>
          <button 
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
            className="p-2.5 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-text-muted hover:text-primary transition-all duration-300 pointer"
            title="Theme Colors"
          >
            <PaletteOutlinedIcon fontSize="small"/>
          </button>
          
          {colorPickerOpen && (
            <div className="absolute top-full right-0 mt-3 w-40 glass-card rounded-2xl shadow-xl py-3 px-4 animate-fade-in z-50">
              <span className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider block">Primary Color</span>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <button className="w-6 h-6 rounded-full bg-[#36c95f] ring-2 ring-transparent focus:ring-gray-300 hover:scale-110 transition-transform shadow-md" onClick={() => changePrimaryColor('#36c95f')} />
                <button className="w-6 h-6 rounded-full bg-[#3b82f6] ring-2 ring-transparent focus:ring-gray-300 hover:scale-110 transition-transform shadow-md" onClick={() => changePrimaryColor('#3b82f6')} />
                <button className="w-6 h-6 rounded-full bg-[#8b5cf6] ring-2 ring-transparent focus:ring-gray-300 hover:scale-110 transition-transform shadow-md" onClick={() => changePrimaryColor('#8b5cf6')} />
                <button className="w-6 h-6 rounded-full bg-[#ef4444] ring-2 ring-transparent focus:ring-gray-300 hover:scale-110 transition-transform shadow-md" onClick={() => changePrimaryColor('#ef4444')} />
                <button className="w-6 h-6 rounded-full bg-[#f59e0b] ring-2 ring-transparent focus:ring-gray-300 hover:scale-110 transition-transform shadow-md" onClick={() => changePrimaryColor('#f59e0b')} />
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 bg-white/50 dark:bg-sidebar/50 hover:bg-white dark:hover:bg-sidebar px-2 sm:px-4 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-green-300 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              NA
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-sm font-semibold text-text-main block leading-tight">Nethaji</span>
              <span className="text-xs font-medium text-text-muted block">Super Admin</span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 glass-card rounded-2xl shadow-xl py-2 animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm text-text-main font-semibold">Hello, Nethaji</p>
                <p className="text-xs text-text-muted truncate">admin@medskymc.com</p>
              </div>
              
              <ul className="py-2">
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
                    <PersonOutlineOutlinedIcon fontSize="small"/> Profile Settings
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 mt-1">
                    <LogoutOutlinedIcon fontSize="small"/> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
