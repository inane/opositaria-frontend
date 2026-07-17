# Contract: GET /study-spaces/{spaceId}

Returns the detail of a single study space owned by the authenticated user.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 200 OK

The study space exists and belongs to the authenticated user.

### Request

```http
GET /study-spaces/{spaceId}
Authorization: Bearer <token>
```

### Response Body

```json
{
  "id": "uuid-string",
  "name": "My Study Space",
  "document_count": 3,
  "created_at": "2026-07-15T10:30:00Z"
}
```

| Field            | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `id`             | `string` | Unique identifier of the study space (UUID)       |
| `name`           | `string` | Human-readable title of the study space           |
| `document_count` | `number` | Number of documents currently in the space        |
| `created_at`     | `string` | ISO-8601 timestamp of when the space was created  |

### Frontend Mapping

The adapter maps this to a `StudySpaceDetail` entity:

```typescript
StudySpaceDetail.create({
  id: response.id,
  title: response.name,
  documentCount: response.document_count,
  createdAt: new Date(response.created_at),
});
```

---

## Error — 401 Unauthorized

The request lacks a valid token or the session has expired.

### Response Body

```json
{
  "detail": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.create('Session expired. Please log in again.')`.

The existing `AuthInterceptor` redirects to the login page on 401.

---

## Error — 404 Not Found / Not Permitted

The study space does not exist, or it belongs to another user. The backend returns the same 404 for both cases to avoid leaking resource existence.

### Response Body

```json
{
  "detail": {
    "code": "NOT_FOUND",
    "message": "Study space not found"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.createNotFound('Study space not found or not accessible')`.

The detail page renders a not-permitted/not-found state with a return-to-dashboard action.

---

## Error — Malformed Response

The backend returns a 200 with an unexpected body shape (missing required fields, wrong types).

### Detection

The adapter validates the response shape before creating the entity:

```typescript
function validateStudySpaceDetailResponse(
  data: unknown,
): data is StudySpaceDetailResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).name === 'string' &&
    typeof (data as any).document_count === 'number' &&
    typeof (data as any).created_at === 'string'
  );
}
```

### Frontend Mapping

When validation fails, the adapter throws:

```typescript
DomainError.createValidation('Unexpected response from server. Please try again.');
```

---

## Error — 500 Server Error

The backend encounters an unexpected internal error.

### Response Body

```json
{
  "detail": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.create('Something went wrong. Please try again.')`.

---

## Notes

- The frontend MUST NOT cache this response; each navigation to the detail page triggers a fresh fetch.
- The `document_count` field is the canonical count from the backend. The frontend MUST NOT maintain a separate counter.
- The `created_at` timestamp is informational and used for display only.
- Backend contract alignment is pending. The exact response shape may change during backend coordination. The adapter layer isolates the frontend from these changes.
