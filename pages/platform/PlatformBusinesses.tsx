
import React, { useState } from 'react';
import { ALL_BUSINESSES, CURRENT_USER } from '../../mockData';
import { Search, Filter, MoreHorizontal, ShieldCheck, Ban, Eye } from 'lucide-react';
import { User, Business } from '../../types';

interface PlatformBusinessesProps {
  onMasquerade: (targetUser: User) => void;
}

const PlatformBusinesses: React.FC<PlatformBusinessesProps> = ({ onMasquerade }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = ALL_BUSINESSES.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoginAs = (biz: Business) => {
    // In a real app, we would fetch the owner of this specific business.
    // For this demo, we'll simulate logging in as the 'CURRENT_USER' (who is an owner) 
    // but effectively masquerading as the owner of the selected business.
    const targetOwner: User = {
        ...CURRENT_USER,
        id: `owner_${biz.id}`,
        name: `${biz.name} Owner`,
        email: `owner@${biz.subdomain}.com`,
        businessId: biz.id, // Explicitly set the business ID to ensure correct tenancy context
    };
    onMasquerade(targetOwner);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Businesses</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage tenants, plans, and access.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
          Add New Tenant
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600">
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium">Business Name</th>
              <th className="px-6 py-4 font-medium">Subdomain</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredBusinesses.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs" style={{ color: biz.primaryColor }}>
                        {biz.name.substring(0, 2).toUpperCase()}
                    </div>
                    {biz.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {biz.subdomain}.smoothschedule.com
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${biz.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      biz.plan === 'Business' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
                  `}>
                    {biz.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                    {biz.status === 'Active' && <ShieldCheck size={16} className="text-green-500" />}
                    {biz.status === 'Suspended' && <Ban size={16} className="text-red-500" />}
                    <span className="text-gray-700 dark:text-gray-300">{biz.status}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {biz.joinedAt?.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleLoginAs(biz)}
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-xs inline-flex items-center gap-1 px-3 py-1 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <Eye size={14} /> Masquerade
                  </button>
                  <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatformBusinesses;
