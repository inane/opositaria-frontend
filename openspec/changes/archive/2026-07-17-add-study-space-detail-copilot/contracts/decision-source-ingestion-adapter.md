# Decision: HttpSourceIngestionAdapter Change Timing

## Current Adapter Behavior

`HttpSourceIngestionAdapter` has two methods:

- `start(sourceFile)`: Sends `POST /study-documents/upload` with `FormData` containing only the file. Returns `IngestionJob` with `document_id` and `status`.
- `status(jobId)`: Polls `GET /study-documents/{jobId}/status`. Returns `IngestionJob` with updated status.

The adapter does NOT send `study_space_name` at upload time. The existing dashboard create flow relies on this: upload first, name the space later via `POST /study-spaces`.

## Add-Document-to-Existing-Space Flow

The new detail page requires:

1. Upload document (existing `start()` — no change needed).
2. Poll status until `DONE` (existing `status()` — no change needed).
3. Associate ready document with space (new `POST /study-spaces/{spaceId}/documents` — separate adapter).

## Decision: Remain As-Is

**The existing `HttpSourceIngestionAdapter` does NOT need to change immediately.** It can remain as-is until backend alignment is completed.

### Rationale

- The `start()` method already uploads without a space name, which matches the desired add-to-existing-space flow.
- The `status()` method already polls for processing completion, which is needed for both create and add-to-existing flows.
- The new association endpoint (`POST /study-spaces/{spaceId}/documents`) is a separate adapter in the study-spaces module, not a modification to the source-ingestion adapter.
- If the backend later requires `study_space_name` at upload time for the create flow, only the dashboard's create flow adapter (not the source-ingestion adapter) would need updating.

### What Changes

- A new `HttpStudySpaceDocumentAdapter` will be created in the study-spaces module to handle `POST /study-spaces/{spaceId}/documents` (association).
- The source-ingestion adapter remains unchanged.
- The `SourceIngestionComponent` may be reused or adapted in the detail page, but the adapter itself does not change.

### Risks

- If the backend requires `study_space_name` at upload time for ALL uploads (not just create), the `start()` method would need a parameter addition. This should be confirmed during backend contract alignment.
- The frontend should be prepared to add an optional `studySpaceName` parameter to `start()` if the backend requires it, but this is a backward-compatible change.
