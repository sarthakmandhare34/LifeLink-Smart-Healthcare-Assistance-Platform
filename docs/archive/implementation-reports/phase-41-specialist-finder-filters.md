# Phase 41 — Specialist Finder Filters and Recovery

## Implementation

The Specialist Finder now keeps its existing specialty search, Mumbai corridor, and station filters while adding an explicit **Sort results** control. Users can choose Recommended, Name A–Z, Specialty A–Z, or Station A–Z. Recommended order preserves the controlled directory order and uses the existing browser-only proximity ordering when the user has voluntarily shared location. All other sorting is deterministic and client-side; no directory scope or external provider data was added.

The filter group also includes a **Clear filters** action with an active-filter count. Empty results now provide a direct reset action. If either the directory or facet query fails, the page shows a plain-language explanation, avoids exposing technical error details, and offers a retry button that refetches both data sources. Loading now has an accessible status message and a restrained progress icon.

## Visual validation

At desktop width, the refine-results toolbar sits beneath the three existing location filters, with the sort selector and reset action aligned in the same glass surface. At 390 px mobile width, the toolbar’s controls stack vertically and remain full-width and touch-friendly. The existing mock-directory notice and privacy copy remain visible, while the controlled-directory boundary is unchanged.

## Verification

Type checking, the full Vitest suite, and the production build passed. Focused tests cover sort labels, deterministic ordering without mutating source data, the recommended-order path, and friendly non-technical load-error messaging. The Specialist Finder was rendered at desktop and mobile widths after the changes.
