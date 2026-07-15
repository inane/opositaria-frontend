## ADDED Requirements

### Requirement: API requests include bearer token when authenticated
The system SHALL attach the stored bearer token to outgoing API requests when a token exists.

#### Scenario: Token exists before API request
- **GIVEN** an access token exists in browser storage
- **WHEN** the frontend sends an API request
- **THEN** the system includes the `Authorization` header
- **AND** the header value is `Bearer <access_token>`

#### Scenario: Token does not exist before API request
- **GIVEN** no access token exists in browser storage
- **WHEN** the frontend sends an API request
- **THEN** the system does not add an `Authorization` header

### Requirement: Token storage can retrieve and clear tokens consistently
The system SHALL centralize token persistence behavior for login, guards, and interceptors.

#### Scenario: Token is stored persistently
- **GIVEN** the system stores a token persistently
- **WHEN** the token is requested later
- **THEN** the system returns the stored token from persistent storage

#### Scenario: Token is stored for the session
- **GIVEN** the system stores a token for the current session
- **WHEN** the token is requested later
- **THEN** the system returns the stored token from session storage

#### Scenario: Token is cleared
- **GIVEN** a token exists in persistent or session storage
- **WHEN** the system clears authentication
- **THEN** no token remains in persistent storage
- **AND** no token remains in session storage
