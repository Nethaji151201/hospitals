import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MENUS, type MenuItem } from '../../constants/menus';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.submenus) {
      return item.submenus.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <aside 
      className={`bg-sidebar border-r border-gray-200/50 dark:border-gray-800/80 flex flex-col transition-all duration-400 ease-in-out h-full shadow-2xl sm:shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-50
      fixed sm:relative top-0 left-0
      ${isCollapsed ? '-translate-x-full sm:translate-x-0 sm:w-20' : 'translate-x-0 w-72'} 
      overflow-x-hidden`}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100 dark:border-gray-800/80 text-primary transition-all duration-300 px-6 overflow-hidden shrinking-0">
        <div className="flex items-center gap-3 w-full justify-center">
          <BlurOnOutlinedIcon fontSize="large" className={`transition-transform duration-500 ${!isCollapsed ? 'rotate-90' : 'rotate-0'}`} />
          {!isCollapsed && <span className="font-bold text-2xl text-text-main whitespace-nowrap hidden sm:block tracking-wide">Medsky <span className="text-primary">AMC</span></span>}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin">
        <div className="mb-4 px-3 text-xs font-semibold text-text-muted uppercase tracking-widest hidden sm:block">
          {!isCollapsed ? 'Main Menu' : '—'}
        </div>
        <ul className="space-y-1">
          {MENUS.map((menu, index) => {
            const active = isActive(menu);
            const Icon = menu.icon;

            return (
              <li key={index} className="relative group">
                {menu.submenus ? (
                  /* Parent Menu with Submenus */
                  <div>
                    <button
                      onClick={() => !isCollapsed && toggleSubmenu(menu.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer outline-none relative overflow-hidden group
                        ${active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-main'}
                      `}
                    >
                      {/* Hover Indicator Line */}
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100'}`}></span>

                      <div className={`flex items-center gap-4 transition-transform duration-300 ${!active && 'group-hover:translate-x-1'}`}>
                        <Icon className={`${active ? 'text-primary' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`} fontSize="small" />
                        {!isCollapsed && <span className="whitespace-nowrap">{menu.title}</span>}
                      </div>
                      {!isCollapsed && (
                        <div className={`transition-transform duration-300 ${openSubmenus[menu.title] ? 'rotate-90' : 'rotate-0'}`}>
                          <KeyboardArrowRightIcon fontSize="small" className="opacity-50" />
                        </div>
                      )}
                    </button>

                    {/* Submenu rendering for expanded state */}
                    <div className={`grid transition-all duration-300 ease-in-out ${(!isCollapsed && openSubmenus[menu.title]) ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                      <ul className="overflow-hidden">
                        <div className="ml-6 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1 py-1">
                          {menu.submenus.map((sub, sIndex) => (
                            <li key={sIndex}>
                              <NavLink
                                to={sub.path}
                                className={({ isActive }) =>
                                  `block px-4 py-2 text-sm rounded-lg transition-all duration-300 relative ${isActive ? 'text-primary font-medium bg-primary/5' : 'text-text-muted hover:text-text-main hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1'}`
                                }
                              >
                                {sub.title}
                              </NavLink>
                            </li>
                          ))}
                        </div>
                      </ul>
                    </div>

                    {/* Tooltip/Flyout for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full top-0 ml-4 hidden group-hover:block glass-card rounded-xl py-2 w-56 z-[60] shadow-xl border border-gray-100 dark:border-gray-800/50">
                        <div className="px-5 py-3 font-semibold text-text-main text-sm uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50 mb-1">{menu.title}</div>
                        <div className="px-2">
                          {menu.submenus.map((sub, sIndex) => (
                            <NavLink
                              key={sIndex}
                              to={sub.path}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-all duration-200 rounded-lg ${isActive ? 'text-primary font-medium bg-primary/10' : 'text-text-muted hover:text-text-main hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:pl-5'}`
                              }
                            >
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single Menu Item */
                  <NavLink
                    to={menu.path || '#'}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden
                      ${active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text-main'}
                    `}
                  >
                    {/* Hover Indicator Line */}
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100'}`}></span>

                    <div className={`flex items-center gap-4 transition-transform duration-300 ${!active && 'group-hover:translate-x-1'}`}>
                      <Icon className={`${active ? 'text-primary' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`} fontSize="small" />
                      {!isCollapsed && <span className="whitespace-nowrap">{menu.title}</span>}
                    </div>
                  </NavLink>
                )}

                {/* Tooltip for collapsed single item */}
                {isCollapsed && !menu.submenus && (
                  <div className="absolute left-full top-2/4 -translate-y-2/4 ml-4 hidden group-hover:block glass-card text-text-main text-sm font-medium px-4 py-2 rounded-lg w-max z-[60] shadow-xl border border-gray-100 dark:border-gray-800/50">
                    {menu.title}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer/Settings Area of Sidebar if needed */}
      {!isCollapsed && (
        <div className="p-4 m-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-primary">Need Help?</span>
          <span className="text-[10px] text-text-muted mt-1">Check our documentation</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
