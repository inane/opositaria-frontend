### Requirement: API requests include bearer token when authenticated
The system SHALL attach the stored bearer token to outgoing protected API requests when a token exists.

#### Scenario: Token exists before API request
- **GIVEN** an access token exists in browser storage
- **WHEN** the frontend sends a protected API request
- **THEN** the system includes the `Authorization` header
- **AND** the header value is `Bearer <access_token>`

#### Scenario: Token does not exist before API request
- **GIVEN** no access token exists in browser storage
- **WHEN** the frontend sends a protected API request
- **THEN** the system does not add an `Authorization` header

#### Scenario: Authenticated document upload request is sent
- **GIVEN** an access token exists in browser storage
- **WHEN** the frontend sends `POST /study-documents/upload`
- **THEN** the system includes the `Authorization` header
- **AND** the header value is `Bearer <access_token>`

#### Scenario: Authenticated document status request is sent
- **GIVEN** an access token exists in browser storage
- **WHEN** the frontend sends `GET /study-documents/{document_id}/status`
- **THEN** the system includes the `Authorization` header
- **AND** the header value is `Bearer <access_token>`

#### Scenario: Authenticated study-space request is sent
- **GIVEN** an access token exists in browser storage
- **WHEN** the frontend sends a request to `/study-spaces`
- **THEN** the system includes the `Authorization` header
- **AND** the header value is `Bearer <access_token>`

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

### Requirement: Unauthorized backend responses return the user to authentication
The frontend SHALL handle protected API `401 Unauthorized` responses by clearing authentication state and routing the user to login.

#### Scenario: Backend rejects document upload as unauthorized
- **GIVEN** the user is creating a study space
- **WHEN** `POST /study-documents/upload` returns `401 Unauthorized`
- **THEN** the frontend clears stored authentication tokens
- **AND** the frontend routes the user to `/login`

#### Scenario: Backend rejects study-space list as unauthorized
- **GIVEN** the user is on the dashboard
- **WHEN** `GET /study-spaces` returns `401 Unauthorized`
- **THEN** the frontend clears stored authentication tokens
- **AND** the frontend routes the user to `/login`