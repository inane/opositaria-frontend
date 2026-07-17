## Context

The Angular application already has an authenticated dashboard at `/dashboard`, a `StudySpace` summary model, a `DashboardStore`, and a `SourceIngestionComponent` that uploads a PDF and polls processing status. The dashboard currently supports a create flow where a document is uploaded first and the user names the study space after the document reaches `DONE`, then `POST /study-spaces` is called with `{ name, document_ids }`.

Backend exploration found these existing endpoints and behaviors:

- `GET /study-spaces` lists spaces owned by the authenticated user.
- `POST /study-spaces` creates a named space from ready owned documents.
- `GET /study-spaces/{space_id}/documents` lists documents in an owned space.
- `GET /study-spaces/{space_id}/semantic-search` performs space-scoped semantic search.
- There is no confirmed `GET /study-spaces/{space_id}` detail endpoint.
- There is no confirmed endpoint to add a ready document to an existing space.
- There is no confirmed endpoint to delete a document from a space.
- There is no confirmed persistent copilot conversation API.
- The backend currently appears to require `study_space_name` during `POST /study-documents/upload`, while the desired frontend flow names the space after processing.

The change is frontend-focused but must encode these backend contract assumptions clearly so implementation can proceed behind adapters and test doubles while real backend endpoints are aligned separately.

## Goals / Non-Goals

**Goals:**

- Add `/dashboard/spaces/:spaceId` as the authenticated detail route for one study space.
- Keep dashboard cards as summaries and navigate to the detail route on click.
- Represent study-space detail, document summaries, document processing state, and copilot conversation state in domain/application terms.
- Use repository ports and HTTP adapters for all backend communication.
- Keep store services as route/page-scoped state wrappers that expose domain-meaningful signals and methods.
- Reuse the existing first-document-then-name creation flow as the intended product flow.
- Allow adding documents to an existing space using upload/process/associate semantics.
- Allow deleting documents with confirmation, including the last document while preserving the space.
- Add a persistent per-space copilot chat UI with history, send, loading, error, and clear conversation behavior.
- Block copilot interaction when documents are processing or no processed documents are available.

**Non-Goals:**

- Backend implementation, migrations, or API contract changes in this frontend repository.
- Copilot citations/sources.
- Copilot actions that mutate the space or documents.
- Multi-user sharing or collaboration.
- Empty-space creation as an initial flow.
- Bulk document operations, document pagination, or advanced document filtering.

## Decisions

### Decision 1: Route detail under the authenticated dashboard

Use `/dashboard/spaces/:spaceId` for the study-space detail view. The route remains protected by the existing dashboard `AuthGuard` through the parent route.

**Rationale:** The dashboard is the authenticated workspace where spaces are listed. Nesting detail under `/dashboard` preserves the user's mental model and reuses existing auth routing.

**Alternative considered: `/study-spaces/:spaceId`.** This is shorter but creates a second authenticated route tree and duplicates guard/layout concerns.

### Decision 2: Introduce a dedicated study-space detail vertical slice

Create or extend a business module dedicated to study-space detail behavior, with this shape:

```text
src/app/study-spaces/
  domain/
    entities/
      StudySpaceDetail.ts
      StudySpaceDocument.ts
      CopilotConversation.ts
      CopilotMessage.ts
    repositories/
      StudySpaceDetailRepository.ts
      StudySpaceDocumentRepository.ts
      StudySpaceCopilotRepository.ts
  application/
    GetStudySpaceDetailUseCase.ts
    ListStudySpaceDocumentsUseCase.ts
    AddDocumentToStudySpaceUseCase.ts
    DeleteStudySpaceDocumentUseCase.ts
    GetStudySpaceConversationUseCase.ts
    SendStudySpaceCopilotMessageUseCase.ts
    ClearStudySpaceConversationUseCase.ts
  infrastructure/
    adapters/
      HttpStudySpaceDetailAdapter.ts
      HttpStudySpaceDocumentAdapter.ts
      HttpStudySpaceCopilotAdapter.ts
    store/
      study-space-detail-store.service.ts
      study-space-documents-store.service.ts
      study-space-copilot-store.service.ts
    ui/
      study-space-detail-page.component.ts
      study-space-documents-panel.component.ts
      study-space-copilot-panel.component.ts
```

**Rationale:** The dashboard module is currently a summary list and creation entry point. Detail, document management, and copilot are distinct business capabilities and should not turn `DashboardStore` into a God object.

**Alternative considered: put everything under `dashboard`.** This is faster initially but would mix list, create, detail, document mutations, and chat state in one module.

### Decision 3: Keep dashboard responsible only for summary navigation and creation entry

Dashboard cards should render as accessible navigable cards/buttons/links to the detail route. After creating a space, the UI should navigate to the created space detail when the created space ID is available; otherwise it should refresh the list and remain in the dashboard as a graceful fallback.

**Rationale:** This keeps the existing dashboard focused and creates a clean handoff to the detail page.

**Alternative considered: render detail inside the dashboard component conditionally.** This would complicate route state, browser history, and direct linking.

### Decision 4: Treat backend contracts as repository adapter responsibilities

The domain/application layers use repository methods with product-language semantics:

- `getById(spaceId)`
- `listDocuments(spaceId)`
- `addReadyDocument(spaceId, documentId)`
- `deleteDocument(spaceId, documentId)`
- `getConversation(spaceId)`
- `sendMessage(spaceId, message)`
- `clearConversation(spaceId)`

HTTP adapters map these to backend endpoints. Missing backend endpoints are isolated behind adapters and InMemory repositories so use cases and UI can be specified/tested without leaking HTTP details.

**Rationale:** Backend gaps were found during exploration. Ports allow TDD and frontend design to proceed while keeping contract differences explicit and localized.

**Alternative considered: call `HttpClient` directly from stores.** This violates the hexagonal boundary and makes backend contract churn leak into UI state.

### Decision 5: Model document processing as a blocker for copilot input

The detail page derives a `copilotAvailability` state from document summaries:

- `available` when there is at least one processed/ready document and no document is processing.
- `processing` when any document is pending/processing.
- `empty` when there are no documents.
- `no-ready-documents` when documents exist but none are ready and none are processing.

The UI renders a loading/blocking state for `processing` and disables sending for every non-available state.

**Rationale:** The user explicitly asked for the UI to block with loading while documents process. Preventing chat without processed documents avoids misleading answers.

**Alternative considered: allow chat against ready documents while other documents process.** This is more permissive but conflicts with the requested loading/blocking behavior and adds complexity about partial context.

### Decision 6: Add-document flow reuses upload/process, then associates the ready document

For existing spaces, the frontend should follow:

```text
select file
  -> upload document
  -> poll status until ready
  -> associate ready document with current space
  -> refresh documents and detail summary
```

This requires a backend association endpoint such as `POST /study-spaces/{space_id}/documents` with a ready `document_id`, or a backend-provided equivalent. The UI remains in the detail page and shows document-processing state.

**Rationale:** The current system already supports asynchronous upload/status. Associating only ready documents matches the existing `POST /study-spaces` rule.

**Alternative considered: one endpoint `POST /study-spaces/{space_id}/documents` uploads, processes, and associates.** This is cleaner for frontend but does not match the currently described backend flow.

### Decision 7: Delete document requires explicit confirmation and never deletes the space

The document panel must ask for confirmation before deletion. After a successful delete, the store refreshes documents and the study-space summary. If the deleted document was the last document, the space remains visible with zero documents and copilot becomes unavailable.

**Rationale:** Deletion removes the document from the space and database storage, so confirmation protects against destructive mistakes. The user explicitly decided that empty spaces are allowed after deletion.

**Alternative considered: prevent deleting the last document.** This contradicts the accepted business rule.

### Decision 8: Persistent copilot is a separate port from semantic search

The frontend should model copilot conversation as a dedicated repository, even though backend semantic search may be reused internally later. The copilot contract should be conversation-oriented rather than search-oriented:

```http
GET    /study-spaces/{space_id}/conversation
POST   /study-spaces/{space_id}/conversation/messages
DELETE /study-spaces/{space_id}/conversation
```

**Rationale:** Semantic search returns chunks; copilot returns conversational messages and persists history. Keeping the port conversation-oriented prevents the UI from depending on a temporary search implementation.

**Alternative considered: use `GET /study-spaces/{space_id}/semantic-search` directly as copilot.** This could power a temporary prototype but would not satisfy persistent chat/history/clear requirements.

### Decision 9: Use route-scoped store services for detail state

Provide detail stores at the route/page level rather than globally. Stores expose domain-level signals such as `isLoading()`, `documents()`, `hasProcessingDocuments()`, `canSendMessage()`, and `accessError()`.

**Rationale:** Detail state is tied to the active route parameter and should be discarded when leaving the page. Store services are state wrappers, not global mutable state.

**Alternative considered: global singleton stores.** Global stores risk stale selected-space state across users/routes and are unnecessary for page-scoped data.

### Decision 10: Use accessible native confirmation initially

Use an accessible confirmation interaction for document deletion. If the project already has a shared confirmation/dialog primitive by implementation time, use it; otherwise, introduce a small shared confirmation UI under `shared/infrastructure/ui` with focus management and keyboard support.

**Rationale:** The requirement is behavioral, not tied to a specific design system component. Accessibility matters more than UI novelty.

**Alternative considered: browser `confirm()`.** It is simple but hard to test, style, and integrate accessibly with Angular state.

## Risks / Trade-offs

- Backend contract mismatch for initial upload → Keep the frontend proposal aligned with the desired product flow and isolate HTTP assumptions in adapters; coordinate backend changes separately.
- Missing backend endpoints for detail/add/delete/conversation → Implement adapters against agreed contracts and use InMemory repositories in tests; mark backend dependency clearly before implementation.
- Empty spaces conflict with backend `StudySpace.create` requiring documents → Treat this as a backend rule change dependency for deletion behavior; frontend must render empty spaces once backend allows them.
- Copilot blocked while any document processes may frustrate users with existing ready documents → This follows the requested behavior; revisit later if partial-context chat becomes desired.
- Dashboard and detail may duplicate space summary state → Use detail loading as source of truth on detail page and refresh dashboard list only when returning or after create.
- Long-running processing can leave UI blocked indefinitely → Show clear loading text and recovery/error messaging when polling times out or status cannot be refreshed.
- Conversation persistence can grow large → This iteration displays whatever the backend returns; pagination or truncation is out of scope.

## Migration Plan

1. Add frontend detail routes under `dashboard.routes.ts` without removing the existing dashboard list route.
2. Keep existing dashboard create flow functional.
3. Make cards navigate to the new detail route.
4. Implement detail page against repository ports and adapters with graceful errors for unavailable backend endpoints.
5. Coordinate backend contract alignment for missing endpoints before enabling full end-to-end flows against a real backend.
6. Add e2e tests with controlled backend fixtures or test server responses for the critical user journeys.

Rollback strategy:

- Revert the route/card navigation to keep users on the existing dashboard list.
- Since the change is frontend-only, rollback does not require data migration.
- If backend endpoints are partially available, adapters can temporarily return user-facing unavailable messages while preserving existing dashboard behavior.

## Open Questions

- Exact backend response shape for `GET /study-spaces/{space_id}`.
- Exact backend response shape and status codes for adding and deleting documents in an existing space.
- Exact backend copilot endpoint shape, including message IDs, roles, timestamps, and error payloads.
- Whether successful create-space should always navigate directly to detail or only when backend returns the created ID reliably.
- Whether document upload for add-to-existing-space will eventually include the target `space_id` at upload time or remain upload-then-associate.
