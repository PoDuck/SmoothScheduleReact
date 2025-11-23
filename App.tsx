
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import BusinessLayout from './layouts/BusinessLayout';
import PlatformLayout from './layouts/PlatformLayout';
import CustomerLayout from './layouts/CustomerLayout';

import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import Customers from './pages/Customers';
import SettingsPage from './pages/Settings';
import Payments from './pages/Payments';
import Resources from './pages/Resources';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ResourceDashboard from './pages/resource/ResourceDashboard';
import BookingPage from './pages/customer/BookingPage';

import PlatformDashboard from './pages/platform/PlatformDashboard';
import PlatformBusinesses from './pages/platform/PlatformBusinesses';
import PlatformSupport from './pages/platform/PlatformSupport';
import PlatformUsers from './pages/platform/PlatformUsers';

import MasqueradeBanner from './components/MasqueradeBanner';

import { 
    ALL_BUSINESSES,
    SUPERUSER_USER, 
    PLATFORM_MANAGER_USER, 
    PLATFORM_SUPPORT_USER, 
} from './mockData';
import { Business, User, UserRole } from './types';
import { Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  
  const [simulatedSubdomain, setSimulatedSubdomain] = useState<string | null>(null);

  const [businesses, setBusinesses] = useState<Business[]>(ALL_BUSINESSES);
  const [business, setBusiness] = useState<Business | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [masqueradeStack, setMasqueradeStack] = useState<User[]>([SUPERUSER_USER]);
  const [devBoxPosition, setDevBoxPosition] = useState({ top: window.innerHeight - 200, left: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const originalUser = masqueradeStack[0];
  const effectiveUser = masqueradeStack[masqueradeStack.length - 1];
  const isMasquerading = masqueradeStack.length > 1;
  const previousUser = isMasquerading ? masqueradeStack[masqueradeStack.length - 2] : null;

  useEffect(() => {
      if (simulatedSubdomain) {
          const foundBiz = businesses.find(b => b.subdomain === simulatedSubdomain);
          setBusiness(foundBiz || null);
      } else {
          setBusiness(null);
      }
  }, [simulatedSubdomain, businesses]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - devBoxPosition.left, y: e.clientY - devBoxPosition.top };
  };
  
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => { if (isDragging) setDevBoxPosition({ left: e.clientX - dragOffset.current.x, top: e.clientY - dragOffset.current.y }); };
      const handleMouseUp = () => setIsDragging(false);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isDragging]);

  const ROLE_RANK: Record<UserRole, number> = { 'superuser': 100, 'platform_manager': 90, 'platform_support': 80, 'owner': 50, 'manager': 40, 'staff': 30, 'resource': 20, 'customer': 10 };

  const handleMasquerade = (targetUser: User) => {
    if (targetUser.businessId) {
        const targetBiz = businesses.find(b => b.id === targetUser.businessId);
        if (targetBiz && targetBiz.subdomain !== simulatedSubdomain) {
            setSimulatedSubdomain(targetBiz.subdomain);
        }
    } else {
        setSimulatedSubdomain(null);
    }

    if (ROLE_RANK[effectiveUser.role] > ROLE_RANK[targetUser.role] || effectiveUser.role === 'superuser' || effectiveUser.role === 'platform_manager') {
      setMasqueradeStack(prev => [...prev, targetUser]);
      navigate('/');
    } else {
      alert(`Permission Denied: ${effectiveUser.role} cannot masquerade as ${targetUser.role}`);
    }
  };

  const stopMasquerading = () => {
      const nextUser = masqueradeStack.length > 1 ? masqueradeStack[masqueradeStack.length - 2] : masqueradeStack[0];
      if (nextUser.businessId) {
          const targetBiz = businesses.find(b => b.id === nextUser.businessId);
          if (targetBiz) setSimulatedSubdomain(targetBiz.subdomain);
      } else {
          setSimulatedSubdomain(null);
      }
    setMasqueradeStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const updateBusiness = (updates: Partial<Business>) => {
      setBusinesses(prev => prev.map(b => b.id === business?.id ? { ...b, ...updates } : b));
  };
  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const hasAccess = (allowedRoles: UserRole[]) => allowedRoles.includes(effectiveUser.role);

  const MainRoutes = () => {
      const { role } = effectiveUser;
      
      // Platform Domain Logic
      if (simulatedSubdomain === null) {
          if (hasAccess(['superuser', 'platform_manager', 'platform_support'])) {
              return (
                  <Routes>
                      <Route element={<PlatformLayout user={effectiveUser} darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={() => alert("Sign out")} />}>
                          {(hasAccess(['superuser', 'platform_manager'])) && (
                              <>
                                <Route path="/platform/dashboard" element={<PlatformDashboard />} />
                                <Route path="/platform/businesses" element={<PlatformBusinesses onMasquerade={handleMasquerade} />} />
                                <Route path="/platform/users" element={<PlatformUsers onMasquerade={handleMasquerade} />} />
                              </>
                          )}
                          <Route path="/platform/support" element={<PlatformSupport />} />
                          <Route path="*" element={<Navigate to={hasAccess(['superuser', 'platform_manager']) ? "/platform/dashboard" : "/platform/support" } />} />
                      </Route>
                  </Routes>
              );
          }
           return <div>Platform access only.</div>;
      }
      
      // Tenant Subdomain Logic
      if (business) {
          // Strict Multi-tenancy check
          if (effectiveUser.businessId !== business.id && !isMasquerading) {
               return (
                   <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
                       <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                       <p className="text-gray-500">You do not have access to the <strong>{business.name}</strong> tenant.</p>
                   </div>
               );
          }

          if (role === 'customer') {
              return (
                   <Routes>
                      <Route path="/portal" element={<CustomerLayout business={business} user={effectiveUser} onSignOut={() => alert("Sign out")} />}>
                          <Route path="dashboard" element={<CustomerDashboard />} />
                          <Route path="book" element={<BookingPage />} />
                          <Route path="payments" element={<Payments />} />
                          <Route path="*" element={<Navigate to="/portal/dashboard" />} />
                      </Route>
                  </Routes>
              )
          }
    
          if (hasAccess(['owner', 'manager', 'staff', 'resource'])) {
              return (
                  <Routes>
                      <Route element={<BusinessLayout business={business} user={effectiveUser} darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={() => alert("Sign out")} updateBusiness={updateBusiness} />}>
                          <Route path="/" element={role === 'resource' ? <ResourceDashboard /> : <Dashboard />} />
                          <Route path="/scheduler" element={<Scheduler />} />
                          <Route path="/customers" element={hasAccess(['owner', 'manager', 'staff']) ? <Customers onMasquerade={handleMasquerade} effectiveUser={effectiveUser} /> : <Navigate to="/" />} />
                          <Route path="/resources" element={hasAccess(['owner', 'manager', 'staff']) ? <Resources onMasquerade={handleMasquerade} effectiveUser={effectiveUser} /> : <Navigate to="/" />} />
                          <Route path="/payments" element={hasAccess(['owner', 'manager']) ? <Payments /> : <Navigate to="/" />} />
                          <Route path="/messages" element={hasAccess(['owner', 'manager']) ? <div>Messages Page</div> : <Navigate to="/" />} />
                          <Route path="/settings" element={hasAccess(['owner']) ? <SettingsPage /> : <Navigate to="/" />} />
                          <Route path="*" element={<Navigate to="/" />} />
                      </Route>
                  </Routes>
              );
          }
      }

      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-gray-500">Business not found for subdomain: <strong>{simulatedSubdomain}</strong></p>
        </div>
      );
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-900 text-gray-400 text-xs py-1 px-4 text-center border-b border-gray-800 flex justify-center items-center gap-2 shrink-0">
          <Globe size={10} />
          <span>Current Browser URL:</span>
          <span className="text-white font-mono bg-black/50 px-2 rounded">
              https://{simulatedSubdomain ? `${simulatedSubdomain}.` : 'www.'}smoothschedule.com
          </span>
      </div>

      {isMasquerading && <MasqueradeBanner effectiveUser={effectiveUser} originalUser={originalUser} previousUser={previousUser} onStop={stopMasquerading} />}
      
      {originalUser.role === 'superuser' && (
          <div style={{ position: 'fixed', zIndex: 1000, top: devBoxPosition.top, left: devBoxPosition.left }} className="bg-black/80 text-white p-3 rounded-lg text-xs space-y-2 backdrop-blur-md shadow-2xl border border-white/10 w-64">
            <div className="flex justify-between items-center cursor-move" onMouseDown={handleMouseDown}>
                 <p className="font-bold text-gray-400 uppercase tracking-wider select-none">Dev: Switch Identity</p>
            </div>
            <div className="flex flex-col gap-1">
                <button onClick={() => handleMasquerade(SUPERUSER_USER)} className={`text-left hover:text-blue-300 truncate ${effectiveUser.id === SUPERUSER_USER.id ? 'text-blue-400 font-bold' : ''}`}>• Superuser</button>
                <button onClick={() => handleMasquerade(PLATFORM_MANAGER_USER)} className={`text-left hover:text-blue-300 truncate ${effectiveUser.id === PLATFORM_MANAGER_USER.id ? 'text-blue-400 font-bold' : ''}`}>• Platform Manager</button>
                <button onClick={() => handleMasquerade(PLATFORM_SUPPORT_USER)} className={`text-left hover:text-blue-300 truncate ${effectiveUser.id === PLATFORM_SUPPORT_USER.id ? 'text-blue-400 font-bold' : ''}`}>• Support Staff</button>
            </div>
          </div>
      )}
      <div className="flex-1 min-h-0 relative">
        <Outlet context={{ user: effectiveUser, business, updateBusiness }} />
        <MainRoutes />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
