

// Domain models based on the Game Plan

export interface WebsitePage {
  id: string;
  name: string;
  path: string;
  isSystem?: boolean;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js?: string;
  screenshots: {
    desktop: string;
    mobile: string;
  };
}

export type WebsiteContent = Record<string, string>;

export interface Business {
  id: string;
  name: string;
  subdomain: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  whitelabelEnabled: boolean;
  plan?: 'Free' | 'Professional' | 'Business' | 'Enterprise';
  status?: 'Active' | 'Suspended' | 'Trial';
  joinedAt?: Date;
  resourcesCanReschedule?: boolean;
  requirePaymentMethodToBook: boolean;
  cancellationWindowHours: number;
  lateCancellationFeePercent: number;
  
  // Website Builder Fields
  websitePages?: Record<string, WebsitePage>;
  activeTemplateId?: string;
  websiteContent?: WebsiteContent;
  initialSetupComplete?: boolean;
}

export type UserRole = 'superuser' | 'platform_manager' | 'platform_support' | 'owner' | 'manager' | 'staff' | 'resource' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  businessId?: string; // Links the user to a specific tenant. Undefined for platform staff.
}

export type ResourceType = 'STAFF' | 'ROOM' | 'EQUIPMENT';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  userId?: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  resourceId: string | null; // null if unassigned
  customerId: string;
  customerName: string;
  serviceId: string;
  startTime: Date; // For MVP, we will assume a specific date
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface Blocker {
  id: string;
  resourceId: string;
  startTime: Date;
  durationMinutes: number;
  title: string;
}

export interface PaymentMethod {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  zip?: string;
  totalSpend: number;
  lastVisit: Date | null;
  status: 'Active' | 'Inactive' | 'Blocked';
  avatarUrl?: string;
  tags?: string[];
  userId?: string;
  paymentMethods: PaymentMethod[];
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

// --- Platform Types ---

export interface Ticket {
  id: string;
  subject: string;
  businessName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: Date;
}

export interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
}