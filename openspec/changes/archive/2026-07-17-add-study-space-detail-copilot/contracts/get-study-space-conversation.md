# Contract: GET /study-spaces/{spaceId}/conversation

Returns the persistent copilot conversation history for a study space. Messages are returned in chronological order.

## Authentication

Requires a valid Bearer token. The backend MUST reject unauthenticated requests before checking resource ownership.

---

## Success — 200 OK

The study space exists, belongs to the authenticated user, and the conversation history is returned.

### Request

```http
GET /study-spaces/{spaceId}/conversation
Authorization: Bearer <token>
```

### Response Body

```json
{
  "messages": [
    {
      "id": "uuid-string",
      "role": "user",
      "content": "What are the main themes in Chapter 3?",
      "created_at": "2026-07-15T10:35:00Z"
    },
    {
      "id": "uuid-string",
      "role": "assistant",
      "content": "The main themes in Chapter 3 are...",
      "created_at": "2026-07-15T10:35:05Z"
    }
  ]
}
```

| Field                | Type       | Description                                              |
| -------------------- | ---------- | -------------------------------------------------------- |
| `messages`           | `array`    | Ordered list of conversation messages                    |
| `messages[].id`      | `string`   | Unique identifier of the message (UUID)                  |
| `messages[].role`    | `string`   | `"user"` or `"assistant"`                                |
| `messages[].content` | `string`   | The text content of the message                          |
| `messages[].created_at` | `string` | ISO-8601 timestamp of when the message was created     |

### Empty Conversation

When no messages exist, the backend returns an empty array:

```json
{
  "messages": []
}
```

### Frontend Mapping

The adapter maps messages to `CopilotMessage` entities:

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

The `CopilotConversation` entity preserves chronological ordering as returned by the backend.

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

The copilot section renders the access error state.

---

## Error — Malformed Response

The backend returns a 200 with an unexpected body shape (e.g., missing `messages` array, invalid role values, missing fields in message objects).

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

- Messages are returned in chronological order (oldest first). The frontend MUST NOT re-sort them.
- The conversation history is persisted server-side. The frontend displays whatever the backend returns.
- The frontend MUST NOT truncate or paginate conversation history in this iteration.
- Backend contract alignment is pending. The exact response shape, message fields, and pagination behavior may change during backend coordination.
