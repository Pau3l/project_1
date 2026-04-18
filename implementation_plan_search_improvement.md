# Search Bar & Header Experience Upgrade

This plan outlines the refactoring and aesthetic enhancement of the search bar in the main view. We will move the inline header logic from `App.tsx` into a unified `Header` component with premium "Glassmorphism" styling and enhanced functionality.

## Proposed Changes

### [Header Component](file:///c:/Users/HP/Downloads/PT/src/app/components/header.tsx)

#### [MODIFY] [header.tsx](file:///c:/Users/HP/Downloads/PT/src/app/components/header.tsx)
- **Styling**: Implement a premium "Glassmorphism" input with:
    - `backdrop-blur` and subtle radial gradients.
    - Animated border glow on focus (using WonderPay orange `#ff4d00`).
    - Smooth transitions for icons and counts.
- **Search History**:
    - Add a "Recent Searches" dropdown that appears when focusing an empty input.
    - Pass `searchHistory` and a selection handler from `App.tsx`.
- **Keyboard Shortcut**: Improve the visibility of the `Ctrl+K` hint.
- **Result Count**: Animate the count change and color-code (red for zero results).
- **Quick Suggestions**: Add small horizontal scrollable "suggestion chips" for common status filters (e.g., "Completed", "Pending") that appear when searching.

### [Main Application](file:///c:/Users/HP/Downloads/PT/src/app/App.tsx)

#### [MODIFY] [App.tsx](file:///c:/Users/HP/Downloads/PT/src/app/App.tsx)
- **Unify Header**: Replace the inline header logic (lines 744-788) with the componentized `<Header />`.
- **Prop Injection**: Pass all necessary states and counts to the new component.
- **Cleanup**: Remove local `searchInputRef` and redundant JSX logic now encapsulated in the `Header`.

## Open Questions

- Should we include a "Clear History" button in the Recent Searches dropdown?
- Would you like the search to be "fuzzy" (handling small typos) or stay as a direct string match?

## Verification Plan

### Manual Verification
1.  **Aesthetics**: Verify the glassmorphism and animated focus states look premium.
2.  **Search History**: Focus the search bar when empty and select a previous query.
3.  **Keyboard**: Press `Ctrl+K` to confirm focus behavior.
4.  **Count**: Perform a search and verify the `X/Total` count updates correctly (and turns red for 0 results).
5.  **Suggestions**: Click a suggestion chip and verify it updates the search query.
