import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  // Automatically collapse on mobile by default
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 640);

  // Update layout when window is resized to prevent stuck sidebar
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex bg-background h-screen overflow-hidden font-sans relative">
      {/* Mobile Sidebar Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ${!isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCollapsed(true)}
      />
      
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden w-full relative">
        <Navbar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-background relative z-0">
          {/* Outlet is where the nested routes will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
