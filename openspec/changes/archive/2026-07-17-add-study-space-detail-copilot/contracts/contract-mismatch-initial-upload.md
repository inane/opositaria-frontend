# Contract Mismatch: Initial Upload Naming

## Current Frontend Flow (Desired)

The frontend implements a first-document-then-name creation flow:

1. User uploads a PDF via `SourceIngestionComponent`.
2. The upload calls `POST /study-documents/upload` with only the file (no space name).
3. The document is processed asynchronously.
4. When processing completes (`DONE` status), the user is prompted to name the study space.
5. The user enters a name and calls `POST /study-spaces` with `{ name, document_ids: [readyDocumentId] }`.

This flow is implemented in `SaveStudySpaceUseCase` and `HttpStudySpaceAdapter.createStudySpace()`.

## Backend Behavior (Discovered)

The backend currently requires `study_space_name` during the `POST /study-documents/upload` call. This means the space name must be provided at upload time, not after processing.

## Mismatch Summary

| Aspect                  | Frontend Desired Flow                    | Backend Current Behavior              |
| ----------------------- | ---------------------------------------- | ------------------------------------- |
| Space name at upload    | Not required                             | Required (`study_space_name` field)   |
| Space creation timing   | After document processing                | At or before upload                    |
| Document association    | `POST /study-spaces` with `document_ids` | Implicit at upload time               |
| Empty space creation    | Not supported (first doc required)       | Not supported (name required at upload) |

## Impact on This Change

- The detail page add-document flow (upload/process/then associate) assumes the document can be uploaded without a space name and later associated via `POST /study-spaces/{spaceId}/documents`.
- If the backend requires `study_space_name` at upload time, the add-document flow for existing spaces may need to pass the space name during upload.
- This mismatch MUST be resolved with the backend team before the add-document feature can be fully tested against a real backend.

## Frontend Strategy

The frontend will implement the desired flow behind repository ports and HTTP adapters:

1. Upload via `POST /study-documents/upload` (no space name).
2. Poll status until `DONE`.
3. Associate via `POST /study-spaces/{spaceId}/documents` with the ready `document_id`.

If the backend requires `study_space_name` at upload time, the adapter will need to be updated to pass the space name. The domain and application layers remain unchanged because the port contract (`addReadyDocument(spaceId, documentId)`) is stable.

## Resolution Required

- Confirm with backend team whether `study_space_name` is required at upload time for the add-to-existing-space flow.
- If required, decide whether the frontend should pass the space name at upload time or the backend should allow upload without a name for existing-space association.
- Document the agreed contract before implementing the HTTP adapter.
