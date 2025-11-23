
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  Users, 
  CreditCard, 
  MessageSquare,
  LogOut,
  ClipboardList,
} from 'lucide-react';
import { Business, User } from '../types';
import SmoothScheduleLogo from './SmoothScheduleLogo';

interface SidebarProps {
  business: Business;
  user: User;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ business, user, isCollapsed, toggleCollapse, onSignOut }) => {
  const location = useLocation();
  const { role } = user;

  const getNavClass = (path: string, exact: boolean = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : location.pathname.startsWith(path);

    const baseClasses = `flex items-center gap-3 py-3 text-sm font-medium rounded-lg transition-colors`;
    const collapsedClasses = isCollapsed ? 'px-3 justify-center' : 'px-4';
    const activeClasses = 'bg-opacity-10 text-white bg-white';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/5';

    return `${baseClasses} ${collapsedClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const canViewAdminPages = role === 'owner' || role === 'manager';
  const canViewManagementPages = role === 'owner' || role === 'manager' || role === 'staff';
  const canViewSettings = role === 'owner';
  
  const getDashboardLink = () => {
    if (role === 'resource') return '/';
    return '/';
  }

  return (
    <div 
      className={`flex flex-col h-full text-white shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: business.primaryColor }}
    >
      <button 
        onClick={toggleCollapse} 
        className={`flex items-center gap-3 w-full text-left px-6 py-8 ${isCollapsed ? 'justify-center' : ''} hover:bg-white/5 transition-colors focus:outline-none`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg text-brand-600 font-bold text-xl shrink-0" style={{ color: business.primaryColor }}>
          {business.name.substring(0, 2).toUpperCase()}
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold leading-tight truncate">{business.name}</h1>
            <p className="text-xs text-white/60 truncate">{business.subdomain}.smoothschedule.com</p>
          </div>
        )}
      </button>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link to={getDashboardLink()} className={getNavClass('/', true)} title="Dashboard">
          <LayoutDashboard size={20} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        
        <Link to="/scheduler" className={getNavClass('/scheduler')} title="Scheduler">
          <CalendarDays size={20} className="shrink-0" />
          {!isCollapsed && <span>Scheduler</span>}
        </Link>
        
        {canViewManagementPages && (
          <>
            <Link to="/customers" className={getNavClass('/customers')} title="Customers">
              <Users size={20} className="shrink-0" />
              {!isCollapsed && <span>Customers</span>}
            </Link>
            <Link to="/resources" className={getNavClass('/resources')} title="Resources">
              <ClipboardList size={20} className="shrink-0" />
              {!isCollapsed && <span>Resources</span>}
            </Link>
          </>
        )}

        {canViewAdminPages && (
          <>
            <Link to="/payments" className={getNavClass('/payments')} title="Payments">
              <CreditCard size={20} className="shrink-0" />
              {!isCollapsed && <span>Payments</span>}
            </Link>
            <Link to="/messages" className={getNavClass('/messages')} title="Messages">
              <MessageSquare size={20} className="shrink-0" />
              {!isCollapsed && <span>Messages</span>}
            </Link>
          </>
        )}

        {canViewSettings && (
          <div className="pt-8 mt-8 border-t border-white/10">
             {canViewSettings && (
              <Link to="/settings" className={getNavClass('/settings', true)} title="Business Settings">
                <Settings size={20} className="shrink-0" />
                {!isCollapsed && <span>Business Settings</span>}
              </Link>
             )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center gap-2 text-xs text-white/60 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <SmoothScheduleLogo className="w-6 h-6 text-white" />
          {!isCollapsed && (
            <div>
              <span className="block">Powered by</span>
              <span className="font-semibold text-white/80">Smooth Schedule</span>
            </div>
          )}
        </div>
        <button onClick={onSignOut} className={`flex items-center gap-3 px-4 py-2 text-sm font-medium text-white/70 hover:text-white w-full transition-colors rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
          <LogOut size={20} className="shrink-0"/>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
