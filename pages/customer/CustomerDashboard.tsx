import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { User, Business, Appointment } from '../../types';
import { APPOINTMENTS, SERVICES } from '../../mockData';
import { Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react';

const AppointmentList: React.FC<{ user: User, business: Business }> = ({ user, business }) => {
    const [appointments, setAppointments] = useState(APPOINTMENTS);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const myAppointments = useMemo(() => appointments.filter(apt => apt.customerName.includes(user.name.split(' ')[0])).sort((a, b) => b.startTime.getTime() - a.startTime.getTime()), [user.name, appointments]);
    
    const upcomingAppointments = myAppointments.filter(apt => new Date(apt.startTime) >= new Date() && apt.status !== 'CANCELLED');
    const pastAppointments = myAppointments.filter(apt => new Date(apt.startTime) < new Date() || apt.status === 'CANCELLED');

    const handleCancel = (appointment: Appointment) => {
        const hoursBefore = (new Date(appointment.startTime).getTime() - new Date().getTime()) / 3600000;
        if (hoursBefore < business.cancellationWindowHours) {
            const service = SERVICES.find(s => s.id === appointment.serviceId);
            const fee = service ? (service.price * (business.lateCancellationFeePercent / 100)).toFixed(2) : 'a fee';
            if (!window.confirm(`Cancelling within the ${business.cancellationWindowHours}-hour window may incur a fee of $${fee}. Are you sure?`)) return;
        } else {
            if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        }
        setAppointments(prev => prev.map(apt => apt.id === appointment.id ? {...apt, status: 'CANCELLED'} : apt));
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Appointments</h2>
            <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 self-start">
                <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'upcoming' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Upcoming</button>
                <button onClick={() => setActiveTab('past')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'past' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Past</button>
            </div>
            <div className="space-y-4">
                {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(apt => {
                    const service = SERVICES.find(s => s.id === apt.serviceId);
                    return (
                        <div key={apt.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">{service?.name}</h3>
                                <p className="text-sm text-gray-500">{new Date(apt.startTime).toLocaleString()}</p>
                            </div>
                            {activeTab === 'upcoming' && <button onClick={() => handleCancel(apt)} className="text-sm font-medium text-red-600 hover:underline">Cancel</button>}
                        </div>
                    );
                })}
                 {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No {activeTab} appointments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomerDashboard: React.FC = () => {
  const { user, business } = useOutletContext<{ user: User, business: Business }>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 dark:text-gray-400">View your upcoming appointments and manage your account.</p>
      </div>

      <AppointmentList user={user} business={business} />
    </div>
  );
};

export default CustomerDashboard;