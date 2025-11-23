
import React from 'react';
import { PLATFORM_METRICS } from '../../mockData';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', mrr: 340000 },
  { name: 'Feb', mrr: 355000 },
  { name: 'Mar', mrr: 370000 },
  { name: 'Apr', mrr: 365000 },
  { name: 'May', mrr: 390000 },
  { name: 'Jun', mrr: 410000 },
  { name: 'Jul', mrr: 425900 },
];

const PlatformDashboard: React.FC = () => {
  const getColorClass = (color: string) => {
    switch(color) {
      case 'blue': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'green': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'purple': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'orange': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Global metrics across all tenants.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATFORM_METRICS.map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
              <span className={`p-2 rounded-lg ${getColorClass(metric.color)}`}>
                {metric.label.includes('Revenue') ? <DollarSign size={16} /> : 
                 metric.label.includes('Active') ? <Users size={16} /> :
                 metric.label.includes('Churn') ? <AlertCircle size={16} /> : <Activity size={16} />}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</h3>
              <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                metric.trend === 'up' ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 
                'text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MRR Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">MRR Growth</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'MRR']}
              />
              <Area type="monotone" dataKey="mrr" stroke="#6366f1" fillOpacity={1} fill="url(#colorMrr)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;