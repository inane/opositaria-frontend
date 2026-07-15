## Context

The frontend currently redirects `/` directly to `/dashboard`, and dashboard access is public. There is no auth vertical slice, no login page, no token storage, and no HTTP interceptor for bearer tokens.

The backend at `/Users/inane/Documents/Aprendizaje/Python-projects/opositaria-backend` already exposes password-based authentication at `POST /auth/login`. It expects `{ email, password }` and returns `{ access_token, token_type, user }`, where `token_type` is `bearer`. Although the frontend project context mentions email OTP auth, this change targets the existing backend password login contract requested by the operator.

## Goals / Non-Goals

**Goals:**

- Add a Material Design login view with `USUARIO`, `PASSWORD`, `Recordar password`, and a login button.
- Map `USUARIO` to the backend `email` field.
- Authenticate against `http://localhost:8000/auth/login`.
- Store the returned bearer token without storing the raw password.
- Persist token in `localStorage` when `Recordar password` is checked; otherwise use `sessionStorage`.
- Redirect authenticated users to `/dashboard` and unauthenticated users to `/login`.
- Protect dashboard access with a route guard.
- Attach `Authorization: Bearer <token>` to later API requests through an HTTP interceptor.

**Non-Goals:**

- Registration, password reset, OTP, MFA, role-based permissions, token refresh, and logout UI.
- Backend changes or backend endpoint discovery.
- Encrypting browser storage. Browser token storage remains a known SPA trade-off.

## Decisions

### 1. Add an `auth` vertical slice

The auth feature will live under `src/app/auth/` with:

- Domain: auth token value object, credentials/request validation, auth errors, token storage port.
- Application: login use case, token persistence use case or session facade boundary.
- Infrastructure: HTTP auth adapter, browser token storage adapter, login store, login UI, guard, interceptor, route file.

Alternatives considered:

- Put login directly under `app/` or `shared/`. Rejected because authentication is a business capability with domain/application rules.
- Put all token logic in the login component. Rejected because token storage and API authorization are cross-cutting concerns.

### 2. Treat “Recordar password” as token persistence, not password storage

The visible checkbox label MUST remain `Recordar password` per product decision. Internally it controls whether the bearer token is persisted in `localStorage` or `sessionStorage`. The raw password MUST never be written to browser storage.

Alternatives considered:

- Store the password to honor the literal label. Rejected for security.
- Rename the label to “Recordarme”. Rejected by product decision.

### 3. Use a token storage port with browser adapters

Token storage is modeled as a domain/application port so behavior can be tested without browser APIs. The infrastructure adapter will read/write from `localStorage` and `sessionStorage`.

Storage rules:

- Remember checked: save token in `localStorage`; clear any prior session token.
- Remember unchecked: save token in `sessionStorage`; clear any prior local token.
- Read token: prefer `localStorage`, then `sessionStorage`.
- Clear token: remove from both storages.

Alternatives considered:

- Store directly in component/store. Rejected because it prevents isolated tests and couples UI to browser APIs.
- Cookies. Rejected because the backend currently returns a JSON bearer token and no cookie contract exists.

### 4. Use Angular HTTP interceptor for bearer propagation

Register a functional HTTP interceptor globally. For every outgoing API request, if a token exists, clone the request with `Authorization: Bearer <token>`. The interceptor should not attach an Authorization header when no token exists.

Alternatives considered:

- Add headers manually in each adapter. Rejected because it duplicates auth behavior and risks missing protected calls.
- Intercept only backend base URL requests. Acceptable if implemented cleanly; default can attach to all app HTTP requests because the app only controls its own API calls in this iteration.

### 5. Route protection and root redirect

Routes should be organized as:

```text
/login      → login page
/dashboard  → protected dashboard lazy route
/           → auth-aware redirect
```

The root redirect can be implemented via a guard or redirect component/function that checks token presence. Dashboard guard redirects unauthenticated users to `/login`.

Alternatives considered:

- Leave `/dashboard` public and only navigate after login. Rejected because direct dashboard access must be protected.
- Do token validation against `/auth/me` before every navigation. Rejected for this iteration because no refresh/validation strategy was requested; token presence is enough for frontend route gating.

### 6. Login store handles view/application state

The login page uses a page-scoped store/facade for:

- Current form values
- Remember checkbox state
- Loading state
- Validation/authentication error message
- Login command

The component remains mostly declarative and delegates actions to the store.

Alternatives considered:

- Component-only state. Rejected because login involves API state, persistence, and navigation side effects.
- Global mutable auth singleton for all form state. Rejected; auth session can be global, but form state should remain page-scoped.

## Risks / Trade-offs

- [Risk] Browser token storage is vulnerable to XSS → Mitigate by never storing passwords, limiting scope to bearer token persistence, and keeping future hardening open.
- [Risk] Token presence does not guarantee token validity → Mitigate by handling 401 responses and redirecting to login in a later/session-expiry change if needed.
- [Risk] Backend URL is hardcoded to `http://localhost:8000` → Mitigate by isolating it in an infrastructure config/token so it can move to environment config later.
- [Risk] Label “Recordar password” could imply storing the password → Mitigate by documenting and testing that only tokens are stored.
- [Risk] Interceptor could attach auth to unintended requests → Mitigate by keeping API calls under the same backend base URL or by checking URL prefix if external HTTP calls are introduced.

## Migration Plan

1. Add auth domain/application behavior and tests.
2. Add browser storage and HTTP auth adapter tests.
3. Add login store and Material login component tests.
4. Add route guard/interceptor and update routing tests.
5. Add Playwright login success/failure and dashboard protection journeys.
6. Validate with unit tests, build, Playwright, and review tasks.

Rollback strategy: remove `/login`, guard, interceptor, and auth providers; restore `/` redirect to `/dashboard` and dashboard public access.

## Open Questions

- Whether a later logout view/action should be added to clear both storages.
- Whether expired/invalid token handling should call `/auth/me` or only react to 401 API responses.
