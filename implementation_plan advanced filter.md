# Enhancing Advanced Filters

The goal is to expand the advanced filtering capabilities by adding more criteria and ensuring they are actually applied to the payment data.

## User Review Required

> [!IMPORTANT]
> Currently, the Advanced Filter modal settings are NOT applied to the payment list in the dashboard. This plan includes implementing the logic to make these filters functional.

## Proposed Changes

### Components

#### [MODIFY] [advanced-filters-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/advanced-filters-modal.tsx)
- Update `filters` state to include:
    - `statusEnabled`: boolean
    - `status`: string (All Statuses, Pending, etc.)
    - `signatureEnabled`: boolean
    - `signatureStatus`: string (All, Signed, Unsigned)
    - `notesEnabled`: boolean
    - `notesQuery`: string
- Add UI sections for these new filters using the existing design system (cards with icons and enable toggles).
- Icons to use: `Activity` for status, `FileCheck` or `Signature` for signature, `MessageSquare` for notes.

#### [MODIFY] [App.tsx](file:///c:/Users/HP/Downloads/PT/src/app/App.tsx)
- Add a new state `advancedFilters` to store the filter criteria.
- Update `AdvancedFiltersModal` usage to pass this state and a setter.
- Update `filteredPayments` `useMemo` to incorporate all advanced filter criteria:
    - Date range (if enabled)
    - Amount range (if enabled)
    - Personnel (if enabled)
    - Method (if enabled)
    - Status (if enabled)
    - Signature status (if enabled)
    - Notes query (if enabled)

## Open Questions

1. Should the status filter in the modal override the status cards in the dashboard, or should they work together? (Usually, they should sync or one should be the "primary" way to filter). I'll implement them so they combine (AND logic).

## Verification Plan

### Automated Tests
- None (manual verification preferred for UI components).

### Manual Verification
- Open Advanced Filters modal.
- Toggle "Status" and select "Failed". Verify only failed payments show.
- Toggle "Signature" and select "Signed". Verify only payments with signatures show.
- Toggle "Notes" and enter a keyword. Verify only matching payments show.
- Combine multiple filters (e.g., Worker = Alex AND Amount > 1000).
- Click "Reset" and verify all filters are cleared and list returns to normal.
