

import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { User, Business, Service, Customer } from '../../types';
import { SERVICES, CUSTOMERS } from '../../mockData';
import { Check, ChevronLeft, Calendar, Clock, AlertTriangle, CreditCard } from 'lucide-react';

const BookingPage: React.FC = () => {
  const { user, business } = useOutletContext<{ user: User, business: Business }>();
  // [TODO: API INTEGRATION]
  // Fetch Customer Profile: GET /api/v1/customers/me/
  const customer = CUSTOMERS.find(c => c.userId === user.id);
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // [TODO: API INTEGRATION]
  // Critical: Availability calculation should happen on the backend.
  // Endpoint: GET /api/v1/booking/availability/?service_id={service.id}&date={today}
  // The backend will check resource schedules, blockers, and existing appointments
  // to return valid slots.
  const availableTimes: Date[] = [
    new Date(new Date().setHours(9, 0, 0, 0)),
    new Date(new Date().setHours(10, 30, 0, 0)),
    new Date(new Date().setHours(14, 0, 0, 0)),
    new Date(new Date().setHours(16, 15, 0, 0)),
  ];

  const handleSelectService = (service: Service) => {
    if (business.requirePaymentMethodToBook && (!customer || customer.paymentMethods.length === 0)) {
        // Handled by the conditional rendering below, but could also be an alert.
        return;
    }
    setSelectedService(service);
    setStep(2);
  };
  
  const handleSelectTime = (time: Date) => {
    setSelectedTime(time);
    setStep(3);
  };
  
  const handleConfirmBooking = () => {
    // [TODO: API INTEGRATION]
    // Create Appointment: POST /api/v1/booking/
    // Body: { service_id, start_time, customer_id }
    setBookingConfirmed(true);
    setStep(4);
  };
  
  const resetFlow = () => {
      setStep(1);
      setSelectedService(null);
      setSelectedTime(null);
      setBookingConfirmed(false);
  }

  const renderStepContent = () => {
    if (business.requirePaymentMethodToBook && (!customer || customer.paymentMethods.length === 0)) {
        return (
            <div className="text-center bg-yellow-50 dark:bg-yellow-900/30 p-8 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <AlertTriangle className="mx-auto text-yellow-500" size={40} />
                <h3 className="mt-4 text-lg font-bold text-yellow-800 dark:text-yellow-200">Payment Method Required</h3>
                <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    This business requires a payment method on file to book an appointment. Please add a card to your account before proceeding.
                </p>
                <Link to="/payments" className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium shadow-sm transition-colors">
                    <CreditCard size={16} /> Go to Billing
                </Link>
            </div>
        )
    }

    switch (step) {
      case 1: // Select Service
        return (
          <div className="space-y-4">
            {/* [TODO: API INTEGRATION] Fetch Services: GET /api/v1/services/ */}
            {SERVICES.map(service => (
              <button 
                key={service.id} 
                onClick={() => handleSelectService(service)}
                className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-500 hover:ring-1 hover:ring-brand-500 transition-all flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{service.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{service.durationMinutes} min • {service.description}</p>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">${service.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        );
      case 2: // Select Time
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableTimes.map(time => (
              <button
                key={time.toISOString()}
                onClick={() => handleSelectTime(time)}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center hover:bg-brand-50 dark:hover:bg-brand-900/50 hover:border-brand-500 transition-colors"
              >
                <p className="text-lg font-bold text-gray-900 dark:text-white">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </button>
            ))}
          </div>
        );
      case 3: // Confirmation
        return (
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center space-y-4">
            <Calendar className="mx-auto text-brand-500" size={40}/>
            <h3 className="text-xl font-bold">Confirm Your Booking</h3>
            <p className="text-gray-500 dark:text-gray-400">You are booking <strong className="text-gray-900 dark:text-white">{selectedService?.name}</strong> for <strong className="text-gray-900 dark:text-white">{selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.</p>
            <div className="pt-4">
              <button onClick={handleConfirmBooking} className="w-full max-w-xs py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700">
                Confirm Appointment
              </button>
            </div>
          </div>
        );
      case 4: // Success
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center space-y-4">
            <Check className="mx-auto text-green-500 bg-green-100 dark:bg-green-900/50 rounded-full p-2" size={48}/>
            <h3 className="text-xl font-bold">Appointment Booked!</h3>
            <p className="text-gray-500 dark:text-gray-400">Your appointment for <strong className="text-gray-900 dark:text-white">{selectedService?.name}</strong> at <strong className="text-gray-900 dark:text-white">{selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> is confirmed.</p>
            <div className="pt-4 flex justify-center gap-4">
              <Link to="/" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Go to Dashboard</Link>
              <button onClick={resetFlow} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Book Another</button>
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {step > 1 && step < 4 && (
          <button onClick={() => setStep(s => s - 1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 && "Step 1: Select a Service"}
            {step === 2 && "Step 2: Choose a Time"}
            {step === 3 && "Step 3: Confirm Details"}
            {step === 4 && "Booking Confirmed"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {step === 1 && "Pick from our list of available services."}
            {step === 2 && `Available times for ${new Date().toLocaleDateString()}`}
            {step === 3 && "Please review your appointment details below."}
            {step === 4 && "We've sent a confirmation to your email."}
          </p>
        </div>
      </div>
      
      {renderStepContent()}
    </div>
  );
};

export default BookingPage;
