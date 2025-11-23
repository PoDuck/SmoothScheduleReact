
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { DASHBOARD_METRICS } from '../mockData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const data = [
  { name: 'Mon', revenue: 4000, appointments: 24 },
  { name: 'Tue', revenue: 3000, appointments: 18 },
  { name: 'Wed', revenue: 2000, appointments: 12 },
  { name: 'Thu', revenue: 2780, appointments: 20 },
  { name: 'Fri', revenue: 1890, appointments: 15 },
  { name: 'Sat', revenue: 6390, appointments: 35 },
  { name: 'Sun', revenue: 3490, appointments: 22 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_METRICS.map((metric, index) => (
          <div key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
              <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                metric.trend === 'up' ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 
                metric.trend === 'down' ? 'text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {metric.trend === 'up' && <TrendingUp size={12} className="mr-1" />}
                {metric.trend === 'down' && <TrendingDown size={12} className="mr-1" />}
                {metric.trend === 'neutral' && <Minus size={12} className="mr-1" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1F2937',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-200">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Appointment Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1F2937',
                    color: '#F3F4F6'
                  }}
                />
                <Line type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;