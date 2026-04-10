# Interactive Dashboard Target Status Cards

I've successfully converted all of the dashboard's status indicator cards (`Pending`, `Processing`, `Completed`, etc.) into completely functional filter toggles for the data grid!

## Key Upgrades
1. **Interactive UI**: Wrapping the status boxes within semantic `<button>` elements that trigger on click.
2. **Visual Feedback**: The currently "active" filter card receives a scale lock (`scale-[1.03]`), a prominent floating drop shadow, and an intense orange ring glow (`ring-2 ring-[#ff4d00]/50`) to visually separate it from unselected cards.
3. **Compound Data Management**: Added an invisible logical layer (`activeStatusFilter`) intersecting perfectly with the existing text search queries.

![Functionality Demo - Clicking the Completed card filters the table purely to Completed items]

## Usage
Simply hover and click any status card in the overview section. The `PaymentTable` immediately shrinks to show only the relative entries that correspond to that status. Click the highlighted card again to release the filter and instantly view all payments!
