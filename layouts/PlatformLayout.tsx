
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LogOut, Moon, Sun, Bell, Globe, Menu } from 'lucide-react';
import { User } from '../types';
import PlatformSidebar from '../components/PlatformSidebar';

interface PlatformLayoutProps {
  user: User;
  darkMode: boolean;
  toggleTheme: () => void;
  onSignOut: () => void;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ user, darkMode, toggleTheme, onSignOut }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu */}
      <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <PlatformSidebar user={user} isCollapsed={false} toggleCollapse={() => {}} onSignOut={onSignOut} />
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
      
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <PlatformSidebar user={user} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} onSignOut={onSignOut} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Platform Top Bar */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open sidebar"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                  <Globe size={16} />
                  <span>smoothschedule.com</span>
                  <span className="mx-2 text-gray-300">/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Admin Console</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <Bell size={20} />
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PlatformLayout;
