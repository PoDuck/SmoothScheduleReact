
# Smooth Schedule - Developer & Style Guide

This document outlines the coding standards, architectural patterns, and technology stack for the **Smooth Schedule** multi-tenant SaaS platform.

## 1. Technology Stack

*   **Framework:** React 18+ (Functional Components + Hooks)
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS (Utility-first, Dark Mode support via `class` strategy)
*   **Routing:** React Router DOM v6
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Date Handling:** Native `Date` object (or `date-fns` if complexity increases)
*   **Backend (Target):** Django Rest Framework (See `IMPLEMENTATION.md`)

## 2. Architecture & Patterns

### A. Strict Subdomain Multi-Tenancy
The application relies on a **strict isolation** model based on the URL subdomain.
*   **`platform`**: Admin console for Superusers/Staff.
*   **`www` / (root)**: Public marketing page.
*   **`[slug]`**: Tenant-specific portal (e.g., `acme-auto`).

**Development Note:** Since this runs in a browser-based preview, we use **Simulated Subdomains** in `App.tsx`.
*   *Do not remove* the `simulatedSubdomain` state in `App.tsx`.
*   *Do not remove* the "Dev: Switch Identity" box or "Context Bar" at the bottom of `App.tsx` until production.

### B. Directory Structure
*   `types.ts`: **Single source of truth** for all domain models (User, Business, Appointment). Update this first when changing data structures.
*   `mockData.ts`: Contains all seed data. Must match `types.ts` interfaces strictly.
*   `layouts/`: Contains the specific wrapper shells (`BusinessLayout`, `PlatformLayout`, `CustomerLayout`).
*   `pages/`: Route-specific views.
*   `components/`: Reusable UI elements (Sidebar, TopBar, etc.).

### C. State Management
*   **Global Context:** `App.tsx` manages the global `user` and `business` state.
*   **Context Passing:** Data is passed down via `React-Router`'s `<Outlet context={{...}} />`.
*   **Consumption:** Components consume data using `useOutletContext<ContextType>()`.

## 3. Coding Standards

### TypeScript
*   **No `any`:** Always define interfaces in `types.ts`.
*   **Props:** Define explicit Props interfaces for all components.
*   **Null Safety:** Handle `null` or `undefined` explicitly (e.g., `user?.name`).

### Styling (Tailwind CSS)
*   **Responsive First:** Use `md:`, `lg:` prefixes for desktop layouts. Mobile-first by default.
*   **Dark Mode:** Every component **must** support dark mode.
    *   Example: `bg-white dark:bg-gray-800 text-gray-900 dark:text-white`.
*   **Colors:** Use the `brand-*` palette for primary actions (Blue/Indigo based).
    *   Success: `green-*`
    *   Error/Destructive: `red-*`
    *   Warning: `yellow-*` or `orange-*`

### UI/UX Patterns
*   **Masquerading:** Always ensure the `MasqueradeBanner` is visible if `masqueradeStack.length > 1`.
*   **Buttons:** Standardize on rounded, medium-weight buttons with hover transitions.
*   **Forms:** Use controlled inputs with local state.

## 4. Development vs. Production

### Development Environment
*   **Mock Data:** The app runs entirely on `mockData.ts`.
*   **Auth:** "Login" is simulated by swapping the `effectiveUser` state object.
*   **Routing:** Handled manually in `App.tsx` via `simulatedSubdomain`.

### Production Requirements
1.  **API Integration:** Replace `useState` data fetching with API calls (React Query recommended).
2.  **Authentication:** Replace the mock login with JWT handling (HttpOnly cookies or LocalStorage).
3.  **DNS:** Configure wildcard DNS (`*.smoothschedule.com`) to point to the React app.
4.  **Environment Variables:**
    *   `VITE_API_URL`: URL of the Django Backend.
    *   `VITE_STRIPE_KEY`: Public Stripe key.

## 5. API Integration Guide
Refer to **`IMPLEMENTATION.md`** for specific endpoint requirements.
*   When adding new features, comment the API requirements in the code:
    ```typescript
    // [TODO: API INTEGRATION]
    // GET /api/v1/resource/
    ```

## 6. Common Tasks

**Adding a new User Role:**
1.  Update `UserRole` type in `types.ts`.
2.  Add a mock user in `mockData.ts`.
3.  Update `Sidebar.tsx` to conditionally show/hide links.
4.  Update routing permission checks in `App.tsx`.

**Adding a new Page:**
1.  Create `pages/NewPage.tsx`.
2.  Add route in `App.tsx` nested under the correct Layout.
3.  Add link in `Sidebar.tsx` or `PlatformSidebar.tsx`.
