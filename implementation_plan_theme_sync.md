# Global Theme Synchronization for Modals and Buttons

This plan outlines the steps to overhaul all modal windows and interactive elements to ensure they correctly adapt to both light and dark modes while preserving the application's premium aesthetic.

## User Review Required

> [!IMPORTANT]
> Some hardcoded "glass" values (like `white/[0.08]`) will be replaced with conditional classes based on the `isDark` prop. If the system-wide theme doesn't match the component-level `isDark`, there might be slight discrepancies. I will ensure they are aligned with the state in `App.tsx`.

## Proposed Changes

### [Component] [AddPaymentModal](file:///c:/Users/HP/Downloads/PT/src/app/components/add-payment-modal.tsx)
#### [MODIFY] [add-payment-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/add-payment-modal.tsx)
- Add `isDark` to `PaymentModalProps`.
- Update `Dialog.Content` background and border to be conditional.
- Update nested inputs, labels, and sub-modals (Worker/Status selection) to support light mode.

### [Component] [AdvancedFiltersModal](file:///c:/Users/HP/Downloads/PT/src/app/components/advanced-filters-modal.tsx)
#### [MODIFY] [advanced-filters-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/advanced-filters-modal.tsx)
- Refactor recent design updates to respect the `isDark` prop.
- Ensure borders, backgrounds, and "Reset" buttons use theme-appropriate opacity.

### [Component] Modals Suite
#### [MODIFY] [shortcut-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/shortcut-modal.tsx)
#### [MODIFY] [settings-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/settings-modal.tsx)
#### [MODIFY] [add-employee-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/add-employee-modal.tsx)
#### [MODIFY] [delete-confirmation-modal.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/delete-confirmation-modal.tsx)
- Unify the `radial-gradient` and `backdrop-blur` logic across all modals.
- Fix hardcoded border colors in sub-sections.

### Layout & Page
#### [MODIFY] [App.tsx](file:///c:/Users/HP/Downloads/PT/src/app/App.tsx)
- Pass `isDark` to `AddPaymentModal` instance.
- Ensure the `StatusWorkflowModal` inside `App.tsx` also respects `isDark`.

## Verification Plan

### Manual Verification
- Toggle the theme in the sidebar and verify each modal is legible and aesthetically pleasing in both states.
- Check specific interactive elements:
    - Text inputs (background, text color, focus state).
    - Status badges.
    - Dismiss/Cancel buttons.
    - Checkboxes and toggles.
