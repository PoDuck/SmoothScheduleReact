
import React, { useState, useMemo } from 'react';
import { CUSTOMERS, ALL_USERS } from '../mockData';
import { Customer, User } from '../types';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter, 
  ArrowUpDown,
  Mail,
  Phone,
  X,
  Eye
} from 'lucide-react';

interface CustomersProps {
  onMasquerade: (user: User) => void;
  effectiveUser: User;
}

const Customers: React.FC<CustomersProps> = ({ onMasquerade, effectiveUser }) => {
  const [customersList, setCustomersList] = useState<Customer[]>(CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tags: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleSort = (key: keyof Customer) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCustomer: Customer = {
      id: `c_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      totalSpend: 0,
      lastVisit: null,
      status: 'Active',
      paymentMethods: [],
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    setCustomersList(prev => [newCustomer, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', tags: '', city: '', state: '', zip: '' });
  };

  const filteredCustomers = useMemo(() => {
    let sorted = [...customersList];
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      sorted = sorted.filter(c => 
        c.name.toLowerCase().includes(lowerTerm) || 
        c.email.toLowerCase().includes(lowerTerm) ||
        c.phone.includes(searchTerm)
      );
    }

    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [customersList, searchTerm, sortConfig]);
  
  const canMasquerade = ['owner', 'manager', 'staff'].includes(effectiveUser.role);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your client base and view history.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Customer <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">Status <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-right" onClick={() => handleSort('totalSpend')}>
                  <div className="flex items-center justify-end gap-1">Total Spend <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-right" onClick={() => handleSort('lastVisit')}>
                   <div className="flex items-center justify-end gap-1">Last Visit <ArrowUpDown size={14} className="text-gray-400" /></div>
                </th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCustomers.map((customer) => {
                const customerUser = ALL_USERS.find(u => u.id === customer.userId);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                          {customer.avatarUrl ? <img src={customer.avatarUrl} alt={customer.name} className="w-full h-full object-cover" /> : <span className="font-semibold text-gray-500 dark:text-gray-400">{customer.name.substring(0, 2).toUpperCase()}</span>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          {customer.tags && (<div className="flex gap-1 mt-1">{customer.tags.map(tag => (<span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{tag}</span>))}</div>)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Mail size={14} className="text-gray-400" />{customer.email}</div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Phone size={14} className="text-gray-400" />{customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : customer.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>{customer.status}</span></td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">${customer.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">{customer.lastVisit ? customer.lastVisit.toLocaleDateString() : <span className="text-gray-400 italic">Never</span>}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canMasquerade && customerUser && (
                          <button 
                            onClick={() => onMasquerade(customerUser)} 
                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-xs inline-flex items-center gap-1 px-3 py-1 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            title="Masquerade as User"
                          >
                            <Eye size={14} /> Masquerade
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
          {filteredCustomers.length === 0 && (<div className="p-12 text-center"><p className="text-gray-500 dark:text-gray-400">No customers found matching your search.</p></div>)}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Customer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="e.g. John Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="e.g. john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="e.g. (555) 123-4567" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="City" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="State" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="Zip" />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-colors" placeholder="e.g. VIP, Referral" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">Create Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
