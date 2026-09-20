# Multi-Platform Post Composer & Scheduler — Omnitrix Edition

A production-grade, full-stack enterprise web application built with **Spring Boot 3 (Java 17)** and **React 19 + TypeScript + Redux Toolkit + Tailwind CSS**.

This project provides social media managers and enterprise marketing teams with real-time multi-platform post composition, live character & media validation, drag-and-drop scheduling, and strict server-enforced Role-Based Access Control (RBAC).

---

## 🏛 Full-Stack Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                              REACT 19 FRONTEND                                    |
|                                                                                   |
|  [ User UI Interaction ] ---> [ Redux Toolkit Thunks ] ---> [ Typed apiClient.ts ]|
|  (Composer / Feed /           (addPostThunk,                (Injects Bearer JWT,  |
|   Calendar / Analytics)        loginThunk, etc.)             Handles Timeouts)    |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTP / REST (JSON) + Bearer JWT Header
                                         v
+-----------------------------------------------------------------------------------+
|                           SPRING BOOT 3 BACKEND                                   |
|                                                                                   |
|  [ CorrelationIdFilter ] ---> Stamps request with X-Correlation-ID tracing ID     |
|             |                                                                     |
|             v                                                                     |
|      [ JwtAuthFilter ]    ---> Validates HMAC-SHA256 JWT, loads User & GrantedAuthorities|
|             |                                                                     |
|             v                                                                     |
|  [ SecurityConfig (RBAC) ]-> Enforces method security (@PreAuthorize) or 403     |
|             |                                                                     |
|             v                                                                     |
|   [ REST Controllers ]   ---> PostController, DraftController, AuthController     |
|             |                                                                     |
|             v                                                                     |
|    [ Service Layer ]     ---> Business validation, scheduling logic, state transitions|
|             |                                                                     |
|             v                                                                     |
|  [ Spring Data JPA / H2 ] -> Data persistence in relational database              |
+-----------------------------------------------------------------------------------+
```

---

## 📍 Where Are the API Endpoints in the Code?

If someone asks where the API endpoints are defined in code, here are the exact files:

### 1. Backend REST Controllers
Located in: `backend/src/main/java/com/postscheduler/backend/controller/`

| Controller File | Base Path | Endpoints & Methods | Purpose |
| :--- | :--- | :--- | :--- |
| [`PostController.java`](backend/src/main/java/com/postscheduler/backend/controller/PostController.java) | `/api/posts` | • `POST /api/posts`<br>• `GET /api/posts`<br>• `GET /api/posts/{id}`<br>• `PUT /api/posts/{id}`<br>• `PATCH /api/posts/{id}/schedule`<br>• `PATCH /api/posts/{id}/publish`<br>• `DELETE /api/posts/{id}` | Complete lifecycle for published and scheduled posts. |
| [`DraftController.java`](backend/src/main/java/com/postscheduler/backend/controller/DraftController.java) | `/api/drafts` | • `POST /api/drafts`<br>• `GET /api/drafts`<br>• `GET /api/drafts/{id}`<br>• `PUT /api/drafts/{id}`<br>• `DELETE /api/drafts/{id}` | Managing saved work-in-progress drafts and audit revision history. |
| [`AuthController.java`](backend/src/main/java/com/postscheduler/backend/controller/AuthController.java) | `/api/auth` | • `POST /api/auth/login`<br>• `GET /api/auth/me` | User login, JWT token issuance, and current session inspection. |
| [`ActivityLogController.java`](backend/src/main/java/com/postscheduler/backend/controller/ActivityLogController.java) | `/api/activity` | • `GET /api/activity` | System-wide security audit log (Admin only). |
| [`HealthController.java`](backend/src/main/java/com/postscheduler/backend/controller/HealthController.java) | `/api/health` | • `GET /api/health` | Public service health check. |

### 2. Frontend API Client & Request Dispatchers
* **Central HTTP Client**: [`src/api/apiClient.ts`](src/api/apiClient.ts) — Configured with `API_BASE_URL = "http://localhost:8080/api"`, auto-injects JWT tokens into headers, handles retries and typed `ApiError` responses.
* **Redux Slices Dispatching Calls**:
  * [`src/features/auth/authSlice.ts`](src/features/auth/authSlice.ts) — calls `/api/auth/login` and `/api/auth/me`.
  * [`src/features/posts/postsSlice.ts`](src/features/posts/postsSlice.ts) — calls `/api/posts`.
  * [`src/features/drafts/draftsSlice.ts`](src/features/drafts/draftsSlice.ts) — calls `/api/drafts`.
  * [`src/features/activity/activitySlice.ts`](src/features/activity/activitySlice.ts) — calls `/api/activity`.

---

## 🛡 Role-Based Access Control (RBAC) Matrix

Permissions are enforced both **server-side** (via Spring Security method security annotations) and **client-side** (via Redux and the `usePermission` hook):

| Endpoint / Action | ADMIN | EDITOR | VIEWER | Unauthenticated |
| :--- | :---: | :---: | :---: | :---: |
| **Health Check** (`GET /api/health`) | 200 OK | 200 OK | 200 OK | 200 OK (Public) |
| **Login** (`POST /api/auth/login`) | 200 OK | 200 OK | 200 OK | 200 OK (Public) |
| **Inspect Profile** (`GET /api/auth/me`) | 200 OK | 200 OK | 200 OK | 401 Unauthorized |
| **View Posts** (`GET /api/posts`) | 200 OK | 200 OK | 200 OK | 401 Unauthorized |
| **Create Post** (`POST /api/posts`) | **403 Forbidden** | 201 Created | **403 Forbidden** | 401 Unauthorized |
| **Update Post** (`PUT /api/posts/{id}`) | **403 Forbidden** | 200 OK | **403 Forbidden** | 401 Unauthorized |
| **Schedule Post** (`PATCH /api/posts/{id}/schedule`) | **403 Forbidden** | 200 OK | **403 Forbidden** | 401 Unauthorized |
| **Publish Post** (`PATCH /api/posts/{id}/publish`) | **403 Forbidden** | 200 OK | **403 Forbidden** | 401 Unauthorized |
| **Delete Post** (`DELETE /api/posts/{id}`) | **403 Forbidden** | 200 OK | **403 Forbidden** | 401 Unauthorized |
| **View Drafts** (`GET /api/drafts`) | 200 OK | 200 OK | 200 OK | 401 Unauthorized |
| **Manage Drafts** (`POST/PUT/DELETE /api/drafts`) | 200 OK | 200 OK | **403 Forbidden** | 401 Unauthorized |
| **View Activity Audit Log** (`GET /api/activity`) | 200 OK | **403 Forbidden** | **403 Forbidden** | 401 Unauthorized |

### Role Definitions:
- **`ADMIN` (Security, Governance & Audit)**:
  - Exclusive access to the system Activity Log (`GET /api/activity`).
  - Access to draft revision audit trails (`view_draft_audit`) and analytics telemetry.
  - **Explicitly blocked from creating, editing, scheduling, publishing, or deleting posts.**
- **`EDITOR` (Content Creator & Publisher)**:
  - Exclusive role responsible for composing, editing, scheduling, publishing, and deleting posts.
  - Can create and manage drafts.
- **`VIEWER` (Read-Only Observer)**:
  - Can view published posts, saved drafts, and read-only telemetry analytics.
  - All modifying buttons and composer views are disabled or hidden.

---

## 📂 Project Directory Structure

```
post_com_scheduler/
├── backend/                                   # Spring Boot 3 Java Backend
│   ├── src/main/java/com/postscheduler/backend/
│   │   ├── Application.java                   # Main Spring Boot entry point & data seeder
│   │   ├── config/
│   │   │   ├── SecurityConfig.java            # Spring Security filter chain, CORS & 401/403 handlers
│   │   │   └── CorsConfig.java                # Cross-Origin Resource Sharing configuration
│   │   ├── controller/                        # REST Controllers exposing HTTP endpoints
│   │   │   ├── PostController.java            # /api/posts endpoints (@PreAuthorize)
│   │   │   ├── DraftController.java           # /api/drafts endpoints
│   │   │   ├── AuthController.java            # /api/auth endpoints
│   │   │   ├── ActivityLogController.java     # /api/activity endpoints (Admin only)
│   │   │   └── HealthController.java          # /api/health endpoint
│   │   ├── filter/
│   │   │   ├── JwtAuthFilter.java             # Intercepts requests, validates JWT, sets user authorities
│   │   │   └── CorrelationIdFilter.java       # Distributed tracing via X-Correlation-ID
│   │   ├── service/                           # Business logic layer
│   │   │   ├── PostService.java               # Post lifecycle & validation logic
│   │   │   ├── DraftService.java              # Draft auto-save and audit tracking
│   │   │   ├── AuthService.java               # BCrypt password checking & JWT issuance
│   │   │   ├── JwtService.java                # HMAC-SHA256 token generation & validation
│   │   │   └── ActivityLogService.java        # Security audit log management
│   │   ├── repository/                        # Spring Data JPA database interfaces
│   │   ├── model/                             # JPA relational entity classes (Post, Draft, User, etc.)
│   │   ├── dto/                               # Data Transfer Objects & ApiResponse<T> envelope
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java    # Centralized @RestControllerAdvice error handler
│   │       └── ResourceNotFoundException.java # Typed 404 exception
│   └── src/test/java/                         # 32 Automated MockMvc Integration Tests
│
├── src/                                       # React 19 + TypeScript Frontend
│   ├── main.tsx                               # React root mount & Redux Provider
│   ├── App.tsx                                # Root screen switcher & active tab router
│   ├── app/
│   │   ├── store.ts                           # Central Redux store configuration & root types
│   │   └── hooks.ts                           # Typed useAppDispatch and useAppSelector hooks
│   ├── api/
│   │   ├── apiClient.ts                       # Typed HTTP client, JWT header interceptor, retry logic
│   │   ├── mockPostsApi.ts                    # Post storage & client persistence
│   │   └── mockDraftsApi.ts                   # Draft storage & client persistence
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts                   # Authentication state machine & login thunk
│   │   │   ├── usePermission.ts               # Custom RBAC hook & PERMISSION_MATRIX
│   │   │   └── LoginForm.tsx                  # Omnitrix-themed credential login modal
│   │   ├── posts/
│   │   │   ├── postsSlice.ts                  # Normalized post entity state with createEntityAdapter
│   │   │   ├── postsSelectors.ts              # Reselect memoized selectors for filtering & metrics
│   │   │   ├── PostComposer.tsx               # Multi-platform composer with character counters
│   │   │   ├── PostList.tsx                   # Post cards feed with status indicators
│   │   │   └── FeedSidebar.tsx                # Telemetry counters & upcoming queue snippet
│   │   ├── drafts/
│   │   │   ├── draftsSlice.ts                 # Draft state management & audit history
│   │   │   └── DraftList.tsx                  # Saved drafts grid with user revision audit trail
│   │   ├── schedule/
│   │   │   ├── CalendarView.tsx               # Drag-and-drop interactive month/week calendar
│   │   │   └── ScheduleModal.tsx              # Date-time picker modal for scheduling posts
│   │   └── activity/
│   │       ├── activitySlice.ts               # Activity audit trail state
│   │       └── ActivityLogView.tsx            # Administrative audit dashboard
│   ├── components/layout/
│   │   ├── MainLayout.tsx                     # Header, navigation tabs, storage indicator, SFX toggle
│   │   └── RoleSwitcherBar.tsx                # Active session badge and Sign Out button
│   └── utils/
│       ├── validationEngine.ts                # Character limit & media validation per platform
│       └── storage.ts                         # Type-safe localStorage wrapper
│
└── scripts/
    └── verify_e2e.mjs                         # Automated live HTTP endpoint test suite
```

---

## 🚀 How to Run the Project

### 1. Start the Spring Boot Backend (Port 8080)
```powershell
# From the backend directory
cd backend
.\mvnw.cmd spring-boot:run

# Or run tests:
.\mvnw.cmd test
```

### 2. Start the React Frontend (Port 5173)
```powershell
# From the project root
npm install
npm run dev

# Or build for production:
npm run build
```

### 3. Run Automated Live API Verification
```powershell
# While the backend is running, verify all endpoints over live HTTP:
npm run test:api
```

---

## 🔑 Demo Login Accounts (Password: `password123`)

| Username | Role | Primary Responsibility |
| :--- | :--- | :--- |
| `editor` | **Editor** | Post creation, editing, scheduling, publishing, and deleting. |
| `admin` | **Admin** | Security oversight, user governance, Activity Log audit trail. *(Post creation/mutations disabled)*. |
| `viewer` | **Viewer** | Read-only access to published posts, saved drafts, and telemetry boards. |

---

## 🤖 AI Assistant & Custom Fonts ("Tempting" + "Switzer")

### 1. Typography Setup
The application self-hosts its typography inside `public/fonts/` with `@font-face` declarations in [`src/global.css`](src/global.css) using `font-display: swap`:
* **Switzer** (`font-switzer`): Modern neo-grotesque sans-serif (Fontshare) with weights 400, 500, 600, and 700 located at `public/fonts/switzer/`. Used for body text, prompt responses, and messages within the assistant widget.
* **Tempting** (`font-tempting`): Stylized script/cursive font located at `public/fonts/tempting/`. Configured in [`tailwind.config.js`](tailwind.config.js) and [`index.html`](index.html). Used for the stylized "OmniAssistant" heading inside the widget.
* **Scope Isolation**: These custom fonts are applied strictly inside the AI Assistant component tree (`font-switzer`, `font-tempting`) and do not alter existing application fonts (`font-rajdhani`, `font-space`, `font-mono`).

### 2. Omnitrix AI Assistant Widget
A non-blocking floating assistant widget is located at the bottom-right corner of the application:
* **Floating Launcher**: Styled with the app's signature `#0A0A0A` dark background, `#3DDC10` hazard border, and animated pulse ring.
* **10 Original Alien Avatars**: 10 original vector alien-transformation avatars (not copyrighted characters):
  1. **Ignis-Pyros** (`ignis`): Elemental Fire / Magma hero.
  2. **Velo-Sprint** (`velo`): Hyper-Kinetic Insectoid speedster.
  3. **Crystalo-Shard** (`crystalo`): Prismatic Geological crystal warrior.
  4. **Tide-Abyss** (`tide`): Hydro-Aquatic apex predator.
  5. **Flora-Viper** (`flora`): Bio-Thorn botanical titan.
  6. **Volt-Surge** (`volt`): Plasma dynamo / electric hero.
  7. **Umbra-Wraith** (`umbra`): Dark-matter stealth phase ghost.
  8. **Titan-Crush** (`titan`): Quad-arm heavy kinetic behemoth.
  9. **Aero-Talon** (`aero`): Sonic avian raptor.
  10. **Cosmo-Mind** (`cosmo`): Astral telepathic cosmic entity.
* **Avatar Picker Modal**: Clicking the avatar badge opens a responsive grid allowing users to immediately switch the assistant's active alien form. The selection is saved to `localStorage` under `omni_assistant_avatar` and persists across sessions.
* **Contextual Domain Intelligence**:
  * Real-time role awareness (`admin`, `editor`, `viewer`, `guest`).
  * Instant answers for platform character limits (Twitter: 280, LinkedIn: 3000, Instagram: 2200, Facebook: 63206).
  * Guidance on draft auto-saving, calendar drag-and-drop, and scheduled post publishing.
  * Role-based guardrail alerts (e.g., reminding Admins that post creation is restricted to Editors).

### 3. Connecting a Real LLM Backend / Proxy
The assistant is designed with an explicit integration point for connecting an external LLM (e.g., OpenAI GPT-4, Anthropic Claude, Google Gemini, or a private company proxy).

To wire an external LLM:
1. Open [`src/features/assistant/assistantService.ts`](src/features/assistant/assistantService.ts).
2. Locate the function `queryExternalLLM(prompt: string, context: AssistantContext)`:
```typescript
export async function queryExternalLLM(
  prompt: string,
  context: AssistantContext
): Promise<{ content: string; suggestions?: string[] }> {
  // Replace the placeholder with a fetch call to your backend LLM proxy:
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      prompt,
      role: context.role,
      user: context.userName,
      postsCount: context.postsCount,
      draftsCount: context.draftsCount,
    }),
  });
  return await response.json();
}
```
3. Set `USE_EXTERNAL_LLM = true` at the top of [`src/features/assistant/assistantService.ts`](src/features/assistant/assistantService.ts). The service will seamlessly route incoming prompts through your external endpoint with automatic fallback to local domain intelligence.

### 4. Adding or Replacing Alien Avatars
To add custom alien avatars or replace existing ones:
1. Place your custom SVG component inside `src/features/assistant/aliens/` (e.g., `CustomAlien.tsx`).
2. Register the component and its metadata in [`src/features/assistant/alienRegistry.ts`](src/features/assistant/alienRegistry.ts) in the `ALIEN_AVATARS` array:
```typescript
{
  id: "my-custom-alien",
  name: "My Alien Name",
  codename: "ORIGIN-CODE",
  element: "Element / Power",
  color: "#3DDC10",
  description: "Description of transformation form",
  Component: MyCustomAlienComponent,
}
```
The avatar selector grid, launcher icon, and message stream will immediately reflect the new avatar.

