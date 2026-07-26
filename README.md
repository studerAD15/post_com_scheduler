# Multi-Platform Post Composer & Scheduler (TypeScript Lab Project)

A production-ready client-side web application built with **React 18, TypeScript (Strict Mode), Redux Toolkit, Reselect, React Router v6, and Tailwind CSS**.

This project implements all 6 lab modules covering real-time multi-platform validation, client-side draft CRUD, normalized entity state with Redux Toolkit, Reselect memoization & render performance tracing, JWT simulated auth, and Role-Based Access Control (RBAC).

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation & Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Typecheck & build production bundle
npm run build
```

The app will be available at `http://127.0.0.1:5173/` or `http://localhost:5173/`.

---

## 🗺 Lab Objective Mapping (Folders & Files)

| Phase / Objective | Description & Architecture | Key Source File Locations |
| :--- | :--- | :--- |
| **Phase 1: Dynamic Post Composer & Generic Validation** | Strict discriminated unions for platforms (`twitter`, `instagram`, `linkedin`, `facebook`). Generic validation engine calculating character count, character percentages, warning states (`safe`, `warning`, `over-limit`), hashtag counts, and MIME type/count media limits. | • [`src/types/platform.ts`](file:///d:/full_stack_two/post_com_scheduler/src/types/platform.ts)<br>• [`src/types/post.ts`](file:///d:/full_stack_two/post_com_scheduler/src/types/post.ts)<br>• [`src/utils/validationEngine.ts`](file:///d:/full_stack_two/post_com_scheduler/src/utils/validationEngine.ts)<br>• [`src/features/posts/PostComposer.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/posts/PostComposer.tsx) |
| **Phase 2: Draft Management & Storage Layer** | Typed `Draft` interface, safe generic `localStorage` utility with runtime type guards, async mock API with artificial latency, draft card grid, edit flow, and delete confirmation modal. | • [`src/types/draft.ts`](file:///d:/full_stack_two/post_com_scheduler/src/types/draft.ts)<br>• [`src/utils/storage.ts`](file:///d:/full_stack_two/post_com_scheduler/src/utils/storage.ts)<br>• [`src/api/mockDraftsApi.ts`](file:///d:/full_stack_two/post_com_scheduler/src/api/mockDraftsApi.ts)<br>• [`src/features/drafts/DraftList.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/drafts/DraftList.tsx) |
| **Phase 3: Redux Toolkit State Management** | Typed Redux store (`RootState`, `AppDispatch`), typed hooks (`useAppDispatch`, `useAppSelector`), `createEntityAdapter<Post>()` normalized entity state, `draftsSlice`, `platformsSlice`, and `createAsyncThunk` thunks. | • [`src/app/store.ts`](file:///d:/full_stack_two/post_com_scheduler/src/app/store.ts)<br>• [`src/app/hooks.ts`](file:///d:/full_stack_two/post_com_scheduler/src/app/hooks.ts)<br>• [`src/features/posts/postsSlice.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/posts/postsSlice.ts)<br>• [`src/features/drafts/draftsSlice.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/drafts/draftsSlice.ts)<br>• [`src/features/platforms/platformSlice.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/platforms/platformSlice.ts) |
| **Phase 4: Memoized Selectors & Performance** | Reselect `createSelector` memoization for platform filtering, status grouping, upcoming scheduled posts, and post metrics. Component memoization with `React.memo` and dev render counter overlay. | • [`src/features/posts/postsSelectors.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/posts/postsSelectors.ts)<br>• [`src/components/debug/RenderCounter.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/components/debug/RenderCounter.tsx)<br>• [`src/features/posts/AnalyticsOverview.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/posts/AnalyticsOverview.tsx) |
| **Phase 5: Simulated JWT Authentication** | Typed `User` & `DecodedToken` types, Base64 JWT generation and decoding helper (`decodeToken<T>`), login form with seeded test credentials, `authSlice`, token storage, and HTTP header interceptor. | • [`src/types/auth.ts`](file:///d:/full_stack_two/post_com_scheduler/src/types/auth.ts)<br>• [`src/utils/jwt.ts`](file:///d:/full_stack_two/post_com_scheduler/src/utils/jwt.ts)<br>• [`src/api/apiClient.ts`](file:///d:/full_stack_two/post_com_scheduler/src/api/apiClient.ts)<br>• [`src/features/auth/authSlice.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/auth/authSlice.ts)<br>• [`src/features/auth/LoginForm.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/auth/LoginForm.tsx) |
| **Phase 6: Role-Based Access Control (RBAC) & Protected Routes** | `Record<Role, Permission[]>` permission matrix, `usePermission` hook, `<ProtectedRoute />`, `<PermissionGuard />`, `/unauthorized` route, 1-click header role switcher, and `<ScheduleModal />` calendar view. | • [`src/features/auth/usePermission.ts`](file:///d:/full_stack_two/post_com_scheduler/src/features/auth/usePermission.ts)<br>• [`src/components/layout/ProtectedRoute.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/components/layout/ProtectedRoute.tsx)<br>• [`src/components/layout/RoleSwitcherBar.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/components/layout/RoleSwitcherBar.tsx)<br>• [`src/components/layout/UnauthorizedView.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/components/layout/UnauthorizedView.tsx)<br>• [`src/features/schedule/ScheduleModal.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/schedule/ScheduleModal.tsx)<br>• [`src/features/schedule/ScheduleCalendar.tsx`](file:///d:/full_stack_two/post_com_scheduler/src/features/schedule/ScheduleCalendar.tsx) |

---

## 🔑 Seeded Demo Accounts (Password: `password123`)

| Username | Role | Permissions |
| :--- | :--- | :--- |
| `admin` | **Admin** | Full system access (`create_post`, `edit_post`, `delete_post`, `schedule_post`, `publish_post`, `manage_drafts`, `view_analytics`, `manage_users`) |
| `editor` | **Editor** | Content & publishing access (`create_post`, `edit_post`, `schedule_post`, `publish_post`, `manage_drafts`, `view_analytics`) |
| `viewer` | **Viewer** | Read-only access (`view_analytics`). Post composition, deletion, and publishing buttons are hidden/disabled automatically. |

---

## 🛡 Type Safety Rules & Best Practices
- **Strict Mode**: `strict: true` enabled in `tsconfig.app.json`.
- **Zero `any` Types**: All state, props, reducers, thunks, API requests, and utility functions use explicit interfaces and generics.
- **Typed Redux Hooks**: `useAppDispatch` and `useAppSelector` imported from `src/app/hooks.ts`.
