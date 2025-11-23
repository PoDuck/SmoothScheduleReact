
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
import PlatformStaff from './pages/platform/PlatformStaff';

import MasqueradeBanner from './components/MasqueradeBanner';

import { 
    ALL_BUSINESSES,
    SUPERUSER_USER, 
    PLATFORM_MANAGER_USER, 
    PLATFORM_SUPPORT_USER, 
} from './mockData';
import { Business, User, UserRole } from './types';
import { Globe, ArrowRight } from 'lucide-react';

/*
 * ARCHITECTURE NOTE: STRICT SUBDOMAIN MULTI-TENANCY
 * 
 * This application uses a strict subdomain-based architecture for tenant isolation.
 * 
 * 1. Platform Portal (platform.smoothschedule.com)
 *    - Reserved strictly for Platform Staff (Superusers, Platform Managers, Support).
 *    - Provides cross-tenant management tools.
 * 
 * 2. Tenant Portals ([slug].smoothschedule.com)
 *    - Each business gets a unique subdomain (e.g., acme-auto.smoothschedule.com).
 *    - All business-level users (Owners, Managers, Staff, Resources, Customers) MUST login here.
 *    - Data is strictly isolated. A user logged into 'acme-auto' cannot access 'techsolutions'.
 * 
 * 3. Public Marketing Site (www.smoothschedule.com or smoothschedule.com)
 *    - Reserved for the sales/landing page.
 *    - No application login functionality exists here.
 * 
 * DEVELOPMENT NOTE:
 * Since this runs in a preview environment without real DNS, we use `simulatedSubdomain` state
 * to emulate the browser's hostname behavior.
 */

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  
  // State to simulate the browser's hostname/subdomain.
  // Defaults to 'platform' for the dev environment so we start in the Admin Console.
  const [simulatedSubdomain, setSimulatedSubdomain] = useState<string | null>('platform');

  // [TODO: API INTEGRATION]
  // Replace 'businesses' state with a React Query fetch that resolves the CURRENT tenant
  // based on the subdomain.
  // Endpoint: GET /api/v1/tenant/config/?subdomain={simulatedSubdomain}
  const [businesses, setBusinesses] = useState<Business[]>(ALL_BUSINESSES);
  const [business, setBusiness] = useState<Business | null>(null);
  
  const [darkMode, setDarkMode] = useState(false);
  
  // [TODO: API INTEGRATION]
  // Authentication state should be managed via a robust Auth Provider (e.g., AuthContext).
  // Initial user fetch: GET /api/v1/me/ (returns profile + permissions)
  const [masqueradeStack, setMasqueradeStack] = useState<User[]>([SUPERUSER_USER]);
  
  const [devBoxPosition, setDevBoxPosition] = useState({ top: window.innerHeight - 200, left: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const originalUser = masqueradeStack[0];
  const effectiveUser = masqueradeStack[masqueradeStack.length - 1];
  const isMasquerading = masqueradeStack.length > 1;
  const previousUser = isMasquerading ? masqueradeStack[masqueradeStack.length - 2] : null;

  // Effect: Resolve Business Context based on Subdomain
  useEffect(() => {
      // [TODO: API INTEGRATION]
      // This logic moves to the backend middleware. 
      // The frontend simply makes a request, and the API responds with 404 if the subdomain
      // doesn't exist, or 200 with the Business Config object if it does.
      if (simulatedSubdomain && simulatedSubdomain !== 'platform' && simulatedSubdomain !== 'www') {
          const foundBiz = businesses.find(b => b.subdomain === simulatedSubdomain);
          setBusiness(foundBiz || null);
      } else {
          setBusiness(null);
      }
  }, [simulatedSubdomain, businesses]);

  // Dev Tool: Dragging Logic
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

  // Core Masquerading Logic
  const handleMasquerade = (targetUser: User) => {
    // [TODO: API INTEGRATION]
    // Masquerading logic must be validated on the server.
    // Endpoint: POST /api/v1/auth/masquerade/
    // Body: { target_user_id: targetUser.id }
    // Response: A new short-lived JWT token scoped to the target user.
    // The frontend should store the old token to "Stop Masquerading".

    // 1. Determine target domain
    let targetSubdomain = 'platform';
    
    // If target is a tenant user, we MUST switch to their subdomain
    if (targetUser.businessId) {
        const targetBiz = businesses.find(b => b.id === targetUser.businessId);
        if (targetBiz) {
            targetSubdomain = targetBiz.subdomain;
        }
    } else {
        // If target is platform staff, ensure we are on 'platform'
        targetSubdomain = 'platform';
    }

    // 2. Switch simulated domain
    if (targetSubdomain !== simulatedSubdomain) {
        setSimulatedSubdomain(targetSubdomain);
    }

    // 3. Check permissions and push to stack
    if (ROLE_RANK[effectiveUser.role] > ROLE_RANK[targetUser.role] || effectiveUser.role === 'superuser' || effectiveUser.role === 'platform_manager') {
      setMasqueradeStack(prev => [...prev, targetUser]);
      navigate('/');
    } else {
      alert(`Permission Denied: ${effectiveUser.role} cannot masquerade as ${targetUser.role}`);
    }
  };

  const stopMasquerading = () => {
      // [TODO: API INTEGRATION]
      // Revert to the original JWT token stored in memory/local storage.
      
      const nextUser = masqueradeStack.length > 1 ? masqueradeStack[masqueradeStack.length - 2] : masqueradeStack[0];
      
      // Determine where the user we are returning TO belongs
      let targetSubdomain = 'platform';
      if (nextUser.businessId) {
          const targetBiz = businesses.find(b => b.id === nextUser.businessId);
          if (targetBiz) targetSubdomain = targetBiz.subdomain;
      }

      setSimulatedSubdomain(targetSubdomain);
      setMasqueradeStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const updateBusiness = (updates: Partial<Business>) => {
      // [TODO: API INTEGRATION]
      // Endpoint: PATCH /api/v1/business/{business.id}/
      // This should trigger a refetch of the business config.
      setBusinesses(prev => prev.map(b => b.id === business?.id ? { ...b, ...updates } : b));
  };
  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const hasAccess = (allowedRoles: UserRole[]) => allowedRoles.includes(effectiveUser.role);

  // --- ROUTING LOGIC BASED ON SUBDOMAIN ---
  const MainRoutes = () => {
      const { role } = effectiveUser;
      
      // Case 1: Public Marketing Site (Root Domain)
      if (!simulatedSubdomain || simulatedSubdomain === 'www') {
          return (
              <div className="flex flex-col items-center justify-center h-full bg-white text-gray-900 p-8 text-center">
                  <Globe size={64} className="text-brand-600 mb-6" />
                  <h1 className="text-4xl font-bold mb-4">Smooth Schedule</h1>
                  <p className="text-xl text-gray-500 max-w-2xl mb-8">The ultimate multi-tenant scheduling platform for your business.</p>
                  <div className="flex gap-4">
                      <button onClick={() => setSimulatedSubdomain('platform')} className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                          Go to Platform Login
                      </button>
                      <button onClick={() => setSimulatedSubdomain('acme-auto')} className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                          View Demo Tenant
                      </button>
                  </div>
              </div>
          );
      }

      // Case 2: Platform Portal (platform.smoothschedule.com)
      if (simulatedSubdomain === 'platform') {
          // Strict Check: Tenant users cannot access platform domain
          if (effectiveUser.businessId) {
             return (
                 <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-900">
                     <h1 className="text-2xl font-bold mb-2">Wrong Domain</h1>
                     <p className="text-gray-500 mb-4">You are logged in as a tenant user but trying to access the Platform Portal.</p>
                     <button onClick={() => {
                         const biz = businesses.find(b => b.id === effectiveUser.businessId);
                         if (biz) setSimulatedSubdomain(biz.subdomain);
                     }} className="px-4 py-2 bg-brand-600 text-white rounded-lg flex items-center gap-2">
                         Go to {businesses.find(b => b.id === effectiveUser.businessId)?.name} Portal <ArrowRight size={16}/>
                     </button>
                 </div>
             );
          }

          if (hasAccess(['superuser', 'platform_manager', 'platform_support'])) {
              return (
                  <Routes>
                      <Route element={<PlatformLayout user={effectiveUser} darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={() => alert("Sign out")} />}>
                          {(hasAccess(['superuser', 'platform_manager'])) && (
                              <>
                                <Route path="/platform/dashboard" element={<PlatformDashboard />} />
                                <Route path="/platform/businesses" element={<PlatformBusinesses onMasquerade={handleMasquerade} />} />
                                <Route path="/platform/users" element={<PlatformUsers onMasquerade={handleMasquerade} />} />
                                <Route path="/platform/staff" element={<PlatformStaff />} />
                              </>
                          )}
                          <Route path="/platform/support" element={<PlatformSupport />} />
                          <Route path="*" element={<Navigate to={hasAccess(['superuser', 'platform_manager']) ? "/platform/dashboard" : "/platform/support" } />} />
                      </Route>
                  </Routes>
              );
          }
           return <div>Platform access restricted.</div>;
      }
      
      // Case 3: Tenant Portal ([slug].smoothschedule.com)
      if (business) {
          // Strict Multi-tenancy check: User must belong to this business
          if (effectiveUser.businessId !== business.id && !isMasquerading) {
               return (
                   <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
                       <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                       <p className="text-gray-500">The user <strong>{effectiveUser.email}</strong> is not a member of <strong>{business.name}</strong>.</p>
                       <button onClick={() => setSimulatedSubdomain('platform')} className="mt-4 text-brand-600 hover:underline">Return to Platform</button>
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
      {/* Dev Bar to show current 'Domain' */}
      <div className="bg-gray-900 text-gray-400 text-xs py-1 px-4 text-center border-b border-gray-800 flex justify-center items-center gap-2 shrink-0">
          <Globe size={10} />
          <span>Current Context:</span>
          <span className="text-white font-mono bg-black/50 px-2 rounded">
              https://{simulatedSubdomain}.smoothschedule.com
          </span>
      </div>

      {isMasquerading && <MasqueradeBanner effectiveUser={effectiveUser} originalUser={originalUser} previousUser={previousUser} onStop={stopMasquerading} />}
      
      {/* Dev Identity Switcher - Simplified for Platform Roles */}
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
            <div className="pt-2 border-t border-gray-700 text-[10px] text-gray-500">
                Switching to Platform roles will reset domain to 'platform'. Use "Masquerade" in lists to test tenant users.
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
