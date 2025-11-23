

import { Appointment, Business, Resource, User, Metric, Customer, PlatformMetric, Ticket, Blocker, Service, WebsiteTemplate } from './types';

export const TEMPLATES: WebsiteTemplate[] = [
    {
        id: 'template-default',
        name: 'Standard Auto',
        description: 'A clean, professional template for auto repair shops.',
        html: `
            <div class="hero">
                <div class="container">
                    <h1>{{hero_title}}</h1>
                    <p>{{hero_subtitle}}</p>
                    <a href="/portal/book" class="btn">Book Now</a>
                </div>
            </div>
            <div class="about">
                <div class="container">
                    <h2>About Us</h2>
                    <p>{{about_text}}</p>
                </div>
            </div>
        `,
        css: `
            :root { --primary-color: #3B82F6; }
            body { font-family: sans-serif; margin: 0; color: #333; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            .hero { background-color: #f3f4f6; padding: 80px 0; text-align: center; }
            .hero h1 { color: var(--primary-color); font-size: 3rem; margin-bottom: 20px; }
            .hero p { font-size: 1.25rem; color: #666; margin-bottom: 30px; }
            .btn { background-color: var(--primary-color); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .about { padding: 60px 0; }
        `,
        screenshots: {
            desktop: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
            mobile: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80'
        }
    }
];

export const CURRENT_BUSINESS: Business = {
  id: 'b1',
  name: 'Acme Auto Repair',
  subdomain: 'acme-auto',
  primaryColor: '#3B82F6', // Blue-500
  secondaryColor: '#10B981', // Emerald-500
  whitelabelEnabled: true,
  plan: 'Business',
  status: 'Active',
  joinedAt: new Date('2023-01-15'),
  resourcesCanReschedule: false,
  requirePaymentMethodToBook: true,
  cancellationWindowHours: 24,
  lateCancellationFeePercent: 50,
  websitePages: {
      '/': { id: 'p1', name: 'Home', path: '/', isSystem: true },
      '/about': { id: 'p2', name: 'About', path: '/about' }
  },
  activeTemplateId: 'template-default',
  websiteContent: {
      hero_title: 'Welcome to Acme Auto Repair',
      hero_subtitle: 'Quality service you can trust.',
      about_text: 'We have been serving the community for over 20 years.'
  },
  initialSetupComplete: true
};

export const SECOND_BUSINESS: Business = {
  id: 'b2',
  name: 'TechSolutions Inc.',
  subdomain: 'techsolutions',
  primaryColor: '#6366F1',
  secondaryColor: '#4F46E5',
  whitelabelEnabled: false,
  plan: 'Enterprise',
  status: 'Active',
  joinedAt: new Date('2023-03-10'),
  resourcesCanReschedule: true,
  requirePaymentMethodToBook: false,
  cancellationWindowHours: 12,
  lateCancellationFeePercent: 0,
};

// Tenant Users (Acme - b1)
export const CURRENT_USER: User = {
  id: 'u1',
  name: 'John Owner',
  email: 'john@acme-auto.com',
  role: 'owner',
  businessId: 'b1',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const MANAGER_USER: User = {
  id: 'u_manager_acme',
  name: 'Manny Manager',
  email: 'manny@acme-auto.com',
  role: 'manager',
  businessId: 'b1',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const STAFF_USER: User = {
  id: 'u_staff_main',
  name: 'Stacy Staff',
  email: 'stacy@acme-auto.com',
  role: 'staff',
  businessId: 'b1',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const RESOURCE_USER: User = {
  id: 'u_res_main',
  name: 'Service Bay 3',
  email: 'bay3@internal.acme-auto.com',
  role: 'resource',
  businessId: 'b1',
  avatarUrl: 'https://images.unsplash.com/photo-1581092918056-0c9c7e344934?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=60',
};

export const CUSTOMER_USER: User = {
  id: 'u_cust1',
  name: 'Alice Smith',
  email: 'alice@example.com',
  role: 'customer',
  businessId: 'b1',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// Tenant Users (TechSolutions - b2) - For Testing
export const TECH_OWNER_USER: User = {
    id: 'u_tech_owner',
    name: 'Tech CEO',
    email: 'ceo@techsolutions.com',
    role: 'owner',
    businessId: 'b2',
    avatarUrl: 'https://randomuser.me/api/portraits/men/85.jpg'
};

// Platform Users (No businessId)
export const SUPERUSER_USER: User = {
  id: 'u_super',
  name: 'Sarah Super',
  email: 'sarah@smoothschedule.com',
  role: 'superuser',
  avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const PLATFORM_MANAGER_USER: User = {
  id: 'u_manager',
  name: 'Mike Manager',
  email: 'mike@smoothschedule.com',
  role: 'platform_manager',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const PLATFORM_SUPPORT_USER: User = {
  id: 'u_support',
  name: 'Sam Support',
  email: 'sam@smoothschedule.com',
  role: 'platform_support',
  avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const staffUserAcme: User = { id: 'u_staff_acme', name: 'Mike Mechanic', email: 'mike@acme-auto.com', role: 'staff', businessId: 'b1', avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg' };
const staffUserTech: User = { id: 'u_staff_tech', name: 'Jen IT', email: 'jen@techsol.com', role: 'staff', businessId: 'b2', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' };


export const RESOURCES: Resource[] = [
  { id: 'r1', name: 'Bay 1 (Lift)', type: 'ROOM' },
  { id: 'r2', name: 'Bay 2 (Lift)', type: 'ROOM' },
  { id: 'r3', name: 'Mike (Senior Mech)', type: 'STAFF', userId: staffUserAcme.id },
  { id: 'r4', name: 'Stacy Staff (Diag Tech)', type: 'STAFF', userId: STAFF_USER.id },
  { id: 'r5', name: 'Alignment Machine', type: 'EQUIPMENT' },
  { id: 'r6', name: 'Service Bay 3', type: 'ROOM', userId: RESOURCE_USER.id },
];

export const SERVICES: Service[] = [
  { id: 's1', name: 'Full Synthetic Oil Change', durationMinutes: 60, price: 89.99, description: 'Premium oil and filter change.' },
  { id: 's2', name: 'Brake Pad Replacement', durationMinutes: 120, price: 245.00, description: 'Front and rear brake pad replacement.' },
  { id: 's3', name: 'Engine Diagnostics', durationMinutes: 90, price: 120.00, description: 'Full computer diagnostics of engine.' },
  { id: 's4', name: 'Tire Rotation', durationMinutes: 45, price: 40.00, description: 'Rotate and balance all four tires.' },
  { id: 's5', name: '4-Wheel Alignment', durationMinutes: 60, price: 95.50, description: 'Precision laser alignment.' },
  { id: 's6', name: 'Tire Patch', durationMinutes: 30, price: 25.00, description: 'Repair minor tire punctures.' },
  { id: 's7', name: 'Vehicle Inspection', durationMinutes: 60, price: 75.00, description: 'Comprehensive multi-point vehicle inspection.' },
];

const dayOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const setTimeOnDate = (date: Date, hours: number, minutes: number) => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const today = dayOffset(0);
const yesterday = dayOffset(-1);
const tomorrow = dayOffset(1);
const lastWeek = dayOffset(-7);


export const APPOINTMENTS: Appointment[] = [
  // Today for other resources
  { id: 'a1', resourceId: 'r1', customerId: 'c1', customerName: 'Alice Smith', serviceId: 's1', startTime: setTimeOnDate(today, 9, 0), durationMinutes: 60, status: 'CONFIRMED' },
  { id: 'a2', resourceId: 'r3', customerId: 'c1', customerName: 'Alice Smith', serviceId: 's7', startTime: setTimeOnDate(today, 9, 0), durationMinutes: 60, status: 'CONFIRMED' },
  { id: 'a3', resourceId: 'r2', customerId: 'c2', customerName: 'Bob Jones', serviceId: 's2', startTime: setTimeOnDate(today, 10, 30), durationMinutes: 120, status: 'CONFIRMED' },
  { id: 'a4', resourceId: 'r4', customerId: 'c3', customerName: 'Charlie Day', serviceId: 's3', startTime: setTimeOnDate(today, 13, 0), durationMinutes: 90, status: 'COMPLETED' },
  { id: 'a5', resourceId: null, customerId: 'c4', customerName: 'Dana White', serviceId: 's4', startTime: setTimeOnDate(today, 14, 0), durationMinutes: 45, status: 'PENDING' },
  { id: 'a6', resourceId: 'r5', customerId: 'c5', customerName: 'Evan Stone', serviceId: 's5', startTime: setTimeOnDate(today, 11, 0), durationMinutes: 60, status: 'CONFIRMED' },
  
  // Appointments for our Resource User (r6 / Service Bay 3)
  // Today
  { id: 'a7', resourceId: 'r6', customerId: 'c6', customerName: 'Fiona Gallagher', serviceId: 's6', startTime: setTimeOnDate(today, 15, 0), durationMinutes: 30, status: 'CONFIRMED' },
  { id: 'a8', resourceId: 'r6', customerId: 'c7', customerName: 'George Costanza', serviceId: 's7', startTime: setTimeOnDate(today, 10, 0), durationMinutes: 45, status: 'CONFIRMED' },
  { id: 'a9', resourceId: 'r6', customerId: 'c8', customerName: 'Harry Potter', serviceId: 's3', startTime: setTimeOnDate(today, 14, 0), durationMinutes: 60, status: 'CONFIRMED' },
  // Yesterday
  { id: 'a10', resourceId: 'r6', customerId: 'c9', customerName: 'Iris West', serviceId: 's5', startTime: setTimeOnDate(yesterday, 11, 0), durationMinutes: 90, status: 'COMPLETED' },
  { id: 'a11', resourceId: 'r6', customerId: 'c10', customerName: 'Jack Sparrow', serviceId: 's6', startTime: setTimeOnDate(yesterday, 14, 30), durationMinutes: 30, status: 'COMPLETED' },
  { id: 'a12', resourceId: 'r6', customerId: 'c11', customerName: 'Kara Danvers', serviceId: 's2', startTime: setTimeOnDate(yesterday, 9, 0), durationMinutes: 120, status: 'NO_SHOW' },
  // Tomorrow
  { id: 'a13', resourceId: 'r6', customerId: 'c12', customerName: 'Luke Skywalker', serviceId: 's7', startTime: setTimeOnDate(tomorrow, 10, 0), durationMinutes: 180, status: 'CONFIRMED' },

  // Past appointment for Alice Smith (CUSTOMER_USER)
  { id: 'a14', resourceId: 'r1', customerId: 'c1', customerName: 'Alice Smith', serviceId: 's1', startTime: setTimeOnDate(lastWeek, 10, 0), durationMinutes: 60, status: 'COMPLETED' }
];

export const BLOCKERS: Blocker[] = [
  { id: 'b1', resourceId: 'r6', startTime: setTimeOnDate(today, 12, 0), durationMinutes: 60, title: 'Lunch Break' },
  { id: 'b2', resourceId: 'r6', startTime: setTimeOnDate(tomorrow, 16, 0), durationMinutes: 30, title: 'Inventory Check' },
];

export const DASHBOARD_METRICS: Metric[] = [
  { label: 'Total Revenue', value: '$12,450', change: '+12%', trend: 'up' },
  { label: 'Appointments', value: '145', change: '+5%', trend: 'up' },
  { label: 'New Customers', value: '24', change: '-2%', trend: 'down' },
  { label: 'Avg. Ticket', value: '$85.90', change: '+8%', trend: 'up' },
];

const customerUserBob: User = { id: 'u_cust_bob', name: 'Bob Jones', email: 'bob@example.com', role: 'customer', businessId: 'b1', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg' };
const customerUserCharlie: User = { id: 'u_cust_charlie', name: 'Charlie Day', email: 'charlie@paddys.com', role: 'customer', businessId: 'b1', avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg' };


export const CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    userId: CUSTOMER_USER.id,
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '(555) 123-4567',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    totalSpend: 1250.50,
    lastVisit: new Date('2023-10-15'),
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    tags: ['VIP', 'Regular'],
    paymentMethods: [
        { id: 'pm_1', brand: 'Visa', last4: '4242', isDefault: true },
        { id: 'pm_2', brand: 'Mastercard', last4: '5555', isDefault: false },
    ]
  },
  {
    id: 'c2',
    userId: customerUserBob.id,
    name: 'Bob Jones',
    email: 'bob.j@example.com',
    phone: '(555) 987-6543',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    totalSpend: 450.00,
    lastVisit: new Date('2023-09-20'),
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    paymentMethods: [],
  },
  {
    id: 'c3',
    userId: customerUserCharlie.id,
    name: 'Charlie Day',
    email: 'charlie@paddys.com',
    phone: '(555) 444-3333',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19103',
    totalSpend: 89.99,
    lastVisit: new Date('2023-10-01'),
    status: 'Inactive',
    tags: ['New'],
    paymentMethods: [
        { id: 'pm_3', brand: 'Amex', last4: '0005', isDefault: true },
    ],
  },
  {
    id: 'c4',
    name: 'Dana White',
    email: 'dana@ufc.fake',
    phone: '(555) 777-8888',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89109',
    totalSpend: 3200.00,
    lastVisit: new Date('2023-10-25'),
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    tags: ['Fleet'],
    paymentMethods: [],
  },
  {
    id: 'c5',
    name: 'Evan Stone',
    email: 'evan@stone.com',
    phone: '(555) 222-1111',
    totalSpend: 150.00,
    lastVisit: null,
    status: 'Active',
    tags: ['Referral'],
    paymentMethods: [],
  },
  {
    id: 'c6',
    name: 'Fiona Gallagher',
    email: 'fiona@chicago.net',
    phone: '(555) 666-9999',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    totalSpend: 0.00,
    lastVisit: null,
    status: 'Blocked',
    paymentMethods: [],
  },
  {
    id: 'c7',
    name: 'George Costanza',
    email: 'george@vandelay.com',
    phone: '(555) 555-5555',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    totalSpend: 12.50,
    lastVisit: new Date('2023-01-10'),
    status: 'Inactive',
    paymentMethods: [],
  }
];

// --- Platform Mock Data ---

const createBiz = (overrides: Partial<Business>): Business => ({
  id: 'b_new',
  name: 'New Business',
  subdomain: 'newbiz',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  whitelabelEnabled: false,
  plan: 'Free',
  status: 'Trial',
  joinedAt: new Date(),
  resourcesCanReschedule: false,
  requirePaymentMethodToBook: false,
  cancellationWindowHours: 24,
  lateCancellationFeePercent: 0,
  ...overrides,
});

export const ALL_BUSINESSES: Business[] = [
  CURRENT_BUSINESS,
  SECOND_BUSINESS,
  createBiz({ id: 'b3', name: 'Mom & Pop Shop', subdomain: 'mompop', plan: 'Free', status: 'Suspended', primaryColor: '#EC4899' }),
];

export const ALL_USERS: User[] = [
  SUPERUSER_USER,
  PLATFORM_MANAGER_USER,
  PLATFORM_SUPPORT_USER,
  CURRENT_USER,
  MANAGER_USER,
  STAFF_USER,
  RESOURCE_USER,
  CUSTOMER_USER,
  TECH_OWNER_USER,
  customerUserBob,
  customerUserCharlie,
  staffUserAcme,
  staffUserTech
];

export const SUPPORT_TICKETS: Ticket[] = [
    { id: 'TIC-1024', subject: 'Unable to process refund', businessName: 'Acme Auto Repair', priority: 'High', status: 'Open', createdAt: new Date('2023-10-25') },
    { id: 'TIC-1023', subject: 'Feature request: Dark mode', businessName: 'TechSolutions Inc.', priority: 'Low', status: 'Resolved', createdAt: new Date('2023-10-20') },
    { id: 'TIC-1022', subject: 'Billing discrepancy', businessName: 'Mom & Pop Shop', priority: 'Medium', status: 'In Progress', createdAt: new Date('2023-10-22') },
];

export const PLATFORM_METRICS: PlatformMetric[] = [
  { label: 'Monthly Recurring Revenue', value: '$425,900', change: '+8.2%', trend: 'up', color: 'blue' },
  { label: 'Active Tenants', value: '1,240', change: '+12%', trend: 'up', color: 'green' },
  { label: 'Churn Rate', value: '2.4%', change: '-0.5%', trend: 'down', color: 'orange' },
  { label: 'Total API Requests', value: '45.2M', change: '+15%', trend: 'up', color: 'purple' },
];