import { UserRole, Business, User, Resource, Appointment, Blocker, Customer, Service, Ticket, PaymentMethod, ResourceType, AppointmentStatus } from './api-schema';

// Re-export everything from the contract for easy access in components
export * from './api-schema';

// --- UI Specific Types (Not part of the API Data Contract) ---

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
}
