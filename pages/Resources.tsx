
import React from 'react';
import { RESOURCES, ALL_USERS } from '../mockData';
import { ResourceType, User } from '../types';
import { 
  Plus, 
  MoreHorizontal, 
  User as UserIcon,
  Home,
  Wrench,
  LogIn
} from 'lucide-react';

const ResourceIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
  switch (type) {
    case 'STAFF':
      return <UserIcon size={16} className="text-blue-500" />;
    case 'ROOM':
      return <Home size={16} className="text-green-500" />;
    case 'EQUIPMENT':
      return <Wrench size={16} className="text-purple-500" />;
    default:
      return null;
  }
};

interface ResourcesProps {
  onMasquerade: (user: User) => void;
  effectiveUser: User;
}

const Resources: React.FC<ResourcesProps> = ({ onMasquerade, effectiveUser }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your staff, rooms, and equipment.</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Resource Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {RESOURCES.map((resource) => {
                const resourceUser = ALL_USERS.find(u => u.id === resource.userId);
                
                // Owners/Managers can log in as anyone. Staff can log in as non-staff resources.
                const canMasquerade = resourceUser && (
                  ['owner', 'manager'].includes(effectiveUser.role) ||
                  (effectiveUser.role === 'staff' && resourceUser.role !== 'staff')
                );

                return (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                          <ResourceIcon type={resource.type} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{resource.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          resource.type === 'STAFF' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          resource.type === 'ROOM' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {resource.type.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                        {canMasquerade && resourceUser && (
                          <button onClick={() => onMasquerade(resourceUser)} className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title={`Login As ${resource.name}`}>
                            <LogIn size={16} />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resources;