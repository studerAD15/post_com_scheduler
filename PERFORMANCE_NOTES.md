# Performance & Memoization Architecture Notes

## Overview
This document summarizes the comprehensive performance optimization pass performed on the Omnitrix Post Manager & Scheduler application.

---

## Key Optimization Pillars

### 1. Component Render Boundaries (`React.memo`)
All feature views, modals, layouts, overlay elements, and list item sub-components are wrapped in `React.memo` to prevent re-renders when parent state updates do not alter their incoming props:

- **List Item Components**:
  - `PostCardItem` (in `PostList.tsx`): Ensures individual post cards do not re-render when sibling posts are modified or deleted.
  - `DraftCardItem` (in `DraftList.tsx`): Prevents re-rendering all draft cards when toggling audit trails or deleting a single draft.
  - `ScheduledPostItem` (in `ScheduleCalendar.tsx`): Isolates timeline items.
  - `PlatformTelemetryCard` (in `AnalyticsOverview.tsx`): Isolates individual channel cards.
  - `ActivityLogRow` (in `ActivityLogView.tsx`): Prevents re-rendering historical audit log items.
- **Top-Level Feature Components**:
  - `PostList`, `DraftList`, `ScheduleCalendar`, `AnalyticsOverview`, `ActivityLogView`, `PostComposer`, `ScheduleModal`, `LivePlatformPreviews`, `MainLayout`, `RoleSwitcherBar`, `LoginForm`, `OmnitrixOverlay`.

### 2. Callback Reference Stability (`useCallback`)
Every event handler passed as a prop to a `React.memo` wrapped child or referenced in a `useEffect` dependency array is memoized using `useCallback` with exhaustive dependencies.
- Prevents breaking child component memoization boundaries caused by inline function allocations on every parent render.

### 3. Derived State & Heavy Computations (`useMemo` & Reselect)
- **Reselect Selectors**:
  - `postsSelectors.ts`: Extends `selectFilteredPostsByPlatform`, `selectPostsByStatus`, `selectUpcomingScheduledPosts`, `selectPostMetrics`, `selectPostingFrequencyOverTime`.
  - `draftsSelectors.ts` (**NEW**): Introduces `selectAllDraftUserIds`, `selectFilteredDraftsByUserId`, `selectTotalDraftRevisionsCount`, and `selectActiveDraft`.
  - `activitySelectors.ts` (**NEW**): Introduces `selectUserActionStats` and `selectFilteredActivities` for search, user, action, and target ID filtering.
- **Local Render Computations (`useMemo`)**:
  - `AnalyticsOverview.tsx`: Memoized `sortedPlatforms`, `donut` SVG slice angles, and `maxFreqCount`.
  - `DraftList.tsx`: Memoized user audit IDs and filtering.
  - `PostComposer.tsx`: Preserves existing `useMemo` for `validationResults`, `isOverallValid`, and `hasOverLimitError`.

### 4. Redux Selector Fine-Graining
- All `useAppSelector` hooks now target minimal state properties rather than destructuring entire slice objects.
- Inline selector array mappings/filters (which return fresh object/array references every call) have been replaced with memoized `createSelector` definitions.

---

## Guidelines for Future Maintainers
1. **Adding Handlers**: Always wrap functions passed down to child components in `useCallback`.
2. **Derived Arrays**: Avoid performing `.filter()` or `.map()` directly inside render bodies for large lists—use `useMemo` or add a `createSelector` in the relevant `*Selectors.ts` file.
3. **List Rendering**: Retain stable entity IDs as keys (never array indices).
