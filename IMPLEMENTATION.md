# Smooth Schedule - API Implementation Guide

This document outlines the API requirements to connect the Smooth Schedule React frontend with a Django (DRF) backend.

## 1. Architecture & Authentication

### Multi-Tenancy Strategy
The application uses **Strict Subdomain Multi-Tenancy**.
*   **Tenant Identification:** The backend middleware must resolve the tenant based on the `Origin` header or the subdomain in the request URL.
*   **Header:** Recommended to send a custom header `X-Tenant-Subdomain` from the frontend for explicit context, or rely on Host header parsing in Django.
*   **Isolation:** All data queries (Appointments, Customers, etc.) must be automatically filtered by the resolved Tenant in the Django Manager/QuerySet.

### Authentication (JWT)
*   **Standard Auth:** `POST /api/v1/auth/login/`
    *   Input: `email`, `password`, `subdomain` (context).
    *   Output: `access_token`, `refresh_token`, `user_profile`.
*   **Masquerading (Superuser/Owner feature):** `POST /api/v1/auth/masquerade/`
    *   Permission: Restricted to Superusers (global) or Owners (local).
    *   Input: `target_user_id`.
    *   Output: A short-lived JWT scoped to the target user.

## 2. Core API Endpoints

### A. Context & User Bootstrap
*   `GET /api/v1/me/`
    *   Returns the current user's profile, role, and permissions.
*   `GET /api/v1/tenant/config/`
    *   Returns the public configuration for the current subdomain (Brand colors, Name, Logo, Plan status).
    *   *Note:* This endpoint must be public (allowAny) to load the login page branding.

### B. Scheduler & Appointments
*   `GET /api/v1/appointments/`
    *   **Filters:** `start_date`, `end_date`, `resource_id` (optional), `status` (optional).
    *   **Optimization:** Should use `select_related` for Customers and Services to avoid N+1 issues.
*   `POST /api/v1/appointments/`
    *   Create a new appointment. Backend must validate resource availability.
*   `PATCH /api/v1/appointments/{id}/`
    *   Handle resizing (duration change) and dragging (start time change).
    *   **Logic:** Trigger email notifications on reschedule.
*   `GET /api/v1/blockers/`
    *   Fetch time-off blocks.
*   `POST /api/v1/blockers/`
    *   Create time-off.

### C. Booking Flow (Customer Facing)
*   `GET /api/v1/services/`
    *   List public services with prices and descriptions.
*   `GET /api/v1/booking/availability/`
    *   **Critical Endpoint:** Moves availability logic to the backend.
    *   Input: `service_id`, `date`, `timezone`.
    *   Output: Array of available start times (e.g., `['09:00', '09:30', ...]`).
    *   **Logic:** Must calculate based on Resource schedules, existing Appointments, and Blockers.

### D. Resources & Staff
*   `GET /api/v1/resources/`
    *   List all bookable entities (Staff, Rooms, Equipment).
*   `POST /api/v1/resources/`
    *   Create new resource.

### E. Customers
*   `GET /api/v1/customers/`
    *   Support server-side pagination and fuzzy search (`?search=Alice`).
*   `POST /api/v1/customers/`
    *   Create profile.

### F. Settings & Billing
*   `PATCH /api/v1/business/settings/`
    *   Update branding, cancellation policies, etc.
*   `GET /api/v1/billing/invoices/`
    *   Fetch Stripe invoice history.
*   `POST /api/v1/billing/payment-methods/`
    *   Tokenize card via Stripe and save reference.

## 3. Platform Admin Endpoints
*   `GET /api/v1/platform/businesses/`
    *   List all tenants (Superuser only).
*   `GET /api/v1/platform/metrics/`
    *   Aggregate MRR, Churn, Active Users.
*   `POST /api/v1/platform/masquerade-token/`
    *   Generate a login link/token for a specific tenant owner.

## 4. Data Models (Django Recommendations)

### Users
*   Extend `AbstractUser`.
*   Add `role` (ChoiceField).
*   Add `business` (ForeignKey to `Business`). Nullable for Platform Staff.

### Business (Tenant)
*   Fields: `subdomain` (Unique, Index), `name`, `configuration` (JSONField for branding), `settings` (JSONField for policies).

### Appointment
*   Fields: `tenant` (FK), `resource` (FK), `customer` (FK), `service` (FK), `start_time`, `end_time`, `status`.

## 5. Frontend State Management
*   **Current State:** Uses `React Context` + `useState`.
*   **Recommended Upgrade:** Use **TanStack Query (React Query)** for server state management.
    *   It handles caching, loading states, and refetching out of the box.
    *   It is ideal for the Scheduler grid which needs frequent updates.
