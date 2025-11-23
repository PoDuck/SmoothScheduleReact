
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SmoothScheduleLogo from '../components/SmoothScheduleLogo';
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
        setLocalError("Please fill in all fields.");
        return;
    }

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      // Navigation handled by useEffect on isAuthenticated change
    } catch (err) {
      // Error is set in context, but we catch here to stop loading state
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Left Side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>
        
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div>
            <div className="flex items-center gap-3 text-white/90">
               <SmoothScheduleLogo className="w-8 h-8 text-brand-500" />
               <span className="font-bold text-xl tracking-tight">Smooth Schedule</span>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Orchestrate your business with precision.
            </h1>
            <p className="text-lg text-gray-300">
              The all-in-one scheduling platform for businesses of all sizes. Manage resources, staff, and bookings effortlessly.
            </p>
            <div className="flex gap-2 pt-4">
                <div className="h-1 w-12 bg-brand-500 rounded-full"></div>
                <div className="h-1 w-4 bg-gray-600 rounded-full"></div>
                <div className="h-1 w-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Smooth Schedule Inc.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:w-1/2 xl:px-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex justify-center mb-6">
                <SmoothScheduleLogo className="w-12 h-12 text-brand-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800/50 animate-in fade-in slide-in-from-top-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Authentication Error
                  </h3>
                  <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error || localError}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform active:scale-[0.98]"
            >
              {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Signing in...
                  </span>
              ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
