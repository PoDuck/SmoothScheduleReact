
import React from 'react';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { User } from '../types';

interface TopBarProps {
  user: User;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, isDarkMode, toggleTheme, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 shrink-0">
      <div className="flex items-center gap-4">
         <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search bookings, customers, or services..."
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
