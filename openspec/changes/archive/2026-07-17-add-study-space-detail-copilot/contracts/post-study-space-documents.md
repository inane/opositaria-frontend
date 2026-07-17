# Contract: POST /study-spaces/{spaceId}/documents

Associates a ready (processed) document with an existing study space. The document must already be uploaded and in `DONE` status before calling this endpoint.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 201 Created

The document is successfully associated with the study space.

### Request

```http
POST /study-spaces/{spaceId}/documents
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "document_id": "uuid-string"
}
```

| Field         | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| `document_id` | `string` | Unique identifier of the ready document (UUID)      |

### Response Body

```json
{
  "id": "uuid-string",
  "name": "My Study Space",
  "document_count": 4,
  "created_at": "2026-07-15T10:30:00Z"
}
```

The response returns the updated study space detail so the frontend can refresh the document count without an additional GET call.

### Frontend Mapping

The adapter maps this to an updated `StudySpaceDetail` entity:

```typescript
StudySpaceDetail.create({
  id: response.id,
  title: response.name,
  documentCount: response.document_count,
  createdAt: new Date(response.created_at),
});
```

After a successful association, the frontend MUST refresh the document list by calling `GET /study-spaces/{spaceId}/documents`.

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

The study space does not exist, or it belongs to another user.

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

---

## Error — 409 Conflict

The document is already associated with this study space.

### Response Body

```json
{
  "detail": {
    "code": "CONFLICT",
    "message": "Document is already in this study space"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.createValidation('This document is already in the study space')`.

This is a recoverable error — the document list should remain unchanged.

---

## Error — 422 Unprocessable Entity

The document is not in a ready state (still processing, errored, or not found).

### Response Body

```json
{
  "detail": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Document is not ready for association"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.createValidation('The document is not ready yet. Please wait for processing to complete.')`.

This is a recoverable error — the upload/processing flow should remain open for retry.

---

## Error — Malformed Response

The backend returns a 201 with an unexpected body shape.

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

- The frontend MUST call this endpoint only after the document processing status is `DONE`.
- The `document_id` in the request body must be a valid UUID returned by the upload/status endpoint.
- After a successful association, the frontend MUST refresh the document list and the study-space detail to reflect the updated `document_count`.
- Backend contract alignment is pending. The exact response shape and status codes may change during backend coordination.
