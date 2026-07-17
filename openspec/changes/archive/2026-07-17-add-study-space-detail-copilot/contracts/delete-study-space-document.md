# Contract: DELETE /study-spaces/{spaceId}/documents/{documentId}

Removes a document from a study space. The document is deleted from both the space association and backend storage. Deleting the last document leaves the study space empty.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 200 OK

The document is successfully removed from the study space.

### Request

```http
DELETE /study-spaces/{spaceId}/documents/{documentId}
Authorization: Bearer <token>
```

### Response Body

```json
{
  "id": "uuid-string",
  "name": "My Study Space",
  "document_count": 2,
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

After a successful deletion, the frontend MUST refresh the document list by calling `GET /study-spaces/{spaceId}/documents`.

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

The study space does not exist, the document does not exist, or the document does not belong to the specified study space.

### Response Body

```json
{
  "detail": {
    "code": "NOT_FOUND",
    "message": "Document not found in this study space"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.createNotFound('Document not found or not accessible')`.

---

## Error — Malformed Response

The backend returns a 200 with an unexpected body shape.

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

## Last-Document Deletion Semantics

When the deleted document is the last document in the study space:

- The backend MUST still return 200 OK with `document_count: 0`.
- The study space MUST NOT be deleted — it remains available with zero documents.
- The copilot section MUST become unavailable (state: `empty`).
- The frontend MUST render the empty documents state and the copilot unavailable state.

---

## Notes

- This endpoint requires explicit user confirmation before invocation. The frontend MUST show a confirmation dialog with the document filename.
- After a successful deletion, the frontend MUST refresh the document list and the study-space detail to reflect the updated `document_count`.
- The backend MUST NOT delete the study space when the last document is removed.
- Backend contract alignment is pending. The exact response shape and status codes may change during backend coordination.
