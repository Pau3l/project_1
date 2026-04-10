# Add Employee (Personnel Management) Feature

Currently, the WonderPay system uses a hardcoded list of workers in the payment modal. This plan outlines the steps to implement a full-featured Employee management system, allowing users to add, edit, and delete personnel, which will then be available for selection when recording payments.

## User Review Required

> [!IMPORTANT]
> The "Workers" list currently hardcoded in `AddPaymentModal` will be replaced by the dynamic "Employees" list managed in the new section.

> [!NOTE]
> Employee data will be persisted in `localStorage`, similar to how payment records are currently handled.

## Proposed Changes

### Core State & Types

#### [MODIFY] [types.ts](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/types.ts)
- Add `Employee` interface:
  ```typescript
  export interface Employee {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    joinedAt: string;
  }
  ```

#### [MODIFY] [App.tsx](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/App.tsx)
- Add `employees` state initialized from `localStorage` or defaults.
- Implement `handleAddEmployee`, `handleUpdateEmployee`, and `handleDeleteEmployee`.
- Update the main view to switch to an "Employees" tab when selected.

### Navigation

#### [MODIFY] [sidebar.tsx](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/components/sidebar.tsx)
- Add an "Employees" item to the `NAV_ITEMS` array with a `Users` icon.
- Update `activeTab` to support `'employees'`.

### New Components

#### [NEW] [employee-table.tsx](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/components/employee-table.tsx)
- Create a premium, responsive table for displaying employee details.
- Include actions for Edit and Delete.

#### [NEW] [add-employee-modal.tsx](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/components/add-employee-modal.tsx)
- A modal form to capture employee details (Name, Role, Email, etc.).
- Follow the existing "Glassmorphism" and "Radix UI" design patterns used in `AddPaymentModal`.

### Integration

#### [MODIFY] [add-payment-modal.tsx](file:///c:/Users/HP/Downloads/PT/New%20folder%20%282%29/src/app/components/add-payment-modal.tsx)
- Remove `MOCK_WORKERS`.
- Accept `employees: Employee[]` as a prop.
- Update the "Select Personnel" sub-modal to use the dynamic `employees` list.

## Open Questions

- Should we include more fields for employees (e.g., department, status, profile picture)?
- Do you want a "Quick Add" button for employees directly inside the `PaymentModal`?

## Verification Plan

### Automated Tests
- N/A (Manual UI verification)

### Manual Verification
1.  **Sidebar**: Click "Employees" and verify the tab switches correctly.
2.  **Add Employee**: Create a new employee and verify they appear in the table.
3.  **Persist**: Reload the page and ensure the employee is still there.
4.  **Edit/Delete**: Verify employee modification and removal.
5.  **Payment Modal**: Open "New Payment" and verify the newly added employee is available in the selection list.
