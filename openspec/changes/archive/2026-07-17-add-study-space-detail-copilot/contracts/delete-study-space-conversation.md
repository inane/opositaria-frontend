# Contract: DELETE /study-spaces/{spaceId}/conversation

Deletes the entire persistent copilot conversation for a study space. After clearing, the conversation returns to an empty state.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 200 OK

The conversation history is successfully deleted.

### Request

```http
DELETE /study-spaces/{spaceId}/conversation
Authorization: Bearer <token>
```

### Response Body

The backend returns an empty conversation:

```json
{
  "messages": []
}
```

Alternatively, the backend may return 204 No Content with no body. The frontend MUST handle both cases.

### Frontend Mapping

After a successful clear, the frontend replaces the current conversation with an empty `CopilotConversation`:

```typescript
return CopilotConversation.create([]);
```

The copilot section returns to the empty conversation state.

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

## Error — Malformed Response

The backend returns a 200 with an unexpected body shape (if a body is returned).

### Detection

The adapter validates the response shape:

```typescript
function validateConversationResponse(
  data: unknown,
): data is ConversationResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as any).messages)
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

The frontend preserves the existing conversation history and shows a recoverable error.

---

## Notes

- This endpoint requires explicit user confirmation before invocation. The frontend MUST show a confirmation dialog before calling this endpoint.
- After a successful clear, the conversation history MUST be replaced with an empty state in the frontend.
- On clear failure, the frontend MUST preserve the existing conversation history and show a recoverable error.
- Backend contract alignment is pending. The exact response shape and status codes may change during backend coordination.
