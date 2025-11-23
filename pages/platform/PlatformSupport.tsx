
import React from 'react';
import { SUPPORT_TICKETS } from '../../mockData';
import { Ticket as TicketIcon, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const PlatformSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
          <p className="text-gray-500 dark:text-gray-400">Resolve issues reported by tenants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SUPPORT_TICKETS.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg shrink-0 ${
                            ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                            ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                            <TicketIcon size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                    {ticket.id}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reported by <span className="font-medium text-gray-900 dark:text-white">{ticket.businessName}</span></p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {ticket.createdAt.toLocaleDateString()}
                                </span>
                                <span className={`flex items-center gap-1 font-medium ${
                                    ticket.status === 'Open' ? 'text-green-600' :
                                    ticket.status === 'In Progress' ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                    {ticket.status === 'Open' && <AlertCircle size={12} />}
                                    {ticket.status === 'Resolved' && <CheckCircle2 size={12} />}
                                    {ticket.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                             ticket.priority === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                            {ticket.priority} Priority
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSupport;