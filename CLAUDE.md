# Smooth Schedule - Developer & Style Guide

## 1. Technology Stack

*   **Framework:** React 18+ (Functional Components + Hooks)
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS (Utility-first, Dark Mode support via `class` strategy)
*   **Routing:** React Router DOM v6
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **State Management:** React Context (Current) -> React Query (Target)

## 2. Bidirectional Synchronization Strategy

We use a **"Contract-First"** approach to keep the Frontend (React) and Backend (Django) in sync.

### The Contract: `src/api-schema.ts`
This file contains the TypeScript interfaces that define the shape of the data sent to and received from the API. It is the **Source of Truth**.

### Scenario A: Frontend-Driven Change (Forward Sync)
*Trigger:* You need a new field in the UI (e.g., `Appointment.customerNotes`).

1.  **Update** `src/api-schema.ts` with the new field.
2.  **Update** `src/mockData.ts` to include test data.
3.  **Implement** the feature in React components.
4.  **Handoff Prompt:**
    > "I have updated `src/api-schema.ts` to include a new field `customerNotes`. Please generate the corresponding Django Model and Serializer updates for the backend to match this contract."

### Scenario B: Backend-Driven Change (Backward Sync)
*Trigger:* The backend API response structure has changed.

1.  **Paste** the new JSON response or Django Serializer code into the chat.
2.  **Handoff Prompt:**
    > "Here is the new backend structure. Please update `src/api-schema.ts` to reflect these changes and refactor any React components that rely on the old structure."

## 3. Architecture & Patterns

### Strict Subdomain Multi-Tenancy
*   **`platform`**: Admin console.
*   **`www` / (root)**: Public marketing page.
*   **`[slug]`**: Tenant-specific portal.
*   **Development:** We use `simulatedSubdomain` in `App.tsx` to emulate this behavior.

### Directory Structure
*   `api-schema.ts`: **The Contract**. Pure data interfaces.
*   `types.ts`: UI-specific types + re-exports from `api-schema.ts`.
*   `mockData.ts`: Seed data matching `api-schema.ts`.

## 4. API Integration Guide
Refer to **`IMPLEMENTATION.md`** for specific endpoint requirements. All components fetching data should eventually use **React Query**.
