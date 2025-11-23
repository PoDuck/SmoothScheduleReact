
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import BusinessLayout from './layouts/BusinessLayout';
import PlatformLayout from './layouts/PlatformLayout';
import CustomerLayout from './layouts/CustomerLayout';

import Login from './pages/Login';
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

// New imports for Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Mock data for businesses only (user data now comes from API)
import { ALL_BUSINESSES } from './mockData';
import { Business, User, UserRole } from './types';
import { Globe, ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State to simulate the browser's hostname/subdomain.
  // Defaults to 'platform' for the dev environment so we start in the Admin Console.
  // In a real app, this comes from window.location.hostname
  const [simulatedSubdomain, setSimulatedSubdomain] = useState<string>('platform');

  // [TODO: API INTEGRATION]
  // Replace 'businesses' state with a React Query fetch that resolves the CURRENT tenant
  // based on the subdomain.
  // Endpoint: GET /api/v1/tenant/config/?subdomain={simulatedSubdomain}
  const [businesses, setBusinesses] = useState<Business[]>(ALL_BUSINESSES);
  const [business, setBusiness] = useState<Business | null>(null);
  
  const [darkMode, setDarkMode] = useState(false);

  // Effect: Resolve Business Context based on Subdomain
  useEffect(() => {
      if (simulatedSubdomain && simulatedSubdomain !== 'platform' && simulatedSubdomain !== 'www') {
          const foundBiz = businesses.find(b => b.subdomain === simulatedSubdomain);
          setBusiness(foundBiz || null);
      } else {
          setBusiness(null);
      }
  }, [simulatedSubdomain, businesses]);

  // Handle Logout
  const handleSignOut = () => {
      logout();
      navigate('/login');
  };

  const updateBusiness = (updates: Partial<Business>) => {
      // [TODO: API INTEGRATION]
      setBusinesses(prev => prev.map(b => b.id === business?.id ? { ...b, ...updates } : b));
  };
  
  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  const hasAccess = (allowedRoles: UserRole[]) => user && allowedRoles.includes(user.role);

  // Helper to update subdomain from Login or DevBar
  const handleSubdomainChange = (newSubdomain: string) => {
      setSimulatedSubdomain(newSubdomain);
  };

  // Masquerade Stub (Removed or needs API impl)
  const handleMasquerade = (targetUser: User) => {
      alert("Masquerading now requires API integration. See implementation guide.");
  };

  // --- ROUTING LOGIC BASED ON SUBDOMAIN ---
  const MainRoutes = () => {
      if (!user) return <Navigate to="/login" />;

      // Case 1: Public Marketing Site (Root Domain)
      if (simulatedSubdomain === 'www') {
          return (
              <div className="flex flex-col items-center justify-center h-full bg-white text-gray-900 p-8 text-center">
                  <Globe size={64} className="text-brand-600 mb-6" />
                  <h1 className="text-4xl font-bold mb-4">Smooth Schedule</h1>
                  <p className="text-xl text-gray-500 max-w-2xl mb-8">The ultimate multi-tenant scheduling platform.</p>
                  <button onClick={() => setSimulatedSubdomain('platform')} className="px-6 py-3 bg-gray-900 text-white rounded-lg">Go to Login</button>
              </div>
          );
      }

      // Case 2: Platform Portal (platform.smoothschedule.com)
      if (simulatedSubdomain === 'platform') {
          // Strict Check: Tenant users cannot access platform domain
          if (user.businessId) {
             return (
                 <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-900">
                     <h1 className="text-2xl font-bold mb-2">Wrong Domain</h1>
                     <p className="text-gray-500 mb-4">You are logged in as a tenant user but trying to access the Platform Portal.</p>
                     <button onClick={() => {
                         const biz = businesses.find(b => b.id === user.businessId);
                         if (biz) setSimulatedSubdomain(biz.subdomain);
                     }} className="px-4 py-2 bg-brand-600 text-white rounded-lg flex items-center gap-2">
                         Go to {businesses.find(b => b.id === user.businessId)?.name} Portal <ArrowRight size={16}/>
                     </button>
                 </div>
             );
          }

          return (
              <Routes>
                  <Route element={<ProtectedRoute allowedRoles={['superuser', 'platform_manager', 'platform_support']}><PlatformLayout user={user} darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={handleSignOut} /></ProtectedRoute>}>
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
      
      // Case 3: Tenant Portal ([slug].smoothschedule.com)
      if (business) {
          // Strict Multi-tenancy check: User must belong to this business
          if (user.businessId !== business.id) {
               return (
                   <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
                       <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                       <p className="text-gray-500">The user <strong>{user.email}</strong> is not a member of <strong>{business.name}</strong>.</p>
                       <button onClick={() => setSimulatedSubdomain('platform')} className="mt-4 text-brand-600 hover:underline">Return to Platform</button>
                   </div>
               );
          }

          if (user.role === 'customer') {
              return (
                   <Routes>
                      <Route path="/portal" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout business={business} user={user} onSignOut={handleSignOut} /></ProtectedRoute>}>
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
                      <Route element={<ProtectedRoute allowedRoles={['owner', 'manager', 'staff', 'resource']}><BusinessLayout business={business} user={user} darkMode={darkMode} toggleTheme={toggleTheme} onSignOut={handleSignOut} updateBusiness={updateBusiness} /></ProtectedRoute>}>
                          <Route path="/" element={user.role === 'resource' ? <ResourceDashboard /> : <Dashboard />} />
                          <Route path="/scheduler" element={<Scheduler />} />
                          <Route path="/customers" element={hasAccess(['owner', 'manager', 'staff']) ? <Customers onMasquerade={handleMasquerade} effectiveUser={user} /> : <Navigate to="/" />} />
                          <Route path="/resources" element={hasAccess(['owner', 'manager', 'staff']) ? <Resources onMasquerade={handleMasquerade} effectiveUser={user} /> : <Navigate to="/" />} />
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
          {user && <span className="text-green-400 ml-2">(Logged In: {user.email})</span>}
      </div>

      <div className="flex-1 min-h-0 relative">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
                <Outlet context={{ user, business, updateBusiness }} />
            } >
                <Route path="*" element={<MainRoutes />} />
            </Route>
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
