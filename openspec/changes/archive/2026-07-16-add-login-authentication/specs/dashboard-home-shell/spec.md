## MODIFIED Requirements

### Requirement: Root route redirects based on authentication state
The system SHALL redirect users who navigate to the root route `/` based on access-token presence.

#### Scenario: Unauthenticated user opens root route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the application redirects the user to `/login`

#### Scenario: Authenticated user opens root route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the application redirects the user to `/dashboard`

## ADDED Requirements

### Requirement: Dashboard route requires authentication
The system SHALL prevent unauthenticated users from accessing the dashboard route.

#### Scenario: Unauthenticated user opens dashboard route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system redirects the user to `/login`

#### Scenario: Authenticated user opens dashboard route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system displays the dashboard
