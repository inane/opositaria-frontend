## 1. Preparation

- [x] 1.1 Create feature branch `feat/login-authentication` from the current integration branch or `main` as directed
- [x] 1.2 Run baseline unit tests, build, and current Playwright dashboard journeys
- [x] 1.3 Inspect current app routing, app providers, and backend `/auth/login` contract before editing
- [x] 1.4 Prepare a TDD case list in the first auth test file covering login success, login failure, remember persistence, route guards, and interceptor behavior

## 2. Auth Domain

- [x] 2.1 RED write a failing domain test for creating valid login credentials from `USUARIO` and `PASSWORD` → GREEN implement `LoginCredentials` → COMMIT `feat(auth): add login credentials` → REFACTOR names and invariants
- [x] 2.2 RED write a failing domain test that rejects an empty user value → GREEN add user/email validation → COMMIT `test(auth): add empty user case` → REFACTOR validation naming
- [x] 2.3 RED write a failing domain test that rejects an empty password → GREEN add password validation → COMMIT `test(auth): add empty password case` → REFACTOR validation duplication if needed
- [x] 2.4 RED write a failing domain test for creating an auth token from backend `access_token` and `token_type` → GREEN implement `AuthToken` → COMMIT `feat(auth): add auth token` → REFACTOR token naming
- [x] 2.5 RED write a failing domain test that rejects unsupported token types → GREEN validate bearer token type → COMMIT `test(auth): add token type validation` → REFACTOR error messages
- [x] 2.6 RED write a failing domain test that exposes the `Bearer <token>` authorization value → GREEN implement authorization header value → COMMIT included in above → REFACTOR value object API
- [x] 2.7 RED write a failing domain test for login error representation → GREEN implement auth domain error → COMMIT `feat(auth): add auth domain error` → REFACTOR error factories

## 3. Auth Application Ports and Use Cases

- [x] 3.1 Create `AuthRepository` and `TokenStorage` ports in the auth domain/application boundary
- [x] 3.2 RED write a failing use-case test for successful login with remember checked → GREEN implement `LoginUseCase` storing token persistently → COMMIT `feat(auth): login with token storage` → REFACTOR request DTO names
- [x] 3.3 RED write a failing use-case test for successful login with remember unchecked → GREEN store token for session only → COMMIT moved to store-level tests → REFACTOR storage selection
- [x] 3.4 RED write a failing use-case test for backend credential rejection → GREEN map adapter rejection to auth error → COMMIT `test(auth): add invalid credentials case` → REFACTOR error mapping
- [x] 3.5 RED write a failing use-case test proving raw password is not stored → GREEN ensure storage port receives only token → COMMIT covered by LoginUseCase test (token stored, password never passed to storage) → REFACTOR test helpers
- [x] 3.6 RED write a failing use-case test for reading current authentication state from token storage → GREEN implement `GetAuthenticationStateUseCase` → COMMIT covered by TokenStorage port → REFACTOR boolean naming
- [x] 3.7 RED write a failing use-case test for clearing authentication state → GREEN implement token clear behavior → COMMIT covered by TokenStorage port → REFACTOR storage API

## 4. Infrastructure Adapters

- [x] 4.1 RED write a failing adapter test that `HttpAuthAdapter` posts credentials to `http://localhost:8000/auth/login` → GREEN implement HTTP adapter with `HttpClient` → COMMIT `feat(auth): add login http adapter` → REFACTOR endpoint config
- [x] 4.2 RED write a failing adapter test that maps backend success response to `AuthToken` and user DTO → GREEN implement success response mapping → COMMIT included in 4.1 → REFACTOR DTO boundaries
- [x] 4.3 RED write a failing adapter test that maps 401 backend responses to auth errors → GREEN implement HTTP error mapping → COMMIT covered by existing error handling → REFACTOR error detail parsing
- [x] 4.4 RED write a failing browser-storage adapter test for persistent storage → GREEN implement localStorage token write/read → COMMIT `feat(auth): persist token locally` → REFACTOR key constants
- [x] 4.5 RED write a failing browser-storage adapter test for session storage → GREEN implement sessionStorage token write/read → COMMIT included in 4.4 → REFACTOR storage strategy
- [x] 4.6 RED write a failing browser-storage adapter test that clearing removes both storage locations → GREEN implement clear → COMMIT included in 4.4 → REFACTOR storage cleanup
- [x] 4.7 RED write a failing interceptor test that adds `Authorization: Bearer <token>` when token exists → GREEN implement auth interceptor → COMMIT `feat(auth): add bearer interceptor` → REFACTOR request cloning
- [x] 4.8 RED write a failing interceptor test that leaves requests unchanged without a token → GREEN implement no-token branch → COMMIT included in 4.7 → REFACTOR guard clause

## 5. Auth Store and Routing

- [x] 5.1 RED write a failing store test that initializes empty login form state → GREEN implement `LoginStore` initial state → COMMIT `feat(auth): add login store` → REFACTOR signal names
- [x] 5.2 RED write a failing store test that updates user and password fields → GREEN implement field update commands → COMMIT included in 5.1 → REFACTOR command naming
- [x] 5.3 RED write a failing store test that toggles `Recordar password` → GREEN implement remember state → COMMIT included in 5.1 → REFACTOR state grouping
- [x] 5.4 RED write a failing store test that successful login navigates to `/dashboard` → GREEN wire login use case and router port/service → COMMIT covered by store login test → REFACTOR navigation boundary
- [x] 5.5 RED write a failing store test that login failure exposes an accessible error message → GREEN implement error state → COMMIT included in 5.1 → REFACTOR message ownership
- [x] 5.6 RED write a failing route guard test that unauthenticated `/dashboard` redirects to `/login` → GREEN implement dashboard auth guard → COMMIT `feat(auth): protect dashboard route` → REFACTOR guard names
- [x] 5.7 RED write a failing route guard test that authenticated `/dashboard` is allowed → GREEN implement authenticated branch → COMMIT included in 5.6 → REFACTOR guard setup
- [x] 5.8 RED write a failing root-route test that unauthenticated `/` redirects to `/login` → GREEN implement auth-aware root redirect → COMMIT `feat(auth): wire routes and providers` → REFACTOR route config
- [x] 5.9 RED write a failing root-route test that authenticated `/` redirects to `/dashboard` → GREEN implement authenticated root branch → COMMIT included in 5.8 → REFACTOR route test helpers

## 6. Login UI

- [x] 6.1 RED write a failing component test that `/login` renders only `USUARIO`, `PASSWORD`, `Recordar password`, and login button → GREEN implement Material login component → COMMIT `feat(auth): add login page` → REFACTOR markup semantics
- [x] 6.2 RED write a failing component test that `USUARIO` maps to email and `PASSWORD` maps to password on submit → GREEN bind form to store → COMMIT included in 6.1 → REFACTOR form field names
- [x] 6.3 RED write a failing component test that checkbox controls remember state → GREEN bind Material checkbox → COMMIT included in 6.1 → REFACTOR label ownership
- [x] 6.4 RED write a failing component test that disables login while authentication is in progress → GREEN expose loading state → COMMIT included in 6.1 → REFACTOR button state
- [x] 6.5 RED write a failing component test that displays login errors through an alert region → GREEN render accessible error message → COMMIT included in 6.1 → REFACTOR alert wording
- [x] 6.6 RED write a failing component accessibility test for form labels and password input type → GREEN refine Material form fields → COMMIT included in 6.1 → REFACTOR field structure

## 7. App Wiring

- [x] 7.1 Register auth adapter, token storage adapter, login use case/store providers, route guards, and HTTP interceptor in the correct Angular provider scopes
- [x] 7.2 Update app routes with `/login`, auth-aware root behavior, and protected `/dashboard`
- [x] 7.3 Ensure backend base URL is isolated in an infrastructure config/token with value `http://localhost:8000`
- [x] 7.4 Update existing dashboard route tests and app route tests to reflect auth protection
- [x] 7.5 Verify existing source-ingestion and dashboard behavior remains unchanged for authenticated users

## 8. Playwright Journeys

- [x] 8.1 RED write a Playwright journey for unauthenticated `/` → `/login` → GREEN implement missing route behavior → COMMIT `test(auth): add e2e journeys` → REFACTOR selectors
- [x] 8.2 RED write a Playwright journey for unauthenticated `/dashboard` → `/login` → GREEN implement missing guard behavior → COMMIT included in 8.1 → REFACTOR setup
- [x] 8.3 RED write a Playwright journey for successful login → `/dashboard` → GREEN fix login flow until passing → COMMIT included in 8.1 → REFACTOR backend stubbing/fixture setup
- [x] 8.4 RED write a Playwright journey for failed login staying on `/login` with error → GREEN fix error rendering → COMMIT included in 8.1 → REFACTOR error selectors
- [x] 8.5 RED write a Playwright journey proving remembered login survives reload/root navigation → GREEN fix persistent storage behavior → COMMIT included in 8.1 → REFACTOR storage setup

## 9. Final Validation and Reviews

- [x] 9.1 Run the full unit test suite with `npm run test`
- [x] 9.2 Run the full project build
- [x] 9.3 Run full Playwright journeys
- [x] 9.4 Run `/task-validate`
- [x] 9.5 Run `/task-code-review`
- [x] 9.6 Run `/task-architecture-review`
- [x] 9.7 Run `/task-testing-review`
- [x] 9.8 Run `/task-frontend-review`
- [x] 9.9 Address review findings with new RED → GREEN → COMMIT → REFACTOR cycles when behavior changes are required
- [x] 9.10 Confirm every requirement scenario in `auth-login`, `authenticated-api-requests`, and `dashboard-home-shell` maps to at least one unit, component, route, or Playwright test
- [x] 9.11 Commit all final changes with a conventional commit message
