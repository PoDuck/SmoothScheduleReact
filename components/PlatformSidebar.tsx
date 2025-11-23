
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, MessageSquare, Settings, LogOut, Users, Shield } from 'lucide-react';
import { User } from '../types';
import SmoothScheduleLogo from './SmoothScheduleLogo';

interface PlatformSidebarProps {
  user: User;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onSignOut: () => void;
}

const PlatformSidebar: React.FC<PlatformSidebarProps> = ({ user, isCollapsed, toggleCollapse, onSignOut }) => {
  const location = useLocation();

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    const baseClasses = `flex items-center gap-3 py-2 text-sm font-medium rounded-md transition-colors`;
    const collapsedClasses = isCollapsed ? 'px-3 justify-center' : 'px-3';
    const activeClasses = 'bg-gray-700 text-white';
    const inactiveClasses = 'text-gray-400 hover:text-white hover:bg-gray-800';
    return `${baseClasses} ${collapsedClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };
  
  const isSuperuser = user.role === 'superuser';
  const isManager = user.role === 'platform_manager';

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-white shrink-0 border-r border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <button
        onClick={toggleCollapse}
        className={`flex items-center gap-3 w-full text-left px-6 py-6 border-b border-gray-800 ${isCollapsed ? 'justify-center' : ''} hover:bg-gray-800 transition-colors focus:outline-none`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <SmoothScheduleLogo className="w-10 h-10 shrink-0" />
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm tracking-wide uppercase text-gray-100 truncate">Smooth Schedule</h1>
            <p className="text-xs text-gray-500 capitalize truncate">{user.role.replace('_', ' ')}</p>
          </div>
        )}
      </button>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isCollapsed ? 'text-center' : 'px-3'}`}>{isCollapsed ? 'Ops' : 'Operations'}</p>
        {(isSuperuser || isManager) && (
            <Link to="/platform/dashboard" className={getNavClass('/platform/dashboard')} title="Dashboard">
                <LayoutDashboard size={18} className="shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
            </Link>
        )}
        <Link to="/platform/businesses" className={getNavClass("/platform/businesses")} title="Businesses">
          <Building2 size={18} className="shrink-0" />
          {!isCollapsed && <span>Businesses</span>}
        </Link>
        <Link to="/platform/users" className={getNavClass('/platform/users')} title="User Directory">
          <Users size={18} className="shrink-0" />
          {!isCollapsed && <span>User Directory</span>}
        </Link>
        <Link to="/platform/support" className={getNavClass('/platform/support')} title="Support Tickets">
          <MessageSquare size={18} className="shrink-0" />
          {!isCollapsed && <span>Support Tickets</span>}
        </Link>
        
        {isSuperuser && (
          <>
            <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-8 ${isCollapsed ? 'text-center' : 'px-3'}`}>{isCollapsed ? 'Sys' : 'System'}</p>
            <Link to="/platform/staff" className={getNavClass('/platform/staff')} title="Platform Staff">
              <Shield size={18} className="shrink-0" />
              {!isCollapsed && <span>Platform Staff</span>}
            </Link>
            <Link to="/platform/settings" className={getNavClass('/platform/settings')} title="Platform Settings">
              <Settings size={18} className="shrink-0" />
              {!isCollapsed && <span>Platform Settings</span>}
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 px-3 py-2 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
        <button 
          onClick={onSignOut}
          className={`flex items-center gap-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md w-full transition-colors ${isCollapsed ? 'px-3 justify-center' : 'px-3'}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default PlatformSidebar;
