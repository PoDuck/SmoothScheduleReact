
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { User, Business } from '../types';
import { LayoutDashboard, CalendarPlus, LogOut, CreditCard } from 'lucide-react';

interface CustomerLayoutProps {
  business: Business;
  user: User;
  onSignOut: () => void;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ business, user, onSignOut }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <header 
        className="text-white shadow-md"
        style={{ backgroundColor: business.primaryColor }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Business Name */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg font-bold text-lg" style={{ color: business.primaryColor }}>
                {business.name.charAt(0)}
              </div>
              <span className="font-bold text-lg">{business.name}</span>
            </div>

            {/* Navigation and User Menu */}
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-1">
                <Link to="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10">
                    <LayoutDashboard size={16}/> Dashboard
                </Link>
                <Link to="/book" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10">
                    <CalendarPlus size={16}/> Book Appointment
                </Link>
                <Link to="/payments" className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10">
                    <CreditCard size={16}/> Billing
                </Link>
              </nav>

              <div className="flex items-center gap-3 pl-6 border-l border-white/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/70">Customer Portal</p>
                </div>
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white/30 object-cover"
                />
                 <button onClick={onSignOut} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet context={{ business, user }} />
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;