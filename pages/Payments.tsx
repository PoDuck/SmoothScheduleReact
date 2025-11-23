
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, CreditCard, AlertTriangle, Plus, MoreVertical, Trash2, Star, X } from 'lucide-react';
import { User, Business, PaymentMethod, Customer } from '../types';
import { CUSTOMERS } from '../mockData';

const Payments: React.FC = () => {
  const { user: effectiveUser, business } = useOutletContext<{ user: User, business: Business }>();
  // Assuming originalUser and isMasquerading would be passed if needed for transactions
  // For now, focusing on customer UI.

  const isBusiness = effectiveUser.role === 'owner' || effectiveUser.role === 'manager';
  const isCustomer = effectiveUser.role === 'customer';

  // Find the full customer profile
  const [customerProfile, setCustomerProfile] = useState<Customer | undefined>(
    CUSTOMERS.find(c => c.userId === effectiveUser.id)
  );
  
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  
  const handleSetDefault = (pmId: string) => {
      if (!customerProfile) return;
      const updatedMethods = customerProfile.paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === pmId
      }));
      setCustomerProfile({...customerProfile, paymentMethods: updatedMethods });
  }

  const handleDeleteMethod = (pmId: string) => {
      if (!customerProfile) return;
      if (window.confirm("Are you sure you want to delete this payment method?")) {
        const updatedMethods = customerProfile.paymentMethods.filter(pm => pm.id !== pmId);
        // If deleting the default, make the first one default
        if (updatedMethods.length > 0 && !updatedMethods.some(pm => pm.isDefault)) {
            updatedMethods[0].isDefault = true;
        }
        setCustomerProfile({...customerProfile, paymentMethods: updatedMethods });
      }
  }

  const handleAddCard = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock adding a card
      if (!customerProfile) return;
      const newCard: PaymentMethod = {
          id: `pm_${Date.now()}`,
          brand: 'Visa',
          last4: String(Math.floor(1000 + Math.random() * 9000)),
          isDefault: customerProfile.paymentMethods.length === 0
      };
      const updatedMethods = [...customerProfile.paymentMethods, newCard];
      setCustomerProfile({...customerProfile, paymentMethods: updatedMethods });
      setIsAddCardModalOpen(false);
  }

  if (isBusiness) {
    // Business billing view remains the same for now
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Plan & Billing</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your subscription and payment methods.</p>
        </div>
        {/* Plan comparison UI */}
      </div>
    );
  }

  if (isCustomer && customerProfile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your payment methods and view invoice history.</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Payment Methods</h3>
            <button onClick={() => setIsAddCardModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"><Plus size={16} /> Add Card</button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {customerProfile.paymentMethods.length > 0 ? customerProfile.paymentMethods.map((pm) => (
              <div key={pm.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-4">
                  <CreditCard className="text-gray-400" size={24} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{pm.brand} ending in {pm.last4}</p>
                    {pm.isDefault && <span className="text-xs font-medium text-green-600 dark:text-green-400">Default</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <button onClick={() => handleSetDefault(pm.id)} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium"><Star size={14} /> Set as Default</button>
                  )}
                  <button onClick={() => handleDeleteMethod(pm.id)} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>
            )) : <div className="p-8 text-center text-gray-500 dark:text-gray-400">No payment methods on file.</div>}
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Invoice History</h3>
          </div>
          {/* Mock Invoice History */}
        </div>

        {isAddCardModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddCardModalOpen(false)}>
              <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-semibold">Add New Card</h3><button onClick={() => setIsAddCardModalOpen(false)}><X size={20} /></button></div>
                <form onSubmit={handleAddCard} className="p-6 space-y-4">
                    <div><label className="text-sm font-medium">Card Number</label><div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">•••• •••• •••• 4242</div></div>
                    <div><label className="text-sm font-medium">Cardholder Name</label><div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">{effectiveUser.name}</div></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">Expiry</label><div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">12 / 2028</div></div>
                        <div><label className="text-sm font-medium">CVV</label><div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">•••</div></div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">This is a simulated form. No real card data is required.</p>
                    <button type="submit" className="w-full py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700">Add Card</button>
                </form>
              </div>
            </div>
        )}
      </div>
    );
  }

  return <div>Access Denied or User not found.</div>;
};

export default Payments;