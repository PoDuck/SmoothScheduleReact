
import React, { useState } from 'react';
import { ALL_USERS } from '../../mockData';
import { Search, Filter, Eye, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface PlatformUsersProps {
  onMasquerade: (targetUser: User) => void;
}

const PlatformUsers: React.FC<PlatformUsersProps> = ({ onMasquerade }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = ALL_USERS.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
        case 'superuser': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        case 'platform_manager': 
        case 'platform_support': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
        case 'owner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'staff': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'customer': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Directory</h2>
          <p className="text-gray-500 dark:text-gray-400">View and manage all users across the platform.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>
        <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200"
        >
            <option value="all">All Roles</option>
            <option value="superuser">Superuser</option>
            <option value="platform_manager">Platform Manager</option>
            <option value="owner">Business Owner</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 object-cover" />
                    {u.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(u.role)}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {u.email}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onMasquerade(u)}
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-xs inline-flex items-center gap-1 px-3 py-1 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <Eye size={14} /> Masquerade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No users found matching your filters.
            </div>
        )}
      </div>
    </div>
  );
};

export default PlatformUsers;