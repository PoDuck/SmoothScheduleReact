import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Business, User } from '../types';

interface BusinessLayoutProps {
  business: Business;
  user: User;
  darkMode: boolean;
  toggleTheme: () => void;
  onSignOut: () => void;
  updateBusiness: (updates: Partial<Business>) => void;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ business, user, darkMode, toggleTheme, onSignOut, updateBusiness }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    mainContentRef.current?.focus();
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className={`fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <Sidebar business={business} user={user} isCollapsed={false} toggleCollapse={() => {}} />
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
      
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar business={business} user={user} isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar 
          user={user} 
          isDarkMode={darkMode} 
          toggleTheme={toggleTheme} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main ref={mainContentRef} tabIndex={-1} className="flex-1 overflow-auto focus:outline-none">
          {/* Pass all necessary context down to child routes */}
          <Outlet context={{ user, business, updateBusiness }} />
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;