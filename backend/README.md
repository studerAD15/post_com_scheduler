# Post Composer & Scheduler — Spring Boot Backend

Production-grade Spring Boot 3 backend service with Spring Security (JWT), Role-Based Access Control (RBAC), JPA / Hibernate, and H2 database persistence.

---

## 🚀 Quick Start

### Prerequisites
- **Java**: JDK 17+ (Eclipse Temurin 17 recommended)
- **Maven**: Maven Wrapper (`mvnw` / `mvnw.cmd`) is included in this directory.

### Running in Development (Port 8080)
```bash
# Using Maven Wrapper on Windows
mvnw.cmd spring-boot:run

# Using Maven Wrapper on macOS / Linux
./mvnw spring-boot:run
```

Or run the packaged jar directly:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## 🗄 In-Memory Database & H2 Console

- **Default Port**: `8080`
- **H2 Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: `password`

---

## 🔑 Demo Login Credentials

The database is pre-seeded with 3 demo accounts on startup:

| Username | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `password123` | **ADMIN** | Full system access (`create_post`, `edit_post`, `delete_post`, `schedule_post`, `publish_post`, `manage_drafts`, `view_analytics`, `manage_users`, `view_draft_audit`, `view_activity_log`) |
| `editor` | `password123` | **EDITOR** | Content authoring (`create_post`, `edit_post`, `schedule_post`, `publish_post`, `manage_drafts`, `view_analytics`). *No post deletion or user administration.* |
| `viewer` | `password123` | **VIEWER** | Read-only access (`view_analytics`). All mutation and delete actions blocked with `403 Forbidden`. |

---

## 📡 API Endpoints Overview

Every endpoint returns the standard `ApiResponse<T>` envelope:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "2026-09-11T16:30:00"
}
```

### Authentication & Users (`/api/auth`)
- `POST /api/auth/login` — Public. Accepts `{ username, password }`, returns `{ token, user }` signed with HS256 JWT.
- `GET /api/auth/me` — Authenticated (`Bearer <token>`). Returns current user profile.

### Posts (`/api/posts`)
- `GET /api/posts` — View all posts (Admin, Editor, Viewer).
- `GET /api/posts/{id}` — Get single post.
- `POST /api/posts` — Create new post (`create_post`: Admin, Editor).
- `PUT /api/posts/{id}` — Update post (`edit_post`: Admin, Editor).
- `PATCH /api/posts/{id}/schedule` — Schedule post (`schedule_post`: Admin, Editor). Body: `{ "scheduledAt": "ISO-8601" }`.
- `PATCH /api/posts/{id}/publish` — Publish post immediately (`publish_post`: Admin, Editor).
- `DELETE /api/posts/{id}` — Delete post (`delete_post`: **Admin only**).

### Drafts (`/api/drafts`)
- `GET /api/drafts` — View all drafts with audit trail (`manage_drafts`: Admin, Editor).
- `GET /api/drafts/{id}` — Get single draft with audit history.
- `POST /api/drafts` — Create draft (automatically logs a `created` audit trail entry).
- `PUT /api/drafts/{id}` — Update draft (automatically logs an `updated` audit trail entry with changes summary).
- `DELETE /api/drafts/{id}` — Delete draft.

### System Activity Log (`/api/activity`)
- `GET /api/activity` — Retrieve system-wide activity log (`view_activity_log`: **Admin only**).
  - Automatically populated whenever posts or drafts are created, edited, scheduled, published, or deleted.

### Health Check
- `GET /api/health` — Public health probe.

---

## 🛡 Verification Examples (curl)

### 1. Authenticate as Admin
```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### 2. Fetch Posts
```bash
curl -s http://localhost:8080/api/posts \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 3. Verify RBAC Delete Blocking (Viewer)
```bash
# Returns 403 Forbidden
curl -s -X DELETE http://localhost:8080/api/posts/post-1 \
  -H "Authorization: Bearer <VIEWER_TOKEN>"
```

### 4. View System Activity Log (Admin)
```bash
curl -s http://localhost:8080/api/activity \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 🐳 Docker Deployment
```bash
docker build -t post-scheduler-backend .
docker run -p 8080:8080 post-scheduler-backend
```
