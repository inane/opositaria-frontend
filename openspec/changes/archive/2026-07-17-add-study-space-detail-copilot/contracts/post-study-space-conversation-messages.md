# Contract: POST /study-spaces/{spaceId}/conversation/messages

Sends a user message to the copilot and returns the updated conversation with the copilot's response appended.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 201 Created

The message is sent and the copilot responds successfully.

### Request

```http
POST /study-spaces/{spaceId}/conversation/messages
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "content": "What are the main themes in Chapter 3?"
}
```

| Field     | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `content` | `string` | The user's message text (non-blank)      |

### Response Body

```json
{
  "messages": [
    {
      "id": "uuid-existing",
      "role": "user",
      "content": "What are the main themes in Chapter 3?",
      "created_at": "2026-07-15T10:35:00Z"
    },
    {
      "id": "uuid-existing",
      "role": "assistant",
      "content": "The main themes in Chapter 3 are...",
      "created_at": "2026-07-15T10:35:05Z"
    },
    {
      "id": "uuid-new-user",
      "role": "user",
      "content": "Can you elaborate on the first theme?",
      "created_at": "2026-07-15T10:40:00Z"
    },
    {
      "id": "uuid-new-assistant",
      "role": "assistant",
      "content": "Certainly! The first theme explores...",
      "created_at": "2026-07-15T10:40:05Z"
    }
  ]
}
```

The response returns the FULL conversation history including all previous messages plus the new user message and the copilot response. This ensures the frontend has the complete, authoritative conversation state.

### Frontend Mapping

The adapter maps the full response to a `CopilotConversation` entity:

```typescript
const messages = response.messages.map((msg) =>
  CopilotMessage.create({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    createdAt: new Date(msg.created_at),
  })
);

return CopilotConversation.create(messages);
```

After a successful send, the frontend replaces the current conversation with the returned full history.

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

## Error — 422 Unprocessable Entity

The message content is blank or the study space has no processed documents for copilot context.

### Response Body

```json
{
  "detail": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Message cannot be blank"
  }
}
```

or

```json
{
  "detail": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "No processed documents available for copilot"
  }
}
```

### Frontend Mapping

The adapter throws `DomainError.createValidation('Message cannot be blank')` or `DomainError.createValidation('No processed documents available for copilot')`.

The frontend validates blank messages before sending, so the first case should not reach the adapter in normal flow.

---

## Error — Malformed Response

The backend returns a 201 with an unexpected body shape.

### Detection

The adapter validates the response shape before creating entities:

```typescript
function validateConversationResponse(
  data: unknown,
): data is ConversationResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as any).messages) &&
    (data as any).messages.every(
      (msg: any) =>
        typeof msg.id === 'string' &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        typeof msg.created_at === 'string',
    )
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

The backend encounters an unexpected internal error (e.g., copilot model unavailable).

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

The frontend preserves the visible conversation history and shows a retry-safe error.

---

## Notes

- The frontend MUST validate that `content` is non-blank (after trimming) before sending.
- The response returns the FULL conversation, not just the new messages. The frontend MUST replace the current conversation state with the returned history.
- The frontend MUST show a loading/pending state while waiting for the copilot response.
- On send failure, the frontend MUST preserve the existing conversation history and show a recoverable error.
- Backend contract alignment is pending. The exact response shape, message fields, and streaming behavior may change during backend coordination.
