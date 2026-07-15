## ADDED Requirements

### Requirement: Login page presents Material credential form
The system SHALL provide a login page with only the required credential controls and login action.

#### Scenario: User opens login page
- **GIVEN** the user navigates to `/login`
- **WHEN** the page renders
- **THEN** the system displays a Material Design login form
- **AND** the form contains a `USUARIO` field
- **AND** the form contains a `PASSWORD` field
- **AND** the form contains a `Recordar password` checkbox
- **AND** the form contains a login button
- **AND** the form does not display registration, password reset, or social login controls

### Requirement: Login submits credentials to backend
The system SHALL send login credentials to the backend login endpoint using the backend contract.

#### Scenario: User submits valid credentials
- **GIVEN** the user enters a value in `USUARIO`
- **AND** the user enters a value in `PASSWORD`
- **WHEN** the user activates the login button
- **THEN** the system sends `POST http://localhost:8000/auth/login`
- **AND** the request body contains `email` with the `USUARIO` value
- **AND** the request body contains `password` with the `PASSWORD` value

#### Scenario: Backend accepts credentials
- **GIVEN** the backend returns `access_token` and `token_type` equal to `bearer`
- **WHEN** the login response is handled
- **THEN** the system stores the token for authenticated API requests
- **AND** the system navigates to `/dashboard`

#### Scenario: Backend rejects credentials
- **GIVEN** the backend returns an authentication error
- **WHEN** the login response is handled
- **THEN** the system remains on `/login`
- **AND** the system displays an accessible authentication error message
- **AND** the system does not store an access token

### Requirement: Remember password controls token persistence
The system SHALL interpret `Recordar password` as token persistence selection and MUST NOT store the raw password.

#### Scenario: User logs in with remember password checked
- **GIVEN** the `Recordar password` checkbox is checked
- **AND** the backend returns a bearer token
- **WHEN** the login response is handled
- **THEN** the system stores the access token in persistent browser storage
- **AND** the system does not store the raw password

#### Scenario: User logs in with remember password unchecked
- **GIVEN** the `Recordar password` checkbox is unchecked
- **AND** the backend returns a bearer token
- **WHEN** the login response is handled
- **THEN** the system stores the access token in session browser storage
- **AND** the system does not store the raw password

### Requirement: Routes respect authentication state
The system SHALL route users based on token presence.

#### Scenario: Unauthenticated user opens root route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the system redirects to `/login`

#### Scenario: Authenticated user opens root route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the system redirects to `/dashboard`

#### Scenario: Unauthenticated user opens dashboard route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system redirects to `/login`

#### Scenario: Authenticated user opens dashboard route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system displays the dashboard
