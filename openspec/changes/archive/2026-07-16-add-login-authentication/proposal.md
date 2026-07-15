## Why

Users need an entry point that authenticates against the backend before accessing the dashboard. The frontend must also retain the returned bearer token and attach it to future API requests so protected backend endpoints can be consumed consistently.

## What Changes

- Add a Material Design login page at `/login` with only:
  - `USUARIO` field mapped to backend `email`
  - `PASSWORD` field mapped to backend `password`
  - `Recordar password` checkbox
  - Login button
- Call the backend `POST http://localhost:8000/auth/login` endpoint with JSON credentials.
- Store the returned `access_token` using the returned `token_type` as a bearer token source for API calls.
- Persist the token in `localStorage` when `Recordar password` is checked; otherwise persist it in `sessionStorage`.
- Redirect users after successful login to `/dashboard`.
- Add route behavior for `/`:
  - authenticated users go to `/dashboard`
  - unauthenticated users go to `/login`
- Protect `/dashboard` from unauthenticated access.
- Add an HTTP interceptor that attaches `Authorization: Bearer <token>` to future API requests when a token exists.
- Show authentication errors without navigating away from the login page.

## Non-goals

- Do not implement backend changes; the backend already exposes `/auth/login`.
- Do not implement user registration, password reset, MFA, or email OTP in this change.
- Do not store the raw password in frontend storage despite the checkbox label “Recordar password”.
- Do not build role/permission-based authorization.
- Do not refresh expired tokens unless the backend adds a refresh endpoint later.
- Do not redesign the dashboard beyond route protection and post-login navigation.

## Capabilities

### New Capabilities

- `auth-login`: Covers the login page, credential submission to the backend, success/error behavior, token storage selection, and dashboard navigation after login.
- `authenticated-api-requests`: Covers bearer token retrieval and automatic `Authorization` header attachment for API requests.

### Modified Capabilities

- `dashboard-home-shell`: Root routing becomes authentication-aware and dashboard access becomes authenticated-only.

## Impact

- Frontend workspace:
  - New `auth` vertical slice with domain/application/infrastructure layers.
  - New `/login` route and route guards for `/` and `/dashboard`.
  - HTTP interceptor registered in app providers.
  - Playwright journeys for login success, login failure, redirect behavior, and dashboard protection.
- Backend workspace:
  - No code changes expected.
  - Uses existing `POST /auth/login` contract from `/Users/inane/Documents/Aprendizaje/Python-projects/opositaria-backend`.
- Common workspace:
  - No shared package changes expected.
- API contract:
  - Request: `POST http://localhost:8000/auth/login` with `{ "email": string, "password": string }`.
  - Response: `{ "access_token": string, "token_type": "bearer", "user": { ... } }`.
  - Subsequent authenticated requests include `Authorization: Bearer <access_token>`.
