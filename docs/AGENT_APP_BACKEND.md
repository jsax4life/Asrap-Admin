# Asrapa Agent App — Backend Integration Guide

This document describes what the **frontend (Asrap-Admin)** has built for the Agent Portal, what the backend needs to provide, and the API contract required to replace mock data with live endpoints.

---

## 1. What the Agent App Is

The Agent App is a separate experience inside the same admin SPA (`Asrap-Admin`). Field agents use it to help **Listeners (Users)**, **Artists**, and **Advertisers** who cannot self-register or subscribe on the main Asrapa Music app.

Agents can:
- View their dashboard stats and commission
- Onboard new clients (user / artist / advertiser)
- Set up subscriptions and record payments
- View their client list and transaction history

**Frontend routes (SPA only — no server routing needed):**

| Route | Screen |
|-------|--------|
| `/agent/dashboard` | Agent overview |
| `/agent/onboarding` | Choose client type |
| `/agent/onboard/user` | Onboard a listener |
| `/agent/onboard/artist` | Onboard an artist |
| `/agent/onboard/advertiser` | Onboard an advertiser |
| `/agent/clients` | Clients the agent has helped |
| `/agent/subscriptions` | Subscription status by client |
| `/agent/transactions` | Payment / commission history |
| `/agent/help` | Static help (no API needed) |

**Key frontend files:**
- Service (currently mock): `client/services/agentService.ts`
- Types: `client/types/index.ts` (`AgentClient`, `AgentTransaction`, `OnboardingFormData`, etc.)
- Constants: `client/constants/index.ts` (`SUBSCRIPTION_PLANS`, `API_ENDPOINTS.AGENT`)

---

## 2. What Is Done on the Frontend (No Backend Yet)

| Area | Status |
|------|--------|
| UI / layout / navigation | Done |
| Role-based routing (`payment_agent` → `/agent/*`) | Done |
| Login redirect by role | Done |
| Onboarding forms (user, artist, advertiser) | Done |
| Dashboard, clients, subscriptions, transactions pages | Done |
| API integration | **Mock only** in `agentService.ts` |
| Dev preview mode (no API) | Done — "Preview Agent Portal" on login in dev |
| Admin creates agent accounts | UI done at `/admin-users/create` (Payment Agent type + temporary password) — **API not wired** |
| First-login password change | UI done at `/change-password` — blocks agent portal until complete — **API not wired** |

All agent pages read from `agentService.ts`, which returns hardcoded mock data with artificial delays. Once backend endpoints exist, only `agentService.ts` (and optionally `API_ENDPOINTS` in constants) need updating.

---

## 3. Authentication & Authorization

### 3.1 Agent account lifecycle (important)

**Agents do not self-register.** The intended flow is:

```
Super Admin creates agent account (Admin Users → Create → Payment Agent)
        ↓
Backend stores account with role: payment_agent + temporary password + mustChangePassword: true
        ↓
Admin shares email + temporary password with the field agent (out of band)
        ↓
Agent logs in at /login (same login page as admin staff)
        ↓
If mustChangePassword === true → redirect to /change-password (cannot access /agent/* yet)
        ↓
Agent sets new password via POST /admin/auth/change-password
        ↓
mustChangePassword cleared → redirect to /agent/dashboard
        ↓
Agent begins onboarding clients
```

**Frontend screens involved:**

| Step | Route | Who |
|------|-------|-----|
| Create agent | `/admin-users/create` | `super_admin` |
| Login | `/login` | Agent |
| Force password change | `/change-password` | Agent (first login only) |
| Agent portal | `/agent/*` | Agent (after password changed) |

### 3.2 New role required

The frontend expects a new role on admin/agent accounts:

```ts
role: 'payment_agent'
```

Existing admin roles (`super_admin`, `admin`, `moderator`, `analyst`) must **not** access `/agent/*` routes. Agents must **not** access `/dashboard` and other admin routes.

### 3.3 Auth endpoints (existing — extend, do not replace)

The app already uses these under base URL `https://api.asrapa.com/api/v1` (or `http://localhost:4000/api/v1` in dev):

| Method | Path | Notes |
|--------|------|-------|
| `POST` | `/admin/auth/login` | Must accept `payment_agent` accounts; return `mustChangePassword` when temporary password not yet changed |
| `GET` | `/admin/auth/me` | Must return profile for `payment_agent` users including `mustChangePassword` |
| `POST` | `/admin/auth/change-password` | **New** — agent (or any user) changes password; clears `mustChangePassword` |
| `POST` | `/admin/auth/refresh` | Same as today |
| `POST` | `/admin/auth/logout` | Same as today |

**Login response shape (existing pattern):**

```json
{
  "status": "success",
  "message": "...",
  "timestamp": "...",
  "data": {
    "admin": {
      "id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "role": "payment_agent",
      "department": "Field Agents",
      "permissions": [],
      "isEmailVerified": true,
      "lastLoginAt": "...",
      "mustChangePassword": true
    },
    "accessToken": "...",
    "tokenType": "Bearer",
    "expiresIn": "..."
  }
}
```

**Frontend behavior after login:**
- If `mustChangePassword === true` → redirect to `/change-password` (all roles)
- Else if `payment_agent` → redirect to `/agent/dashboard`
- Else → redirect to `/dashboard`

All protected routes block access when `mustChangePassword` is true, except `/change-password` itself.

### 3.4 Change password (first login)

**`POST /admin/auth/change-password`**

Requires Bearer token (user is already logged in with temporary password).

**Request:**

```json
{
  "currentPassword": "temporary-password-from-admin",
  "newPassword": "agent-chosen-secure-password"
}
```

**Backend must:**
- Verify `currentPassword` matches stored hash
- Enforce password policy (min 8 chars; frontend enforces this)
- Set `mustChangePassword: false`
- Update `passwordChangedAt`

**Response:**

```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

**`GET /admin/auth/me` and login response** should return `mustChangePassword: false` after successful change.

Alternative: backend may infer first-login from `passwordChangedAt === null` instead of an explicit flag — if so, map that to `mustChangePassword` in API responses. Frontend expects the boolean field.

---

## 4. Admin Creates Agent Accounts (Required)

Only **`super_admin`** can create payment agent accounts (existing admin UI at `/admin-users/create`).

**`POST /admin/agents`**

**Request body:**

```json
{
  "firstName": "Amina",
  "lastName": "Bello",
  "email": "amina.agent@asrapa.com",
  "phoneNumber": "+2348010000000",
  "role": "payment_agent",
  "temporaryPassword": "TempPass123!",
  "department": "Field Agents"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `firstName`, `lastName` | Yes | Or accept `fullName` and split server-side |
| `email` | Yes | Unique; used for login |
| `phoneNumber` | Yes | |
| `role` | Yes | Must be `"payment_agent"` |
| `temporaryPassword` | Yes | Min 8 chars; hashed server-side; never returned after creation |
| `department` | No | Defaults to e.g. `"Field Agents"` |

**Backend must on create:**
- Set `mustChangePassword: true`
- Set `isActive: true`
- **Do not** allow `payment_agent` via self-registration or public signup

**Response:**

```json
{
  "status": "success",
  "message": "Payment agent created successfully",
  "data": {
    "id": "agent-uuid",
    "email": "amina.agent@asrapa.com",
    "role": "payment_agent",
    "mustChangePassword": true
  }
}
```

Admin shares `email` + `temporaryPassword` with the agent out of band. Optional: `POST /admin/agents/:id/reset-password` for admin-initiated password resets (also sets `mustChangePassword: true`).

---

## 5. Subscription Plans (Frontend Contract)

The UI hardcodes plan IDs and display prices. Backend should accept these **exact string values** for `subscriptionPlan` / `plan`:

| Plan ID | Client type | Display price (NGN) |
|---------|-------------|---------------------|
| `free` | `user` | 0 |
| `premium` | `user` | 1,500 |
| `family` | `user` | 3,500 |
| `artist_pro` | `artist` | 5,000 |
| `advertiser_starter` | `advertiser` | 10,000 |
| `advertiser_pro` | `advertiser` | 25,000 |

Backend may store different internal pricing, but API request/response should use these slugs. Consider a `GET /agent/plans` endpoint later so prices can be server-driven.

### Payment methods

```ts
'cash' | 'mobile_money' | 'bank_transfer' | 'card'
```

---

## 6. Required Agent API Endpoints

Suggested base path: **`/agent`** (under `/api/v1`).

All endpoints: **authenticated**, **scoped to the logged-in agent** (only their clients/transactions).

### 6.1 Dashboard stats

**`GET /agent/dashboard`**

Used by: Agent Dashboard

**Response `data`:**

```json
{
  "totalClients": 47,
  "onboardedToday": 3,
  "activeSubscriptions": 38,
  "monthlyCommission": 125000,
  "pendingOnboardings": 2,
  "usersOnboarded": 28,
  "artistsOnboarded": 12,
  "advertisersOnboarded": 7
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalClients` | number | All clients onboarded by this agent |
| `onboardedToday` | number | Clients onboarded today |
| `activeSubscriptions` | number | Clients with active paid plan |
| `monthlyCommission` | number | Agent commission this month (NGN) |
| `pendingOnboardings` | number | Onboardings started but subscription not completed |
| `usersOnboarded` | number | Listener count |
| `artistsOnboarded` | number | Artist count |
| `advertisersOnboarded` | number | Advertiser count |

---

### 6.2 List clients

**`GET /agent/clients`**

Used by: My Clients, Subscriptions

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Optional — name, email, or phone |
| `clientType` | `user` \| `artist` \| `advertiser` | Optional filter |
| `subscriptionStatus` | `active` \| `pending` \| `expired` \| `none` | Optional filter |
| `page` | number | Default `1` |
| `limit` | number | Default `10` |

**Response (paginated, match existing admin list style):**

```json
{
  "status": "success",
  "results": 5,
  "totalResults": 47,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "id": "client-uuid",
      "name": "Basheer Ibrahim",
      "email": "basheer@email.com",
      "phone": "+2348012345678",
      "clientType": "user",
      "subscriptionPlan": "premium",
      "subscriptionStatus": "active",
      "onboardedAt": "2025-06-10T00:00:00.000Z",
      "lastActivityAt": "2025-06-16T00:00:00.000Z"
    }
  ]
}
```

---

### 6.3 Onboard client

**`POST /agent/clients/onboard`**

Used by: Onboard User / Artist / Advertiser forms

This should create the appropriate platform account (listener, artist, or advertiser) and link it to the authenticated agent.

**Request body:**

```json
{
  "fullName": "Basheer Ibrahim",
  "email": "basheer@email.com",
  "phone": "+2348012345678",
  "dateOfBirth": "1998-05-12",
  "location": "Lagos",
  "clientType": "user",
  "subscriptionPlan": "premium",
  "paymentMethod": "mobile_money",
  "notes": "Referred by local shop",
  "stageName": "DJ Flame",
  "genre": "Afrobeats",
  "companyName": "Sunrise Media Ltd",
  "businessType": "Events"
}
```

| Field | Required | When |
|-------|----------|------|
| `fullName`, `email`, `phone`, `clientType` | Yes | Always |
| `stageName` | Yes | `clientType === "artist"` |
| `companyName` | Yes | `clientType === "advertiser"` |
| `subscriptionPlan` | No | If omitted, client is registered without paid plan |
| `paymentMethod` | Yes if paid plan | Required when plan is not `free` |

**Response:**

```json
{
  "status": "success",
  "message": "Client onboarded successfully",
  "data": {
    "clientId": "client-uuid",
    "transactionId": "AGT-2025-00142"
  }
}
```

**Recommended backend behavior:**
- If `subscriptionPlan` is `free` or omitted → create account only; `subscriptionStatus: "none"` or `"active"` for free tier
- If paid plan + `paymentMethod` → create subscription and transaction in one atomic operation (frontend currently calls onboard then subscribe separately — a single endpoint is preferred)

**Alternative (if you prefer two steps):** keep `POST /agent/clients/onboard` for account creation only, plus `POST /agent/clients/:clientId/subscriptions` below.

---

### 6.4 Create subscription (optional if combined with onboard)

**`POST /agent/clients/:clientId/subscriptions`**

Used by: Onboard form (paid plans), Subscriptions page ("Set Up Subscription")

**Request body:**

```json
{
  "plan": "premium",
  "paymentMethod": "mobile_money"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "transactionId": "AGT-2025-00142",
    "subscriptionStatus": "active"
  }
}
```

---

### 6.5 List transactions

**`GET /agent/transactions`**

Used by: Transactions page

**Query params:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `completed` \| `pending` \| `failed` | Optional |
| `page` | number | Default `1` |
| `limit` | number | Default `10` |
| `dateFrom` | ISO date | Optional |
| `dateTo` | ISO date | Optional |

**Response:**

```json
{
  "status": "success",
  "results": 4,
  "totalResults": 42,
  "totalPages": 5,
  "currentPage": 1,
  "limit": 10,
  "data": [
    {
      "id": "tx-uuid",
      "transactionId": "AGT-2025-00142",
      "clientName": "Basheer Ibrahim",
      "clientType": "user",
      "plan": "premium",
      "amount": 1500,
      "paymentMethod": "mobile_money",
      "status": "completed",
      "createdAt": "2025-06-10T14:30:00.000Z"
    }
  ]
}
```

**Optional summary fields** (or separate `GET /agent/transactions/summary`):

```json
{
  "totalCollected": 20000,
  "transactionCount": 42,
  "estimatedCommission": 2000
}
```

Frontend currently computes commission as 10% client-side — backend should own this logic and return `monthlyCommission` / `estimatedCommission` explicitly.

---

## 7. Data Model Summary

### Client types
```ts
'user' | 'artist' | 'advertiser'
```

### Subscription status
```ts
'active' | 'pending' | 'expired' | 'none'
```

### Transaction status
```ts
'completed' | 'pending' | 'failed'
```

### Agent–client relationship

Backend should persist which agent onboarded each client (e.g. `onboardedByAgentId`). All list endpoints must filter by the authenticated agent unless the caller is an admin viewing agent activity in the admin panel (future).

---

## 8. Response Envelope

Match existing Asrapa admin API style used by `artistService` and `authService`:

```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "timestamp": "ISO-8601",
  "data": { }
}
```

Errors:
- `401` — missing/invalid token
- `403` — valid token but not `payment_agent` (or accessing another agent's data)
- `400` — validation errors (return field-level messages if possible)
- `404` — client not found or not owned by agent

---

## 9. Frontend Integration Checklist (For Your Reference)

When endpoints are ready, the frontend team will:

1. Add paths to `API_ENDPOINTS.AGENT` in `client/constants/index.ts`
2. Replace mock methods in `client/services/agentService.ts` with `apiClient` calls
3. Remove or gate dev preview mode (`client/lib/devPreview.ts`)
4. Test login with a real `payment_agent` account
5. Align pagination/query params with backend if they differ

**Minimum endpoints to go live:**

1. `POST /admin/agents` — super_admin creates agent with temporary password
2. `POST /admin/auth/login` — support `payment_agent`; return `mustChangePassword`
3. `GET /admin/auth/me` — return agent profile + `mustChangePassword`
4. `POST /admin/auth/change-password` — first-login password change
5. `GET /agent/dashboard`
6. `GET /agent/clients`
7. `POST /agent/clients/onboard`
8. `GET /agent/transactions`

---

## 10. Open Questions for Backend

1. **Single vs two-step onboard** — Should onboarding + subscription + payment be one atomic `POST /agent/clients/onboard`, or separate create + subscribe calls?
2. **Commission rate** — Is 10% fixed, tiered, or configurable per agent?
3. **Plan pricing** — Should prices come from the server (`GET /agent/plans`) instead of frontend constants?
4. **Account creation** — Does onboard call existing user/artist/advertiser registration services internally, or new agent-specific flows?
5. **Payment verification** — Are agent-recorded payments trusted immediately (`completed`), or `pending` until reconciliation?
6. **Password reset** — Should agents ever self-reset via email, or only admin-initiated reset?

---

## Contact / Code References

- Agent service (to be wired): `client/services/agentService.ts`
- Types: `client/types/index.ts`
- Role logic: `client/lib/roles.ts`
- API client (Bearer token): `client/services/apiClient.ts`

**Base URL:** `VITE_API_BASE_URL` or `https://api.asrapa.com/api/v1`
