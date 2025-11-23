
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Business, User } from '../types';
import { Save, Globe, Palette, BookKey } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { business, updateBusiness, user } = useOutletContext<{ business: Business; updateBusiness: (updates: Partial<Business>) => void; user: User}>();
  const [formState, setFormState] = useState(business);
  const isOwner = user.role === 'owner';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormState(prev => ({...prev, [name]: checked }));
    } else {
        setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    updateBusiness(formState);
    alert("Settings saved!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your branding, domain, and policies.</p>
        </div>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {isOwner && (
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-brand-500"/> Domain & Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                        <input type="text" name="name" value={formState.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subdomain</label>
                        <div className="flex">
                            <input type="text" name="subdomain" value={formState.subdomain} onChange={handleChange} className="flex-1 min-w-0 px-4 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed" readOnly/>
                            <span className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-r-lg">.smoothschedule.com</span>
                        </div>
                    </div>
                </div>
            </section>
        )}

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Palette size={20} className="text-purple-500"/> Branding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
                    <div className="flex items-center gap-3">
                        <input type="color" name="primaryColor" value={formState.primaryColor} onChange={handleChange} className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"/>
                        <input type="text" name="primaryColor" value={formState.primaryColor} onChange={handleChange} className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-mono text-sm uppercase"/>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookKey size={20} className="text-green-500"/> Booking & Cancellation Policy
            </h3>
            <div className="space-y-6">
                 <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Resource Permissions</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow resources to reschedule their own appointments.</p>
                    </div>
                    <button type="button" className={`${formState.resourcesCanReschedule ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500`} role="switch" onClick={() => setFormState(prev => ({ ...prev, resourcesCanReschedule: !prev.resourcesCanReschedule }))} >
                        <span className={`${formState.resourcesCanReschedule ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
                    </button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Require Payment to Book</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customers must have a card on file to book.</p>
                    </div>
                    <button type="button" className={`${formState.requirePaymentMethodToBook ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500`} role="switch" onClick={() => setFormState(prev => ({ ...prev, requirePaymentMethodToBook: !prev.requirePaymentMethodToBook }))} >
                        <span className={`${formState.requirePaymentMethodToBook ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cancellation Window (hours)</label>
                        <input type="number" name="cancellationWindowHours" value={formState.cancellationWindowHours} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="e.g., 24"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Late Fee (%)</label>
                         <input type="number" name="lateCancellationFeePercent" value={formState.lateCancellationFeePercent} onChange={handleChange} min="0" max="100" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="e.g., 50"/>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
