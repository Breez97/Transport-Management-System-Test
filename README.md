<p align="center">
  <img src="https://img.icons8.com/fluency/96/truck.png" alt="TMS Logo" width="80" />
</p>

<h1 align="center">Transport Management System</h1>

<p align="center">
  A production-ready, full-stack Transport Management System built with <strong>Spring Boot 3</strong> and <strong>React 18</strong>.<br/>
  Featuring JWT authentication, SSO (Google/Microsoft), role-based authorization, real-time GPS tracking, geofencing, fuel analytics, and Docker-ready deployment.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/WebSocket-STOMP-010101?logo=socketdotio&logoColor=white" alt="WebSocket" />
  <img src="https://img.shields.io/badge/OAuth2-SSO-4285F4?logo=google&logoColor=white" alt="OAuth2 SSO" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Local Development Setup](#-local-development-setup)
- [Deployment Procedure](#-deployment-procedure)
- [Default Users](#-default-users)
- [API Reference](#-api-reference)
- [Authentication & Authorization](#-authentication--authorization)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Modules
| Module | Description |
|--------|-------------|
| **🔐 Authentication** | JWT-based login & registration with BCrypt hashing, refresh token rotation, change password, SSO via Google & Microsoft (OAuth2) |
| **👥 User Management** | Admin panel for managing users — change roles, activate/deactivate accounts |
| **👤 User Profile** | Self-service profile editing, avatar upload, and password change UI |
| **🚛 Fleet Management** | Full CRUD for vehicles with type/status filtering (Truck, Van, Bus, Mini-Bus) |
| **🧑‍✈️ Driver Management** | Driver registry with license tracking, status management, and availability |
| **🗺️ Route Management** | Origin–destination route definitions with distance & estimated time |
| **📦 Trip Management** | End-to-end trip lifecycle: Plan → Start → Complete with vehicle/driver locking |
| **📍 GPS Tracking** | Real-time vehicle location via WebSocket (STOMP/SockJS) & REST, historical route playback on Leaflet maps |
| **📋 Lorry Receipts (LR)** | Consignment tracking with consignor/consignee, weight, quantity, and status |
| **📄 LR PDF Export** | Generate and download Lorry Receipts as formatted PDF documents (OpenPDF) |
| **🎫 Booking Management** | Customer bookings with seat capacity validation and cancellation support |
| **💰 Expense Management** | Trip & vehicle expense tracking with categories (Fuel, Toll, Maintenance, Driver Allowance) and date-range summaries |
| **🧾 Invoice Management** | Auto-generate invoices from trip expenses, manual creation, status lifecycle (Draft → Sent → Paid), PDF export |
| **📊 Analytics Dashboard** | Real-time KPI cards, 7-day trend charts (line, bar, pie), auto-refresh every 30s |
| **📈 Reports** | Trip reports, vehicle utilization, driver performance — with CSV export |
| **🔔 Notification Center** | In-app notification bell with real-time push via WebSocket, mark as read, unread count |
| **📎 File Attachments** | Upload documents (insurance, permits, PODs) to trips, vehicles, and LRs — download and manage |
| **📝 Audit Log** | Full audit trail tracking all data changes with user, timestamp, old/new value diffs |
| **🔗 Webhook Integrations** | Push trip/booking/LR events to external systems with HMAC-signed payloads and Spring Retry |
| **✉️ Email Notifications** | Booking confirmations, trip status updates, and LR dispatch alerts via Spring Boot Mail |
| **🔑 SSO / OAuth2** | Single sign-on with Google and Microsoft — auto-creates or links accounts on first OAuth login |
| **📌 Geofencing** | Define circular geofence zones on a map, trigger alerts when vehicles enter/exit zones via Haversine distance checks |
| **⛽ Fuel Analytics** | Fuel efficiency tracking with cost-per-km breakdowns by vehicle, monthly spend trends, and analytics dashboard |

### Platform Capabilities
- **Role-Based Access Control** — 4 roles (Admin, Dispatcher, Driver, Client) with granular permissions
- **SSO / OAuth2** — Single sign-on with Google & Microsoft; auto-creates or links user accounts
- **Refresh Token Rotation** — Secure refresh tokens with silent renewal and revocation
- **Multi-Tenant Support** — Tenant-aware data isolation with subdomain-based tenants (Admin managed)
- **WebSocket Real-Time** — STOMP over SockJS for live GPS location updates and notification push
- **Geofencing** — Define geofence zones with real-time enter/exit alerts via Haversine distance checking
- **Fuel Analytics** — Cost-per-km breakdowns, monthly trends, per-vehicle efficiency metrics
- **Dark Mode** — Theme toggle with CSS custom properties and localStorage persistence
- **i18n / Localization** — Multi-language support with `react-intl` (English, Hindi)
- **Real-Time Dashboard** — Recharts-powered visualizations with auto-refresh
- **Pagination & Filtering** — Server-side pagination with status, date, and text filters on all list views
- **Responsive Design** — Mobile-friendly sidebar, tables, and forms
- **Swagger / OpenAPI** — Interactive API documentation at `/swagger-ui.html`
- **Docker Compose** — One-command full-stack deployment (PostgreSQL + Backend + Frontend)
- **Flyway Migrations** — Version-controlled database schema for production (V1–V8, 9 files)
- **Structured Error Handling** — Consistent JSON error responses with validation details

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Java 17 · Spring Boot 3.2 · Spring Security · Spring Data JPA · Hibernate |
| **Auth** | JWT (jjwt 0.12.5) · Refresh Token Rotation · BCrypt · OAuth2 Client (Google, Microsoft SSO) · `@PreAuthorize` method-level security |
| **Database** | H2 (dev) · PostgreSQL 16 (prod) · Flyway migrations |
| **API Docs** | Springdoc OpenAPI 2.5 · Swagger UI |
| **PDF** | OpenPDF (Lorry Receipt + Invoice PDF generation) |
| **Email** | Spring Boot Mail Starter (async, toggled by `app.email.enabled`) |
| **WebSocket** | Spring WebSocket + STOMP + SockJS (real-time GPS tracking & notifications) |
| **Webhooks** | Spring Retry + `@Async` for reliable event dispatch |
| **Frontend** | React 18 · React Router v6 · Axios · Recharts · React Toastify · React Icons |
| **Maps** | Leaflet · React Leaflet (trip GPS tracking with historical route playback) |
| **i18n** | react-intl (English, Hindi) |
| **State** | Context API + `useReducer` for auth · ThemeContext for dark mode · I18nProvider for locale |
| **Real-Time** | @stomp/stompjs + SockJS (notification push, live location updates) |
| **DevOps** | Docker · Docker Compose · Nginx (reverse proxy + SPA routing) · Multi-stage builds |

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTP/REST     ┌──────────────────────────────────────┐
│                 │  ──────────────►  │            Spring Boot API            │
│   React SPA     │                   │                                      │
│   (Nginx)       │  ◄──────────────  │  Controller → Service → Repository   │
│                 │     JSON + JWT     │         ↕                            │
│  Port 80        │                   │   Spring Security (JWT Filter)       │
└─────────────────┘                   │         ↕                            │
                                      │   PostgreSQL / H2                    │
                                      │   Port 8080                          │
                                      └──────────────────────────────────────┘
```

**Design Patterns & Principles:**

- **DTO Pattern** — Entities never exposed directly to API consumers
- **Global Exception Handling** — `@RestControllerAdvice` with structured `ApiErrorResponse`
- **Stateless JWT Auth** — No server-side sessions; role claims embedded in token
- **Refresh Token Rotation** — Secure token renewal with automatic revocation of old tokens
- **Trip Lifecycle** — `PLANNED → IN_PROGRESS → COMPLETED` with automatic vehicle/driver availability tracking
- **Seat Capacity Validation** — Booking service checks available seats before confirming
- **Auditable Entities** — `createdAt`, `updatedAt`, `createdBy`, `updatedBy` on all entities
- **Audit Log** — Entity-level change tracking with old/new value diffs (CREATE, UPDATE, DELETE)
- **Multi-Tenant Architecture** — Tenant context propagation via filter + tenant_id on all major tables
- **Async Event Dispatch** — Webhook delivery with Spring Retry for reliability
- **Real-Time WebSocket** — STOMP/SockJS for live GPS location streaming and notification push
- **Invoice Generation** — Auto-generate from trip expenses with line items, tax calculation, and PDF export

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Required For |
|------|---------|-------------|
| Java | 17+ | Backend |
| Maven | 3.8+ | Backend |
| Node.js | 18+ | Frontend |
| Docker & Docker Compose | Latest | Docker deployment |

---

## 💻 Local Development Setup

Run the backend and frontend independently with zero external dependencies — the backend uses an **H2 in-memory database** and auto-seeds demo data on startup.

### Step 1 — Start the Backend

```bash
cd tms-backend
mvn spring-boot:run
```

The `dev` profile is active by default. This means:
- **H2 in-memory DB** — schema is created via `create-drop` DDL (rebuilt on every restart)
- **Flyway disabled** — no SQL migrations are run
- **DataSeeder runs** — demo users, vehicles, drivers, routes, LRs, trips, and bookings are seeded automatically
- **SQL logging enabled** — Hibernate queries are printed to the console

| Endpoint | URL |
|----------|-----|
| REST API | `http://localhost:8080/api/v1` |
| H2 Console | `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:tmsdb`, user: `sa`, no password) |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |

### Step 2 — Start the Frontend

```bash
cd tms-frontend
npm install      # first time only
npm start
```

| Endpoint | URL |
|----------|-----|
| React App | `http://localhost:3000` |

The frontend Axios instance points to `http://localhost:8080/api/v1` by default (configured in `src/api/axios.js`). No proxy configuration is needed.

### Step 3 — Verify

1. Open `http://localhost:3000` in your browser
2. Log in with any of the [test users](#-default-users) (e.g., `admin` / `admin123`)
3. The dashboard should load with seeded KPI data and trend charts

### Optional: Override Backend Configuration

All backend settings are overridable via environment variables:

```bash
# Example: change the server port and enable email
SERVER_PORT=9090 EMAIL_ENABLED=true mvn spring-boot:run
```

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `dev` | Active Spring profile (`dev` or `prod`) |
| `SERVER_PORT` | `8080` | Backend HTTP port |
| `JWT_SECRET` | *(base64 key)* | HMAC-SHA256 signing key for JWTs |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Access token lifetime |
| `JWT_REFRESH_EXPIRATION_MS` | `604800000` (7d) | Refresh token lifetime |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |
| `EMAIL_ENABLED` | `false` | Enable/disable email notifications |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server host |
| `MAIL_PORT` | `587` | SMTP server port |
| `MAIL_USERNAME` | `noreply@tms.com` | SMTP username |
| `MAIL_PASSWORD` | *(empty)* | SMTP password |
| `LOG_LEVEL` | `INFO` | Logging level for `com.tms` package |
| `GOOGLE_CLIENT_ID` | *(placeholder)* | Google OAuth2 client ID (SSO) |
| `GOOGLE_CLIENT_SECRET` | *(placeholder)* | Google OAuth2 client secret (SSO) |
| `MICROSOFT_CLIENT_ID` | *(placeholder)* | Microsoft OAuth2 client ID (SSO) |
| `MICROSOFT_CLIENT_SECRET` | *(placeholder)* | Microsoft OAuth2 client secret (SSO) |
| `OAUTH2_FRONTEND_REDIRECT_URL` | `http://localhost:3000/oauth2/callback` | Frontend callback URL for OAuth2 |

### Running Tests

```bash
# Backend — Spring Boot tests with H2
cd tms-backend && mvn test

# Frontend — Jest + React Testing Library
cd tms-frontend && npm test
```

---

## 🚢 Deployment Procedure

### Docker Compose — Full Stack *(recommended)*

Deploy the complete application (PostgreSQL + Spring Boot + React/Nginx) with a single command.

#### 1. Build & Start

```bash
docker compose up --build
```

This starts three containers in dependency order:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   tms-postgres   │────►│   tms-backend    │────►│  tms-frontend    │
│  PostgreSQL 16   │     │  Spring Boot     │     │  Nginx + React   │
│  Port 5432       │     │  Port 8080       │     │  Port 80         │
│  (healthcheck)   │     │  (healthcheck)   │     │                  │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

| Service | Container | URL | Details |
|---------|-----------|-----|---------|
| 🐘 PostgreSQL | `tms-postgres` | `localhost:5432` | DB: `tmsdb` · User: `tms` · Pass: `tms` |
| ⚙️ Backend | `tms-backend` | `http://localhost:8080/api/v1` | Spring Boot with `prod` profile, Flyway migrations |
| 🌐 Frontend | `tms-frontend` | `http://localhost` (port 80) | Nginx serves React SPA, reverse-proxies `/api/` to backend |
| 📖 Swagger UI | — | `http://localhost/swagger-ui` | Proxied through Nginx to backend |

#### 2. How It Works

- **PostgreSQL** starts first with a healthcheck (`pg_isready`). Database `tmsdb` is created automatically.
- **Backend** waits for Postgres to be healthy, then boots with the `prod` profile:
  - Flyway runs all migrations in `db/migration/` (V1–V8) to create the schema and seed demo data
  - JPA validates the schema against entities (`ddl-auto: validate`)
  - Backend healthcheck polls `/v3/api-docs` until ready
- **Frontend** waits for backend to be healthy, then serves the React build via Nginx:
  - `REACT_APP_API_BASE_URL` is baked in as `/api/v1` at build time
  - Nginx reverse-proxies `/api/` → `http://tms-backend:8080/api/`
  - Nginx reverse-proxies `/swagger-ui` and `/v3/api-docs` → backend
  - All other routes fall back to `index.html` (SPA routing)

#### 3. Docker Build Details

| Image | Base | Build Strategy |
|-------|------|---------------|
| `tms-backend` | `maven:3.9-eclipse-temurin-17` → `eclipse-temurin:17-jre-alpine` | Multi-stage: Maven builds JAR, Alpine JRE runs it. Non-root `tms` user. |
| `tms-frontend` | `node:18-alpine` → `nginx:1.25-alpine` | Multi-stage: Node builds React app, Nginx serves static files. |

#### 4. Stop & Clean Up

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v
```

#### 5. Rebuild a Single Service

```bash
# Rebuild only the backend after code changes
docker compose up --build tms-backend

# Rebuild only the frontend
docker compose up --build tms-frontend
```

### Production Deployment Customization

For a real production deployment, override the default environment variables in `docker-compose.yml` or use a `.env` file:

```bash
# .env (place next to docker-compose.yml)
POSTGRES_PASSWORD=<strong-password>
DB_PASSWORD=<strong-password>
JWT_SECRET=<random-base64-key-at-least-256-bits>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
EMAIL_ENABLED=true
MAIL_HOST=smtp.yourprovider.com
MAIL_USERNAME=notifications@yourdomain.com
MAIL_PASSWORD=<smtp-password>
```

**Checklist for production:**

| Item | Action |
|------|--------|
| **JWT Secret** | Replace the default base64 key with a cryptographically random 256-bit+ key |
| **Database credentials** | Change from `tms/tms` to strong credentials |
| **CORS origins** | Set to your actual frontend domain(s) |
| **Email** | Set `EMAIL_ENABLED=true` and configure SMTP credentials |
| **HTTPS** | Add TLS termination via a reverse proxy (e.g., Traefik, Caddy, or cloud LB) in front of Nginx |
| **Persistent storage** | The `pgdata` Docker volume persists data across restarts — back it up regularly |
| **Log level** | `prod` profile defaults to `WARN` for `com.tms`; override `LOG_LEVEL` if needed |
| **JVM tuning** | Pass heap settings via `JAVA_OPTS` env var (e.g., `JAVA_OPTS=-Xmx512m -Xms256m`) |

### Standalone JAR Deployment (without Docker)

Build and run the backend as a standalone JAR with an external PostgreSQL:

```bash
cd tms-backend

# Build the JAR (skip tests for faster builds)
mvn clean package -DskipTests

# Run with production config
SPRING_PROFILES_ACTIVE=prod \
DB_URL=jdbc:postgresql://your-db-host:5432/tmsdb \
DB_USERNAME=tms \
DB_PASSWORD=<password> \
JWT_SECRET=<your-secret> \
java -jar target/tms-backend-1.0.0.jar
```

For the frontend, build the static files and serve via any web server:

```bash
cd tms-frontend

# Build with the production API base URL
REACT_APP_API_BASE_URL=/api/v1 npm run build

# The 'build/' directory contains the static SPA — deploy to Nginx, Apache, S3, etc.
```

Example Nginx config for standalone frontend deployment (mirrors `tms-frontend/nginx.conf`):

```nginx
server {
    listen 80;
    root /var/www/tms/build;
    index index.html;

    # Reverse proxy API to backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 👤 Default Users

| Username | Password | Role | Access Level |
|----------|----------|------|-------------|
| `admin` | `admin123` | **ADMIN** | Full access — CRUD all resources, user management, tenants, audit logs, webhooks, delete anything |
| `dispatcher` | `dispatch123` | **DISPATCHER** | Manage trips, vehicles, drivers, bookings, routes, LRs, expenses, reports |
| `driver1` | `driver123` | **DRIVER** | View vehicles, routes, trips · Update trip status · View LRs |
| `client1` | `client123` | **CLIENT** | View routes, trips · Create/cancel bookings · View LRs |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/login` | Login with credentials | ❌ |
| `POST` | `/api/v1/auth/register` | Register a new user | ❌ |
| `POST` | `/api/v1/auth/refresh` | Refresh access token using refresh token | ❌ |
| `PATCH` | `/api/v1/auth/change-password` | Change current user's password | ✅ |
| `GET` | `/api/v1/auth/oauth2/providers` | Get enabled SSO providers (Google, Microsoft) | ❌ |

### Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/profile` | Get current user profile | ✅ |
| `PUT` | `/api/v1/profile` | Update profile (name, email) | ✅ |
| `POST` | `/api/v1/profile/avatar` | Upload avatar image | ✅ |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/v1/dashboard/metrics` | KPI statistics (counts, recent trips) | Admin, Dispatcher |
| `GET` | `/api/v1/dashboard/trends` | 7-day trend data + status breakdowns | Admin, Dispatcher |

### Resources (CRUD)

| Resource | Base Path | Filters | Special Endpoints |
|----------|-----------|---------|-------------------|
| **Vehicles** | `/api/v1/vehicles` | `type`, `status` | `GET /available` |
| **Drivers** | `/api/v1/drivers` | `status`, `name` | `GET /active` |
| **Routes** | `/api/v1/routes` | — | `GET /active`, `GET /search?query=` |
| **Trips** | `/api/v1/trips` | `status`, `startFrom`, `startTo` | `PATCH /{id}/status`, `GET /recent`, `GET /{id}/tracking` |
| **Bookings** | `/api/v1/bookings` | `status`, `customerName` | `PATCH /{id}/cancel`, `GET /trip/{tripId}` |
| **Lorry Receipts** | `/api/v1/lrs` | `status`, `origin`, `destination` | `GET /{id}/pdf` (download PDF) |
| **Expenses** | `/api/v1/expenses` | `category`, `from`, `to` | `GET /summary` (total for date range) |
| **Invoices** | `/api/v1/invoices` | `status`, `from`, `to` | `POST /generate/{tripId}` (auto-generate from trip), `GET /{id}/pdf`, `PATCH /{id}/status` |

### Reports *(Admin, Dispatcher)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/reports/trips?from=&to=` | Trip report for date range |
| `GET` | `/api/v1/reports/trips/csv?from=&to=` | Export trip report as CSV |
| `GET` | `/api/v1/reports/vehicles` | Vehicle utilization report |
| `GET` | `/api/v1/reports/drivers` | Driver performance report |

### Notifications *(All authenticated users)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/notifications` | Get current user's notifications (paginated) |
| `GET` | `/api/v1/notifications/count-unread` | Get unread notification count |
| `PATCH` | `/api/v1/notifications/{id}/read` | Mark a notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | Mark all notifications as read |

### File Attachments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/attachments/upload` | Upload file attachment (entityType + entityId) | Admin, Dispatcher, Driver |
| `GET` | `/api/v1/attachments?entityType=&entityId=` | List attachments for an entity | ✅ |
| `GET` | `/api/v1/attachments/{id}/download` | Download an attachment | ✅ |
| `DELETE` | `/api/v1/attachments/{id}` | Delete an attachment | Admin |

### Vehicle Location / GPS

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/vehicles/{vehicleId}/location` | Submit vehicle location update via REST | Admin, Dispatcher, Driver |
| `GET` | `/api/v1/trips/{tripId}/route-history` | Get historical route for a trip | All roles |
| `GET` | `/api/v1/vehicles/{vehicleId}/location-history?from=&to=` | Get vehicle location history for date range | Admin, Dispatcher |
| *WS* | `/app/location.update` | Submit location update via WebSocket (STOMP) | — |

### Geofences *(Admin, Dispatcher)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/geofences` | List all geofences (paginated) |
| `GET` | `/api/v1/geofences/{id}` | Get geofence by ID |
| `POST` | `/api/v1/geofences` | Create a geofence zone |
| `PUT` | `/api/v1/geofences/{id}` | Update a geofence zone |
| `DELETE` | `/api/v1/geofences/{id}` | Delete a geofence (Admin only) |
| `GET` | `/api/v1/geofences/{id}/events` | Get enter/exit events for a geofence |
| `GET` | `/api/v1/geofences/events/vehicle/{vehicleId}` | Get geofence events for a vehicle |

### Fuel Analytics *(Admin, Dispatcher)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/analytics/fuel?from=&to=` | Overall fuel analytics with cost-per-km breakdowns |
| `GET` | `/api/v1/analytics/fuel/vehicle/{vehicleId}?from=&to=` | Per-vehicle fuel detail |

### Admin-Only APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users` | List all users (paginated) |
| `PUT` | `/api/v1/users/{id}/role` | Change user role |
| `PATCH` | `/api/v1/users/{id}/activate` | Activate user |
| `PATCH` | `/api/v1/users/{id}/deactivate` | Deactivate user |
| `GET` | `/api/v1/audit-logs` | Get audit logs (filterable by entityType, entityId, changedBy) |
| `GET` | `/api/v1/webhooks` | List registered webhooks |
| `POST` | `/api/v1/webhooks` | Register a new webhook |
| `DELETE` | `/api/v1/webhooks/{id}` | Delete a webhook |
| `GET` | `/api/v1/tenants` | List all tenants |
| `POST` | `/api/v1/tenants` | Create a tenant |
| `PUT` | `/api/v1/tenants/{id}` | Update a tenant |
| `DELETE` | `/api/v1/tenants/{id}` | Delete a tenant |
| `DELETE` | `/api/v1/invoices/{id}` | Delete an invoice |
| `DELETE` | `/api/v1/attachments/{id}` | Delete a file attachment |

### WebSocket Endpoints

| Endpoint | Protocol | Description |
|----------|----------|-------------|
| `/ws` | SockJS + STOMP | WebSocket connection endpoint |
| `/app/location.update` | STOMP (send) | Push vehicle location updates |
| `/topic/vehicle.{vehicleId}` | STOMP (subscribe) | Receive live location updates for a vehicle |
| `/user/queue/notifications` | STOMP (subscribe) | Receive real-time notification push |

<details>
<summary><strong>📝 Sample API Responses</strong></summary>

#### Login — `POST /api/v1/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "a1b2c3d4-e5f6-...",
    "tokenType": "Bearer",
    "username": "admin",
    "email": "admin@tms.com",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }
}
```

#### Refresh Token — `POST /api/v1/auth/refresh`

**Request:**
```json
{
  "refreshToken": "a1b2c3d4-e5f6-..."
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...(new)",
    "refreshToken": "x9y8z7w6-...(rotated)",
    "tokenType": "Bearer",
    "username": "admin",
    "email": "admin@tms.com",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }
}
```

#### Validation Error — `400 Bad Request`
```json
{
  "timestamp": "2026-04-08T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "validationErrors": {
    "username": "Username must be between 3 and 100 characters",
    "password": "Password must be at least 6 characters",
    "email": "Invalid email format"
  }
}
```

#### Unauthorized — `401`
```json
{
  "timestamp": "2026-04-08T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

#### Duplicate Resource — `409 Conflict`
```json
{
  "timestamp": "2026-04-08T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "User already exists with username: 'admin'"
}
```

#### Access Denied — `403 Forbidden`
```json
{
  "timestamp": "2026-04-08T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You do not have permission to perform this action"
}
```

</details>

---

## 🔐 Authentication & Authorization

### Auth Flow

```
1. Client  ──POST /auth/login──►  Backend validates credentials
2. Backend ──JWT + RefreshToken──►  Client stores tokens in localStorage
3. Client  ──Bearer token──────►  Every API request via Axios interceptor
4. Backend ──JwtAuthFilter─────►  Extracts & validates token per request
5. Backend ──@PreAuthorize─────►  Enforces role-based access on methods
6. Client  ──401 interceptor───►  Attempts silent refresh via /auth/refresh
7. Client  ──refresh fails─────►  Clears storage, redirects to /login
```

### Role Permissions Matrix

| Resource | ADMIN | DISPATCHER | DRIVER | CLIENT |
|----------|:-----:|:----------:|:------:|:------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Profile | ✅ | ✅ | ✅ | ✅ |
| Vehicles | CRUD | CRUD | Read | — |
| Drivers | CRUD | CRUD | — | — |
| Routes | CRUD | CRUD | Read | Read |
| Trips | CRUD | CRUD | Read + Status | Read |
| Trip Tracking | ✅ | ✅ | ✅ | ✅ |
| Bookings | CRUD | CRUD | — | Create + Read + Cancel |
| Lorry Receipts | CRUD | CRUD | Read | Read |
| LR PDF Export | ✅ | ✅ | ✅ | ✅ |
| Expenses | CRUD | CRUD | — | — |
| Invoices | CRUD | CRUD | — | — |
| Invoice PDF | ✅ | ✅ | — | — |
| Geofences | CRUD | CRUD | — | — |
| Fuel Analytics | ✅ | ✅ | — | — |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| File Attachments | CRUD | Upload + Read | Upload + Read | Read |
| Reports | ✅ | ✅ | — | — |
| Users | CRUD | — | — | — |
| Audit Logs | ✅ | — | — | — |
| Webhooks | CRUD | — | — | — |
| Tenants | CRUD | — | — | — |
| Delete any | ✅ | — | — | — |

### Security Highlights

| Feature | Implementation |
|---------|---------------|
| Password Hashing | BCrypt (Spring Security default strength) |
| Access Token | JWT with HMAC-SHA256, 24h expiration |
| Refresh Token | UUID-based, 7-day expiration, automatic rotation & revocation |
| Sessions | Stateless — no server-side session storage |
| CSRF | Disabled (not needed for token-based auth) |
| Registration Guard | Self-assigning ADMIN role blocked; defaults to CLIENT |
| OAuth2 SSO | Google & Microsoft via Spring Security OAuth2 Client; auto-links by email |
| Error Responses | Structured JSON for all failure modes (400, 401, 403, 404, 409) |

---

## 📁 Project Structure

```
transport-management-system/
│
├── docker-compose.yml                     # Full-stack orchestration
│
├── tms-backend/                           # Spring Boot REST API
│   ├── Dockerfile                         # Multi-stage: Maven build → JRE Alpine
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/tms/
│       │   ├── TmsApplication.java
│       │   ├── config/                    # Security, CORS, OpenAPI, DataSeeder, AsyncRetry, TenantFilter, WebSocket
│       │   │   ├── SecurityConfig.java        # URL-level security rules
│       │   │   ├── WebSocketConfig.java       # STOMP/SockJS config with JWT auth on CONNECT
│       │   │   ├── DataSeeder.java            # Demo data seeder (dev profile only)
│       │   │   ├── TenantFilter.java          # Multi-tenant context propagation
│       │   │   ├── AsyncRetryConfig.java      # Spring Retry for webhook dispatch
│       │   │   └── WebConfig.java             # CORS + static file serving
│       │   ├── controller/                # REST controllers with @PreAuthorize
│       │   │   ├── AuthController.java        # Login, register, refresh token, change password
│       │   │   ├── ProfileController.java     # Profile view/edit, avatar upload
│       │   │   ├── DashboardController.java   # KPI metrics & trend data
│       │   │   ├── VehicleController.java     # Fleet CRUD
│       │   │   ├── DriverController.java      # Driver CRUD
│       │   │   ├── RouteController.java       # Route CRUD
│       │   │   ├── TripController.java        # Trip CRUD + status transitions + tracking
│       │   │   ├── BookingController.java     # Booking CRUD + cancellation
│       │   │   ├── LorryReceiptController.java # LR CRUD + PDF download
│       │   │   ├── ExpenseController.java     # Expense CRUD + summary
│       │   │   ├── InvoiceController.java     # Invoice CRUD + auto-generate + PDF download
│       │   │   ├── NotificationController.java # In-app notifications + unread count
│       │   │   ├── FileAttachmentController.java # File upload/download/list
│       │   │   ├── VehicleLocationController.java # GPS REST + WebSocket handler
│       │   │   ├── GeofenceController.java    # Geofence CRUD + events
│       │   │   ├── FuelAnalyticsController.java # Fuel analytics + cost-per-km
│       │   │   ├── ReportController.java      # Trip/vehicle/driver reports + CSV export
│       │   │   ├── UserController.java        # User management (Admin)
│       │   │   ├── AuditLogController.java    # Audit trail (Admin)
│       │   │   ├── WebhookController.java     # Webhook registration (Admin)
│       │   │   └── TenantController.java      # Multi-tenant management (Admin)
│       │   ├── dto/request/               # Validated request DTOs
│       │   ├── dto/response/              # Response DTOs (never expose entities)
│       │   ├── entity/                    # JPA entities with UUID PKs
│       │   │   ├── Auditable.java             # Base class (createdAt/updatedAt/createdBy/updatedBy)
│       │   │   ├── Vehicle.java, Driver.java, Route.java, Trip.java, Booking.java
│       │   │   ├── LorryReceipt.java, Expense.java, User.java
│       │   │   ├── Invoice.java               # Invoice with line items, tax, status lifecycle
│       │   │   ├── InvoiceItem.java           # Invoice line items linked to expenses
│       │   │   ├── Notification.java          # In-app notification per user
│       │   │   ├── FileAttachment.java        # Polymorphic file attachment (entity_type + entity_id)
│       │   │   ├── VehicleLocationHistory.java # GPS breadcrumb trail
│       │   │   ├── Geofence.java              # Circular geofence zone
│       │   │   ├── GeofenceEvent.java         # Enter/exit event log
│       │   │   ├── AuditLog.java, RefreshToken.java, Tenant.java, WebhookRegistration.java
│       │   │   └── ...
│       │   ├── enums/                     # UserRole, TripStatus, VehicleStatus, InvoiceStatus, NotificationType, GeofenceType, etc.
│       │   ├── exception/                 # Global exception handler + custom exceptions
│       │   ├── repository/                # Spring Data JPA repositories
│       │   ├── security/                  # JWT provider, filter, entry point, OAuth2 success handler
│       │   └── service/                   # Business logic layer
│       │       ├── AuthService.java           # Login, register, refresh token rotation
│       │       ├── RefreshTokenService.java   # Token creation, verify & rotate, revocation
│       │       ├── TripService.java           # Trip lifecycle + vehicle/driver status management
│       │       ├── BookingService.java        # Seat capacity validation
│       │       ├── ExpenseService.java        # Expense CRUD + date-range summaries
│       │       ├── InvoiceService.java        # Invoice CRUD + auto-generate from trip expenses
│       │       ├── InvoicePdfService.java     # OpenPDF-based invoice PDF generation
│       │       ├── NotificationService.java   # In-app notification CRUD + WebSocket push
│       │       ├── FileAttachmentService.java # Polymorphic file upload/download
│       │       ├── VehicleLocationService.java # GPS update processing + history + geofence check
│       │       ├── GeofenceService.java       # Geofence CRUD + Haversine enter/exit detection
│       │       ├── FuelAnalyticsService.java  # Fuel cost-per-km analytics + monthly trends
│       │       ├── OAuth2AuthenticationService.java # OAuth2 user provisioning + JWT issuance
│       │       ├── ReportService.java         # Trip/vehicle/driver reports + CSV export
│       │       ├── LrPdfService.java          # OpenPDF-based LR document generation
│       │       ├── EmailService.java          # Async email notifications
│       │       ├── AuditLogService.java       # Audit trail recording & queries
│       │       ├── WebhookDispatchService.java # Async webhook delivery with retry
│       │       ├── TenantService.java         # Tenant CRUD
│       │       ├── FileStorageService.java    # Avatar/file upload handling
│       │       └── ...                        # Other resource services
│       └── resources/
│           ├── application.yml            # Common config
│           ├── application-dev.yml        # H2 in-memory (create-drop)
│           ├── application-prod.yml       # PostgreSQL (Flyway + validate)
│           └── db/migration/              # Flyway SQL migrations (V1–V8, 9 files)
│
└── tms-frontend/                          # React 18 SPA
    ├── Dockerfile                         # Multi-stage: Node build → Nginx Alpine
    ├── nginx.conf                         # SPA fallback + API reverse proxy
    ├── package.json
    └── src/
        ├── App.js                         # Route definitions with role guards
        ├── index.js                       # Entry point with AuthProvider, ThemeProvider, I18nProvider
        ├── api/axios.js                   # Axios instance + JWT interceptors + silent refresh
        ├── context/
        │   ├── AuthContext.js             # Global auth state (useReducer)
        │   └── ThemeContext.js            # Dark/light theme toggle with localStorage
        ├── i18n/
        │   ├── I18nProvider.js            # react-intl provider with locale switching
        │   └── messages/                  # en.json, hi.json
        ├── components/
        │   ├── common/                    # DataTable, Modal, ConfirmDialog, StatusBadge, FormField
        │   │   ├── AttachmentSection.jsx  # Reusable file attachment widget for any entity
        │   │   └── ...
        │   ├── layout/                    # MainLayout, Sidebar, Navbar (with theme & locale toggles)
        │   │   ├── NotificationBell.jsx   # Real-time notification bell with unread count badge
        │   │   └── ...
        │   └── stats/                     # StatCard
        ├── pages/
        │   ├── Dashboard.jsx              # KPI cards + Recharts (Line, Bar, Pie)
        │   ├── Login.jsx / Register.jsx
        │   ├── profile/ProfilePage.jsx    # Profile editing + avatar upload
        │   ├── vehicles/                  # VehicleList + VehicleForm
        │   ├── drivers/                   # DriverList + DriverForm
        │   ├── routes/                    # RouteList + RouteForm
        │   ├── trips/                     # TripList + TripForm + TripTracking (Leaflet map)
        │   ├── bookings/                  # BookingList + BookingForm
        │   ├── lrs/                       # LrList + LrForm (Lorry Receipts + PDF download)
        │   ├── expenses/                  # ExpenseList + ExpenseForm
        │   ├── invoices/                  # InvoiceList + InvoiceForm (auto-generate + PDF)
        │   ├── geofences/                 # GeofenceList (Leaflet map + CRUD)
        │   ├── analytics/FuelAnalytics.jsx # Fuel cost-per-km dashboard with Recharts
        │   ├── OAuthCallback.jsx          # OAuth2 SSO callback handler
        │   ├── reports/ReportsPage.jsx    # Trip/vehicle/driver reports + CSV export
        │   ├── users/                     # UserList (Admin only)
        │   ├── audit/AuditLogList.jsx     # Audit trail viewer (Admin only)
        │   └── webhooks/WebhookList.jsx   # Webhook management (Admin only)
        ├── services/                      # API service modules (one per resource)
        │   ├── invoiceService.js          # Invoice CRUD + generate + PDF download
        │   ├── notificationService.js     # Notification list + mark read + unread count
        │   ├── attachmentService.js       # File upload/download/list
        │   ├── locationService.js         # Vehicle GPS location REST calls
        │   ├── geofenceService.js         # Geofence CRUD + events
        │   ├── fuelAnalyticsService.js    # Fuel analytics API calls
        │   ├── websocketService.js        # STOMP/SockJS client for real-time features
        │   └── ...                        # authService, tripService, bookingService, etc.
        └── styles/                        # Modular CSS (global, layout, forms, components, dashboard)
```

---

## 🗄️ Database Schema

<details>
<summary><strong>View full schema (20 tables)</strong></summary>

```sql
-- Users (UUID PK, role-based, tenant-aware)
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    full_name   VARCHAR(100),
    role        VARCHAR(20) NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url  VARCHAR(500),
    tenant_id   UUID,
    created_at  TIMESTAMP, updated_at TIMESTAMP,
    created_by  VARCHAR(100), updated_by VARCHAR(100)
);

-- Vehicles (fleet with type, status & GPS)
CREATE TABLE vehicles (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number   VARCHAR(30) NOT NULL UNIQUE,
    type             VARCHAR(20) NOT NULL,       -- TRUCK, VAN, BUS, MINI_BUS
    capacity         INTEGER NOT NULL,
    status           VARCHAR(20) DEFAULT 'AVAILABLE',  -- AVAILABLE, BUSY, MAINTENANCE
    current_location VARCHAR(200),
    latitude         DOUBLE PRECISION,
    longitude        DOUBLE PRECISION,
    make VARCHAR(100), model VARCHAR(100), manufacture_year INTEGER,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Drivers
CREATE TABLE drivers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           VARCHAR(100) NOT NULL,
    phone          VARCHAR(20) NOT NULL,
    license_number VARCHAR(30) NOT NULL UNIQUE,
    email          VARCHAR(150),
    status         VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Routes
CREATE TABLE routes (
    id                     BIGSERIAL PRIMARY KEY,
    origin                 VARCHAR(200) NOT NULL,
    destination            VARCHAR(200) NOT NULL,
    distance               DOUBLE PRECISION NOT NULL,
    estimated_time_minutes INTEGER NOT NULL,
    description            VARCHAR(500),
    active                 BOOLEAN DEFAULT TRUE,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Lorry Receipts
CREATE TABLE lorry_receipts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lr_number   VARCHAR(50) NOT NULL UNIQUE,
    consignor   VARCHAR(200) NOT NULL,
    consignee   VARCHAR(200) NOT NULL,
    origin      VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    material    VARCHAR(300),
    weight      DOUBLE PRECISION NOT NULL,
    quantity    INTEGER NOT NULL,
    status      VARCHAR(20) DEFAULT 'CREATED',  -- CREATED, IN_TRANSIT, DELIVERED
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Trips (links vehicle + driver + route + LRs)
CREATE TABLE trips (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    driver_id  UUID NOT NULL REFERENCES drivers(id),
    route_id   BIGINT REFERENCES routes(id),
    status     VARCHAR(20) DEFAULT 'PLANNED',  -- PLANNED, IN_PROGRESS, COMPLETED
    start_time TIMESTAMP, end_time TIMESTAMP,
    notes      VARCHAR(500),
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Trip ↔ Lorry Receipt (many-to-many)
CREATE TABLE trip_lrs (
    trip_id UUID NOT NULL REFERENCES trips(id),
    lr_id   UUID NOT NULL REFERENCES lorry_receipts(id),
    PRIMARY KEY (trip_id, lr_id)
);

-- Bookings
CREATE TABLE bookings (
    id             BIGSERIAL PRIMARY KEY,
    customer_name  VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    trip_id        UUID NOT NULL REFERENCES trips(id),
    seat_count     INTEGER NOT NULL,
    status         VARCHAR(20) DEFAULT 'CONFIRMED',  -- CONFIRMED, CANCELLED, COMPLETED
    notes          VARCHAR(500),
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Expenses
CREATE TABLE expenses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id      UUID REFERENCES trips(id),
    vehicle_id   UUID REFERENCES vehicles(id),
    category     VARCHAR(30) NOT NULL,    -- FUEL, TOLL, MAINTENANCE, DRIVER_ALLOWANCE, OTHER
    amount       NUMERIC(12,2) NOT NULL,
    description  VARCHAR(500),
    expense_date DATE NOT NULL,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Audit Logs (entity-level change tracking)
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id   VARCHAR(100) NOT NULL,
    action      VARCHAR(10) NOT NULL,     -- CREATE, UPDATE, DELETE
    changed_by  VARCHAR(100) NOT NULL,
    timestamp   TIMESTAMP NOT NULL,
    old_value   TEXT,
    new_value   TEXT
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(255) NOT NULL UNIQUE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE
);

-- Webhook Registrations
CREATE TABLE webhook_registrations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url         VARCHAR(500) NOT NULL,
    event_types VARCHAR(500) NOT NULL,   -- Comma-separated: TRIP_STATUS_CHANGED,BOOKING_CREATED,...
    secret      VARCHAR(100),            -- For HMAC signature
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    description VARCHAR(200),
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Tenants (multi-tenant support)
CREATE TABLE tenants (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name      VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) NOT NULL UNIQUE,
    active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Invoices (auto-generated from trip expenses or manual)
CREATE TABLE invoices (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    trip_id        UUID REFERENCES trips(id),
    client_name    VARCHAR(200) NOT NULL,
    client_email   VARCHAR(150),
    subtotal       NUMERIC(12,2) NOT NULL,
    tax_rate       NUMERIC(5,2) DEFAULT 18.00,
    tax_amount     NUMERIC(12,2),
    total_amount   NUMERIC(12,2) NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'DRAFT',  -- DRAFT, SENT, PAID, CANCELLED
    notes          VARCHAR(500),
    issued_date    DATE,
    due_date       DATE,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Invoice Items (line items linked to expenses)
CREATE TABLE invoice_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(300) NOT NULL,
    category    VARCHAR(30),
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12,2) NOT NULL,
    amount      NUMERIC(12,2) NOT NULL,
    expense_id  UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Notifications (in-app per-user notifications)
CREATE TABLE notifications (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id),
    title     VARCHAR(200) NOT NULL,
    message   VARCHAR(500) NOT NULL,
    type      VARCHAR(30) NOT NULL,    -- TRIP_UPDATE, BOOKING_UPDATE, INVOICE_UPDATE, SYSTEM, ALERT
    read      BOOLEAN NOT NULL DEFAULT FALSE,
    link      VARCHAR(300),
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- File Attachments (polymorphic: entity_type + entity_id)
CREATE TABLE file_attachments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type  VARCHAR(30) NOT NULL,     -- TRIP, VEHICLE, LR
    entity_id    UUID NOT NULL,
    file_name    VARCHAR(300) NOT NULL,
    file_type    VARCHAR(100) NOT NULL,
    file_size    BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Vehicle Location History (GPS breadcrumb trail)
CREATE TABLE vehicle_location_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id  UUID NOT NULL REFERENCES vehicles(id),
    trip_id     UUID REFERENCES trips(id),
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    speed       DOUBLE PRECISION,
    heading     DOUBLE PRECISION,
    recorded_at TIMESTAMP NOT NULL,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Geofences (circular zones for enter/exit detection)
CREATE TABLE geofences (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(200) NOT NULL,
    description   VARCHAR(500),
    latitude      DOUBLE PRECISION NOT NULL,
    longitude     DOUBLE PRECISION NOT NULL,
    radius_meters DOUBLE PRECISION NOT NULL,
    type          VARCHAR(30) NOT NULL DEFAULT 'CUSTOM',  -- DEPOT, RESTRICTED_ZONE, DELIVERY_ZONE, CUSTOM
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);

-- Geofence Events (enter/exit log)
CREATE TABLE geofence_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    geofence_id UUID NOT NULL REFERENCES geofences(id),
    vehicle_id  UUID NOT NULL REFERENCES vehicles(id),
    trip_id     UUID REFERENCES trips(id),
    event_type  VARCHAR(10) NOT NULL,   -- ENTER, EXIT
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    event_time  TIMESTAMP NOT NULL,
    tenant_id UUID,
    created_at TIMESTAMP, updated_at TIMESTAMP,
    created_by VARCHAR(100), updated_by VARCHAR(100)
);
```

</details>

---

## 🗺️ Roadmap

### Upcoming Features

| Priority | Feature | Description |
|:--------:|---------|-------------|
| 🟡 | **Driver Mobile App** | React Native companion app for drivers — trip accept, status updates, navigation |
| 🟢 | **Rate Limiting** | API rate limiting with Redis for abuse protection |
| 🟢 | **Polygon Geofences** | GeoJSON polygon-based geofence zones (beyond circular) |

> 🟡 Low &nbsp;·&nbsp; 🟢 Planned

### Completed ✅

- [x] JWT authentication with role-based authorization
- [x] Refresh token rotation with secure renewal and revocation
- [x] Full CRUD for Vehicles, Drivers, Routes, Trips, Bookings, Lorry Receipts
- [x] Analytics dashboard with Recharts (Line, Bar, Pie charts + KPI cards)
- [x] User management panel (Admin)
- [x] User profile & settings — self-service editing, avatar upload
- [x] Server-side pagination, filtering, and sorting
- [x] Trip lifecycle with automatic vehicle/driver status management
- [x] Trip GPS tracking — interactive Leaflet map with vehicle location
- [x] Advanced GPS tracking — real-time location streaming via WebSocket with historical route playback
- [x] Seat capacity validation on bookings
- [x] LR PDF export — generate and download Lorry Receipts as formatted PDFs
- [x] Invoice generation — auto-generate from trip expenses, manual creation, PDF export, status lifecycle
- [x] Email notifications — booking confirmations, trip status updates, LR dispatch alerts
- [x] Notification center — in-app notification bell with real-time push via WebSocket
- [x] File attachments — upload documents (insurance, permits, PODs) to trips, vehicles, and LRs
- [x] Expense & billing module — trip/vehicle expenses with categories and date-range summaries
- [x] Reports & analytics — trip/vehicle/driver reports with CSV export
- [x] Audit log — full entity change tracking with old/new value diffs
- [x] Webhook integrations — event-driven pushes with HMAC signatures and Spring Retry
- [x] Multi-tenant support — tenant-aware data isolation with subdomain-based tenants
- [x] Dark mode — theme toggle with CSS custom properties and localStorage persistence
- [x] i18n / localization — multi-language support with react-intl (English, Hindi)
- [x] WebSocket support — STOMP over SockJS for real-time GPS and notifications
- [x] Docker Compose full-stack deployment
- [x] Flyway database migrations (V1–V8, 9 files)
- [x] Swagger / OpenAPI documentation
- [x] Responsive UI with role-filtered navigation
- [x] Change password API
- [x] SSO / OAuth2 — Single sign-on with Google and Microsoft via Spring Security OAuth2 Client
- [x] Geofencing — Circular geofence zones with enter/exit detection via Haversine formula and real-time alerts
- [x] Fuel Analytics — Cost-per-km breakdowns by vehicle, monthly fuel spend trends, analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m 'Add my feature'`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

Please ensure your code follows the existing patterns and includes appropriate tests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Spring Boot & React
</p>
