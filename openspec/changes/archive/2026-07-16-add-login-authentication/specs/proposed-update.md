## Proposed spec update: backend communication through Angular proxy

The implementation now routes development-time backend calls through the Angular dev-server proxy to avoid direct browser calls to `http://localhost:8000` and CORS coupling.

### Update `auth-login/spec.md`

Replace this scenario text:

```md
#### Scenario: User submits valid credentials
- **GIVEN** the user enters a value in `USUARIO`
- **AND** the user enters a value in `PASSWORD`
- **WHEN** the user activates the login button
- **THEN** the system sends `POST http://localhost:8000/auth/login`
- **AND** the request body contains `email` with the `USUARIO` value
- **AND** the request body contains `password` with the `PASSWORD` value
```

With:

```md
#### Scenario: User submits valid credentials
- **GIVEN** the user enters a value in `USUARIO`
- **AND** the user enters a value in `PASSWORD`
- **WHEN** the user activates the login button
- **THEN** the frontend sends `POST /auth/login`
- **AND** the Angular development proxy forwards `/auth/**` requests to `http://localhost:8000`
- **AND** the backend receives `POST http://localhost:8000/auth/login`
- **AND** the request body contains `email` with the `USUARIO` value
- **AND** the request body contains `password` with the `PASSWORD` value
```

### Update `tasks.md` intent for backend URL wiring

If task wording is kept as implementation guidance, replace:

```md
7.3 Ensure backend base URL is isolated in an infrastructure config/token with value `http://localhost:8000`
```

With:

```md
7.3 Ensure backend communication uses the Angular dev-server proxy, with `/auth/**` forwarded to `http://localhost:8000` during development
```
