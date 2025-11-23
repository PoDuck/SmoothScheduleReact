

import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../types';
import { APPOINTMENTS, RESOURCES, SERVICES } from '../../mockData';
import { CheckCircle, XCircle, Clock, Calendar, Briefcase } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            </div>
        </div>
    </div>
);

const ResourceDashboard: React.FC = () => {
    const { user } = useOutletContext<{ user: User }>();

    const myResource = useMemo(() => RESOURCES.find(r => r.userId === user.id), [user.id]);

    const myAppointments = useMemo(() => {
        if (!myResource) return [];
        return APPOINTMENTS.filter(a => a.resourceId === myResource.id);
    }, [myResource]);

    const stats = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const thisWeekAppointments = myAppointments.filter(a => {
            const aptDate = new Date(a.startTime);
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
        });

        const completedThisWeek = thisWeekAppointments.filter(a => a.status === 'COMPLETED').length;
        const totalPastThisWeek = thisWeekAppointments.filter(a => new Date(a.startTime) < today && (a.status === 'COMPLETED' || a.status === 'NO_SHOW')).length;
        const noShowThisWeek = thisWeekAppointments.filter(a => a.status === 'NO_SHOW').length;
        
        const noShowRate = totalPastThisWeek > 0 ? ((noShowThisWeek / totalPastThisWeek) * 100).toFixed(0) + '%' : '0%';
        
        const hoursBookedThisWeek = thisWeekAppointments.reduce((total, apt) => total + apt.durationMinutes, 0) / 60;

        return {
            completed: completedThisWeek,
            noShowRate,
            hoursBooked: hoursBookedThisWeek.toFixed(1)
        };
    }, [myAppointments]);
    
    const todaysAppointments = useMemo(() => {
        const today = new Date();
        return myAppointments
            .filter(a => new Date(a.startTime).toDateString() === today.toDateString())
            .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [myAppointments]);

    if (!myResource) {
        return <div className="p-8">Error: Resource not found for this user.</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400">Welcome, {myResource.name}. Here's your performance summary.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={CheckCircle} label="Completed This Week" value={stats.completed} color="text-green-500 bg-green-100" />
                <StatCard icon={XCircle} label="No-Show Rate (Weekly)" value={stats.noShowRate} color="text-red-500 bg-red-100" />
                <StatCard icon={Briefcase} label="Hours Booked This Week" value={stats.hoursBooked} color="text-blue-500 bg-blue-100" />
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Calendar size={20} className="text-brand-500" /> Today's Agenda</h3>
                <div className="space-y-3">
                    {todaysAppointments.length > 0 ? todaysAppointments.map(apt => {
                        const startTime = new Date(apt.startTime);
                        const endTime = new Date(startTime.getTime() + apt.durationMinutes * 60000);
                        // FIX: Look up service by serviceId to get the service name.
                        const service = SERVICES.find(s => s.id === apt.serviceId);
                        return (
                            <div key={apt.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{apt.customerName}</p>
                                    {/* FIX: Property 'serviceName' does not exist on type 'Appointment'. Use looked-up service name. */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{service?.name}</p>
                                </div>
                                <div className="text-right">
                                     <div className="flex items-center gap-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                        <Clock size={14} />
                                        <span>{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                     </div>
                                      <p className="text-xs text-gray-400">{apt.durationMinutes} minutes</p>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDashboard;