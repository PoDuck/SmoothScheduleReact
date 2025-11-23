
import React from 'react';
import { Link } from 'react-router-dom';
// FIX: Imported WebsitePage type to correctly type the map function parameter.
import { Business, WebsitePage } from '../types';

interface PublicSiteLayoutProps {
  business: Business;
  children: React.ReactNode;
}

const PublicSiteLayout: React.FC<PublicSiteLayoutProps> = ({ business, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header 
        className="shadow-md"
        style={{ backgroundColor: business.primaryColor }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg font-bold text-xl" style={{ color: business.primaryColor }}>
              {business.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-bold text-xl text-white">{business.name}</span>
          </div>
          <nav className="flex items-center gap-4">
            {/* FIX: Property 'websitePages' is optional. Added a check before mapping. */}
            {/* FIX: Explicitly typed the [path, page] destructuring to resolve the 'unknown' type error on `page`. */}
            {business.websitePages && Object.entries(business.websitePages).map(([path, page]: [string, WebsitePage]) => (
                <Link key={path} to={path} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{page.name}</Link>
            ))}
             <Link to="/portal/dashboard" className="px-4 py-2 text-sm font-medium bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
              Customer Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {business.name}. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicSiteLayout;
