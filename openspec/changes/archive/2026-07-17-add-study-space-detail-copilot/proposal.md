## Why

Users can create and list study spaces, but selecting a space does not yet open a dedicated workspace where its documents can be managed and used for a persistent copilot conversation. The product model now treats a study space as the user's owned document container and interaction boundary, so the frontend must expose a space detail view that supports document lifecycle operations and chat-based interaction.

## What Changes

- Add navigation from each dashboard study-space card to `/dashboard/spaces/:spaceId`.
- Add a study-space detail view with a single split layout: document management on one side and copilot chat on the other.
- Load the selected space and its documents for the authenticated user, showing a not-permitted/not-found message when access is denied or the space cannot be found.
- Allow users to add documents to an existing study space using the current upload/process-first backend flow and then associating the ready document to the selected space.
- Allow users to delete documents individually after explicit confirmation; deleting the last document leaves the study space empty.
- Disable or block copilot interaction while documents are processing, and prevent copilot answers when the space has no processed documents.
- Add persistent per-space copilot chat with visible history, message sending, loading/error states, and conversation clearing.
- Preserve the existing create-space flow direction: upload/process the first document, then let the user name and save the study space.
- Document backend contract dependencies discovered during exploration: existing `GET /study-spaces`, `GET /study-spaces/{space_id}/documents`, and `GET /study-spaces/{space_id}/semantic-search`; missing detail, add-document, delete-document, and persistent conversation endpoints.

## Capabilities

### New Capabilities

- `study-space-detail`: Users can open an owned study space from the dashboard and see its detail page with documents and access-state handling.
- `study-space-document-management`: Users can add documents to an existing study space and delete documents individually without deleting the space.
- `study-space-copilot`: Users can interact with a persistent copilot conversation scoped to one study space.

### Modified Capabilities

- None.

## Non-goals

- Do not implement backend changes in this frontend change; backend gaps are contract dependencies to coordinate separately.
- Do not implement document sharing, collaborative spaces, or cross-user access.
- Do not allow creating an empty study space as the initial creation path; the first document remains required before naming the space.
- Do not add citations/sources to copilot responses in this iteration.
- Do not make the copilot perform actions such as renaming spaces, adding documents, or deleting documents; copilot is text conversation only.
- Do not support one document belonging to multiple study spaces.
- Do not add pagination, sorting, or bulk actions for documents.

## Impact

- Affected frontend workspace/modules:
  - `dashboard`: make study-space cards navigable and preserve the first-document-then-name creation flow.
  - New or extended `study-spaces`/detail module under `src/app`: domain entities, repository ports, use cases, HTTP adapters, route-scoped store services, and UI components for detail, documents, and copilot.
  - `source-ingestion`: reuse or adapt upload/progress UI for adding documents to existing spaces without changing its existing responsibility boundaries.
  - `auth`: existing guard/token flow continues to protect dashboard routes.
  - `shared`: optional reuse of layout, upload, status, confirmation, and feedback UI primitives.
- Backend/API dependencies:
  - Existing: `GET /study-spaces`, `GET /study-spaces/{space_id}/documents`, `GET /study-spaces/{space_id}/semantic-search`.
  - Required or to be confirmed: `GET /study-spaces/{space_id}`, `POST /study-spaces/{space_id}/documents`, `DELETE /study-spaces/{space_id}/documents/{document_id}`, `GET /study-spaces/{space_id}/conversation`, `POST /study-spaces/{space_id}/conversation/messages`, `DELETE /study-spaces/{space_id}/conversation`.
  - Contract alignment needed: initial upload should support the existing frontend flow `upload document -> process -> name space -> POST /study-spaces`, while the inspected backend currently requires `study_space_name` during upload.
- Testing impact:
  - Unit tests for domain rules and use cases.
  - Store and adapter tests for loading, mutation, and error states.
  - Component tests for navigation, layout, confirmation, blocked states, and chat behavior.
  - Playwright e2e coverage for the critical dashboard-to-detail, add document, delete document, and copilot journeys.
