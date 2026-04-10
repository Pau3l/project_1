# Dashboard Status Cards Interactive Plan

My apologies! I understand now that you mean the global system status cards on the primary dashboard view (the boxes defining `Pending`, `Processing`, `Completed`, etc.).

Currently, these exist within `<StatusAnalytics />` but aren't hooked up to alter the global application state. We can turn these cards into **interactive toggle filters** for your Payment Table!

## Proposed Approach
1. **State Addition**: Add an `activeStatusFilter` state in `App.tsx` alongside the standard search query.
2. **Card Interaction**: Modify the `<StatusAnalytics />` cards to accept an `onClick` parameter. When a user clicks a status box (e.g. `Completed`):
   - The card gets a distinct highlighted focus ring indicating it is "active".
   - It filters the entire `PaymentTable` below to display *only* records matching that designated status.
   - Clicking it a second time will act as a toggle-off, returning the table back to all data.
3. **Compound Filtering**: We will update the `filteredPayments` derivation in `App.tsx` so that it supports both text search typing AND active status toggling simultaneously (e.g., searching "Alex" while the `Pending` status card is toggled on will yield only Pending payments from Alex).

## User Review Required

> [!IMPORTANT]
> Is applying this filter-toggle behavior exactly what you had in mind for making the cards functional? If you approve, I will begin execution and connect the status layout directly down into the underlying payment data grid!
