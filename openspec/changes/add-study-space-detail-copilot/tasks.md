## 1. Backend Contract Alignment Preparation

- [x] 1.1 Document the exact frontend API contract needed for `GET /study-spaces/{spaceId}` with success, 401, 404/not-permitted, and malformed-response cases.
- [x] 1.2 Document the exact frontend API contract needed for `POST /study-spaces/{spaceId}/documents` using a ready `document_id`.
- [x] 1.3 Document the exact frontend API contract needed for `DELETE /study-spaces/{spaceId}/documents/{documentId}` including last-document deletion.
- [x] 1.4 Document the exact frontend API contract needed for `GET /study-spaces/{spaceId}/conversation`.
- [x] 1.5 Document the exact frontend API contract needed for `POST /study-spaces/{spaceId}/conversation/messages`.
- [x] 1.6 Document the exact frontend API contract needed for `DELETE /study-spaces/{spaceId}/conversation`.
- [x] 1.7 Document the contract mismatch for initial upload naming: desired frontend flow is upload/process first, then user names the space via `POST /study-spaces`.
- [x] 1.8 Confirm whether the existing frontend `HttpSourceIngestionAdapter` must change immediately or remain as-is until backend alignment is completed.

## 2. Study Space Detail Domain

- [x] 2.1 RED write failing unit test for `StudySpaceDetail` creating a valid owned space detail with id, title, document count, and creation date → GREEN implement minimal entity → COMMIT `test: cover study space detail creation` → REFACTOR.
- [x] 2.2 RED write failing unit test for `StudySpaceDetail` rejecting blank titles → GREEN implement validation → COMMIT `feat: validate study space detail title` → REFACTOR.
- [x] 2.3 RED write failing unit test for `StudySpaceDetail` allowing zero documents → GREEN implement zero-document support → COMMIT `feat: allow empty study space detail` → REFACTOR.
- [x] 2.4 RED write failing unit test for `StudySpaceDocument` creating a document summary with filename, status, chunks count, and timestamps → GREEN implement minimal entity → COMMIT `test: cover study space document summary` → REFACTOR.
- [x] 2.5 RED write failing unit test for `StudySpaceDocument` deriving processing state from pending/processing statuses → GREEN implement domain helper → COMMIT `feat: derive processing document state` → REFACTOR.
- [x] 2.6 RED write failing unit test for `StudySpaceDocument` deriving processed-ready state from ready/done statuses used by backend/frontend → GREEN implement domain helper → COMMIT `feat: derive ready document state` → REFACTOR.
- [x] 2.7 RED write failing unit test for `StudySpaceDocument` rejecting negative chunk counts → GREEN implement validation → COMMIT `feat: validate document chunk count` → REFACTOR.
- [x] 2.8 RED write failing unit test for a domain helper deriving copilot availability as `empty` when no documents exist → GREEN implement helper → COMMIT `feat: detect empty copilot availability` → REFACTOR.
- [x] 2.9 RED write failing unit test for copilot availability as `processing` when any document is processing → GREEN implement helper → COMMIT `feat: block copilot while documents process` → REFACTOR.
- [x] 2.10 RED write failing unit test for copilot availability as `no-ready-documents` when documents exist but none are ready → GREEN implement helper → COMMIT `feat: detect missing ready copilot context` → REFACTOR.
- [x] 2.11 RED write failing unit test for copilot availability as `available` when at least one document is ready and none are processing → GREEN implement helper → COMMIT `feat: allow copilot with ready documents` → REFACTOR.
- [x] 2.12 RED write failing unit test for `CopilotMessage` creating valid user and assistant messages with timestamps → GREEN implement minimal entity → COMMIT `test: cover copilot message creation` → REFACTOR.
- [x] 2.13 RED write failing unit test for `CopilotMessage` rejecting blank content → GREEN implement validation → COMMIT `feat: validate copilot message content` → REFACTOR.
- [x] 2.14 RED write failing unit test for `CopilotConversation` preserving chronological messages → GREEN implement conversation entity → COMMIT `feat: model copilot conversation history` → REFACTOR.
- [x] 2.15 Add repository port and InMemory implementation for `StudySpaceDetailRepository` without behavior beyond contract shape.
- [x] 2.16 Add repository port and InMemory implementation for `StudySpaceDocumentRepository` without behavior beyond contract shape.
- [x] 2.17 Add repository port and InMemory implementation for `StudySpaceCopilotRepository` without behavior beyond contract shape.

## 3. Study Space Detail Application Use Cases

- [x] 3.1 RED write failing use-case test for loading an owned study-space detail by id using `InMemoryStudySpaceDetailRepository` → GREEN implement `GetStudySpaceDetailUseCase` → COMMIT `feat: load study space detail` → REFACTOR.
- [x] 3.2 RED write failing use-case test for translating missing/not-permitted space to a safe domain error → GREEN implement error mapping → COMMIT `feat: handle inaccessible study space detail` → REFACTOR.
- [x] 3.3 RED write failing use-case test for listing documents of an owned study space using `InMemoryStudySpaceDocumentRepository` → GREEN implement `ListStudySpaceDocumentsUseCase` → COMMIT `feat: list study space documents` → REFACTOR.
- [x] 3.4 RED write failing use-case test for returning an empty list for an owned empty space → GREEN implement empty result handling → COMMIT `feat: support empty study space documents` → REFACTOR.
- [x] 3.5 RED write failing use-case test for adding a ready document id to a study space → GREEN implement `AddDocumentToStudySpaceUseCase` → COMMIT `feat: add ready document to study space` → REFACTOR.
- [x] 3.6 RED write failing use-case test for rejecting add-document when repository reports inaccessible space → GREEN implement error path → COMMIT `feat: handle inaccessible document add` → REFACTOR.
- [x] 3.7 RED write failing use-case test for deleting one document from a study space → GREEN implement `DeleteStudySpaceDocumentUseCase` → COMMIT `feat: delete study space document` → REFACTOR.
- [x] 3.8 RED write failing use-case test for allowing deletion of the last document without deleting the space → GREEN implement last-document semantics → COMMIT `feat: keep empty space after document deletion` → REFACTOR.
- [x] 3.9 RED write failing use-case test for loading copilot conversation history → GREEN implement `GetStudySpaceConversationUseCase` → COMMIT `feat: load study space copilot history` → REFACTOR.
- [x] 3.10 RED write failing use-case test for sending a non-blank message and receiving updated conversation → GREEN implement `SendStudySpaceCopilotMessageUseCase` → COMMIT `feat: send study space copilot message` → REFACTOR.
- [x] 3.11 RED write failing use-case test for rejecting blank copilot messages before repository call → GREEN implement validation → COMMIT `feat: reject blank copilot messages` → REFACTOR.
- [x] 3.12 RED write failing use-case test for clearing conversation history → GREEN implement `ClearStudySpaceConversationUseCase` → COMMIT `feat: clear study space copilot history` → REFACTOR.

## 4. HTTP Adapters and DTO Mapping

- [x] 4.1 RED write failing adapter test for `HttpStudySpaceDetailAdapter` mapping `GET /study-spaces/{spaceId}` success to `StudySpaceDetail` → GREEN implement minimal adapter → COMMIT `feat: add study space detail http adapter` → REFACTOR.
- [x] 4.2 RED write failing adapter test for `HttpStudySpaceDetailAdapter` mapping 404 to safe inaccessible-space error → GREEN implement error mapping → COMMIT `feat: map study space detail errors` → REFACTOR.
- [x] 4.3 RED write failing adapter test for fallback detail loading from `GET /study-spaces` only if dedicated endpoint is unavailable and agreed → GREEN implement or explicitly skip fallback per contract decision → COMMIT `feat: handle study space detail contract fallback` → REFACTOR.
- [x] 4.4 RED write failing adapter test for `HttpStudySpaceDocumentAdapter` mapping `GET /study-spaces/{spaceId}/documents` success → GREEN implement list mapping → COMMIT `feat: add study space documents http adapter` → REFACTOR.
- [x] 4.5 RED write failing adapter test for document list 404/not-permitted mapping → GREEN implement error mapping → COMMIT `feat: map study space document list errors` → REFACTOR.
- [x] 4.6 RED write failing adapter test for `POST /study-spaces/{spaceId}/documents` with `document_id` → GREEN implement add-document adapter → COMMIT `feat: add document association adapter` → REFACTOR.
- [x] 4.7 RED write failing adapter test for add-document conflict/unready error mapping → GREEN implement recoverable error mapping → COMMIT `feat: map add document errors` → REFACTOR.
- [x] 4.8 RED write failing adapter test for `DELETE /study-spaces/{spaceId}/documents/{documentId}` → GREEN implement delete adapter → COMMIT `feat: add document delete adapter` → REFACTOR.
- [x] 4.9 RED write failing adapter test for delete failure/not-permitted mapping → GREEN implement delete error mapping → COMMIT `feat: map document delete errors` → REFACTOR.
- [x] 4.10 RED write failing adapter test for `HttpStudySpaceCopilotAdapter` mapping `GET /study-spaces/{spaceId}/conversation` success → GREEN implement conversation load mapping → COMMIT `feat: add copilot conversation adapter` → REFACTOR.
- [x] 4.11 RED write failing adapter test for `POST /study-spaces/{spaceId}/conversation/messages` body and response mapping → GREEN implement send-message adapter → COMMIT `feat: add copilot send adapter` → REFACTOR.
- [x] 4.12 RED write failing adapter test for `DELETE /study-spaces/{spaceId}/conversation` → GREEN implement clear adapter → COMMIT `feat: add copilot clear adapter` → REFACTOR.
- [x] 4.13 RED write failing adapter test for copilot 404/401/service error mapping → GREEN implement safe error mapping → COMMIT `feat: map copilot adapter errors` → REFACTOR.

## 5. Route-Scoped Stores

- [x] 5.1 RED write failing store test for initializing study-space detail loading from a route-provided space id → GREEN implement `StudySpaceDetailStore` init/load behavior → COMMIT `feat: add study space detail store` → REFACTOR.
- [x] 5.2 RED write failing store test for exposing detail loading, loaded, and inaccessible states through domain signals → GREEN implement readonly signal wrappers → COMMIT `feat: expose study space detail state` → REFACTOR.
- [x] 5.3 RED write failing store test for retrying detail load after failure → GREEN implement retry method → COMMIT `feat: retry study space detail load` → REFACTOR.
- [x] 5.4 RED write failing store test for loading documents and deriving `hasProcessingDocuments` → GREEN implement `StudySpaceDocumentsStore` → COMMIT `feat: add study space documents store` → REFACTOR.
- [x] 5.5 RED write failing store test for refreshing documents after successful add → GREEN implement add-document refresh behavior → COMMIT `feat: refresh documents after add` → REFACTOR.
- [x] 5.6 RED write failing store test for preserving current document list when add association fails → GREEN implement recoverable error state → COMMIT `feat: handle add document store errors` → REFACTOR.
- [x] 5.7 RED write failing store test for requiring deletion confirmation intent before delete execution → GREEN implement pending-delete state → COMMIT `feat: track pending document deletion` → REFACTOR.
- [x] 5.8 RED write failing store test for refreshing documents after confirmed delete → GREEN implement delete refresh behavior → COMMIT `feat: refresh documents after delete` → REFACTOR.
- [x] 5.9 RED write failing store test for last-document delete yielding empty documents and unavailable copilot state → GREEN implement derived state refresh → COMMIT `feat: update empty state after last delete` → REFACTOR.
- [x] 5.10 RED write failing store test for loading copilot conversation history → GREEN implement `StudySpaceCopilotStore` load behavior → COMMIT `feat: add study space copilot store` → REFACTOR.
- [x] 5.11 RED write failing store test for disabling send when availability is not `available` → GREEN implement `canSendMessage` derived signal → COMMIT `feat: derive copilot send availability` → REFACTOR.
- [x] 5.12 RED write failing store test for sending a message and exposing pending answer state → GREEN implement send behavior → COMMIT `feat: manage copilot send state` → REFACTOR.
- [x] 5.13 RED write failing store test for keeping history visible on send failure → GREEN implement send error state → COMMIT `feat: preserve copilot history on send failure` → REFACTOR.
- [x] 5.14 RED write failing store test for clearing conversation after confirmation → GREEN implement clear behavior → COMMIT `feat: clear copilot conversation from store` → REFACTOR.
- [x] 5.15 RED write failing store test for preserving history on clear failure → GREEN implement clear error state → COMMIT `feat: preserve copilot history on clear failure` → REFACTOR.

## 6. Routing and Provider Wiring

- [x] 6.1 Add plain route configuration for `/dashboard/spaces/:spaceId` under `dashboard.routes.ts`.
- [x] 6.2 Add route-scoped providers for study-space detail use cases, repositories, adapters, and stores.
- [x] 6.3 RED write failing route spec for dashboard index route still rendering `StudySpacesDashboardComponent` → GREEN update routes → COMMIT `feat: preserve dashboard index route` → REFACTOR.
- [x] 6.4 RED write failing route spec for `/dashboard/spaces/:spaceId` resolving to detail page component → GREEN wire detail route → COMMIT `feat: add study space detail route` → REFACTOR.
- [x] 6.5 RED write failing component/navigation test for card activation navigating to detail route → GREEN update dashboard card semantics → COMMIT `feat: navigate from dashboard to study space detail` → REFACTOR.
- [x] 6.6 RED write failing test for accessible card/link labeling with study-space title → GREEN implement accessible card action → COMMIT `feat: make study space cards accessible links` → REFACTOR.
- [x] 6.7 RED write failing store/component test for navigating to created space after successful save when created id is available → GREEN update create-save result handling → COMMIT `feat: navigate to created study space` → REFACTOR.
- [x] 6.8 RED write failing test for fallback behavior when created id is unavailable → GREEN keep dashboard refresh fallback → COMMIT `feat: fallback after study space creation` → REFACTOR.

## 7. Detail Page UI Components

- [x] 7.1 RED write failing component test for `StudySpaceDetailPageComponent` showing loading state before detail data loads → GREEN implement minimal page shell → COMMIT `feat: add study space detail page shell` → REFACTOR.
- [x] 7.2 RED write failing component test for rendering study-space name after load → GREEN render header → COMMIT `feat: render study space detail header` → REFACTOR.
- [x] 7.3 RED write failing component test for rendering not-found/not-permitted state without documents or copilot → GREEN implement access error view → COMMIT `feat: render inaccessible study space state` → REFACTOR.
- [x] 7.4 RED write failing component test for offering return-to-dashboard action in access error view → GREEN implement action → COMMIT `feat: add return action for inaccessible spaces` → REFACTOR.
- [x] 7.5 RED write failing component test for rendering document and copilot panels in one view → GREEN compose panels → COMMIT `feat: compose study space workspace panels` → REFACTOR.
- [x] 7.6 RED write failing responsive/component test for preserving logical order documents then copilot → GREEN implement layout classes → COMMIT `feat: layout study space workspace` → REFACTOR.

## 8. Document Management UI

- [x] 8.1 RED write failing component test for `StudySpaceDocumentsPanelComponent` listing document filename and status → GREEN implement list rendering → COMMIT `feat: render study space documents` → REFACTOR.
- [x] 8.2 RED write failing component test for empty documents message → GREEN implement empty state → COMMIT `feat: render empty documents state` → REFACTOR.
- [x] 8.3 RED write failing component test for document load error and retry button → GREEN implement error state → COMMIT `feat: render document list retry state` → REFACTOR.
- [x] 8.4 RED write failing component test for opening add-document upload control → GREEN implement add-document entry UI → COMMIT `feat: add document upload entry` → REFACTOR.
- [x] 8.5 RED write failing component/store integration test for selecting supported file and starting upload/process → GREEN integrate existing source ingestion flow or extracted upload component → COMMIT `feat: start add document ingestion` → REFACTOR.
- [x] 8.6 RED write failing component test for showing processing progress while adding a document → GREEN render progress/loading state → COMMIT `feat: show add document processing state` → REFACTOR.
- [x] 8.7 RED write failing component/store test for associating done document id with current space → GREEN wire add-document use case after processing → COMMIT `feat: associate uploaded document with study space` → REFACTOR.
- [x] 8.8 RED write failing component test for unsupported file validation message → GREEN render validation → COMMIT `feat: validate add document file type` → REFACTOR.
- [x] 8.9 RED write failing component test for failed processing message → GREEN render failure → COMMIT `feat: render add document processing failure` → REFACTOR.
- [x] 8.10 RED write failing component test for association failure retry affordance → GREEN render recoverable association error → COMMIT `feat: render add document association failure` → REFACTOR.
- [x] 8.11 RED write failing component test for delete button per document with accessible label → GREEN render delete controls → COMMIT `feat: add document delete controls` → REFACTOR.
- [x] 8.12 RED write failing component test for delete confirmation opening with document filename → GREEN implement confirmation UI → COMMIT `feat: confirm document deletion` → REFACTOR.
- [x] 8.13 RED write failing component test for cancelling deletion preserving document list → GREEN wire cancel → COMMIT `feat: cancel document deletion` → REFACTOR.
- [x] 8.14 RED write failing component/store test for confirming deletion calling delete and refreshing list → GREEN wire confirm → COMMIT `feat: confirm and execute document deletion` → REFACTOR.
- [x] 8.15 RED write failing component test for last-document deletion showing empty state → GREEN render post-delete empty state → COMMIT `feat: show empty state after last document deletion` → REFACTOR.
- [x] 8.16 RED write failing component test for delete failure message and retry path → GREEN render recoverable delete error → COMMIT `feat: render document delete failure` → REFACTOR.

## 9. Copilot UI

- [x] 9.1 RED write failing component test for `StudySpaceCopilotPanelComponent` rendering empty conversation state → GREEN implement empty state → COMMIT `feat: render empty copilot conversation` → REFACTOR.
- [x] 9.2 RED write failing component test for rendering user and assistant messages chronologically → GREEN implement message list → COMMIT `feat: render copilot history` → REFACTOR.
- [x] 9.3 RED write failing component test for conversation load error and retry button → GREEN implement retry state → COMMIT `feat: render copilot history retry state` → REFACTOR.
- [x] 9.4 RED write failing component test for disabling input in empty-space availability → GREEN implement disabled state and explanatory copy → COMMIT `feat: disable copilot for empty spaces` → REFACTOR.
- [x] 9.5 RED write failing component test for disabling input when no documents are ready → GREEN implement unavailable copy → COMMIT `feat: disable copilot without ready documents` → REFACTOR.
- [x] 9.6 RED write failing component test for blocking input with loading state while documents process → GREEN implement processing block → COMMIT `feat: block copilot while processing` → REFACTOR.
- [x] 9.7 RED write failing component test for enabling input when availability is `available` → GREEN implement enabled input → COMMIT `feat: enable copilot for ready spaces` → REFACTOR.
- [x] 9.8 RED write failing component test for not sending blank messages → GREEN implement trim/validation → COMMIT `feat: prevent blank copilot sends` → REFACTOR.
- [x] 9.9 RED write failing component/store test for sending non-blank message and showing pending answer state → GREEN wire send action → COMMIT `feat: send copilot messages from UI` → REFACTOR.
- [x] 9.10 RED write failing component test for appending assistant response after send completes → GREEN render updated conversation → COMMIT `feat: append copilot responses` → REFACTOR.
- [x] 9.11 RED write failing component test for send failure preserving visible history and showing retry-safe error → GREEN implement error rendering → COMMIT `feat: render copilot send failure` → REFACTOR.
- [x] 9.12 RED write failing component test for clear conversation button only when history exists → GREEN render clear action → COMMIT `feat: add clear copilot action` → REFACTOR.
- [x] 9.13 RED write failing component test for clear conversation confirmation → GREEN implement confirmation UI → COMMIT `feat: confirm copilot history clearing` → REFACTOR.
- [x] 9.14 RED write failing component/store test for confirmed clear returning to empty state → GREEN wire clear action → COMMIT `feat: clear copilot history from UI` → REFACTOR.
- [x] 9.15 RED write failing component test for cancelled clear preserving history → GREEN wire cancel → COMMIT `feat: cancel copilot history clearing` → REFACTOR.
- [x] 9.16 RED write failing component test for clear failure pr eserving history and showing error → GREEN implement clear error state → REFACTOR.

## 10. Accessibility, Styling, and UX Polish

- [x] 10.1 RED write failing accessibility-oriented component test for meaningful page heading and landmarks → GREEN add semantic structure → COMMIT `feat: improve study space detail semantics` → REFACTOR.
- [x] 10.2 RED write failing test for focus moving to confirmation dialog/action area when deleting a document → GREEN implement focus handling → COMMIT `feat: manage focus for document deletion` → REFACTOR.
- [x] 10.3 RED write failing test for keyboard cancellation/confirmation in confirmation UI → GREEN implement keyboard behavior → COMMIT `feat: support keyboard confirmation actions` → REFACTOR.
- [x] 10.4 RED write failing test for visible status messages using alert/status roles where appropriate → GREEN add ARIA roles → COMMIT `feat: announce study space status messages` → REFACTOR.
- [x] 10.5 Apply scoped CSS using project tokens, rem units, flex layout, and no utility frameworks.
- [x] 10.6 Verify responsive behavior at mobile and desktop widths with document panel before copilot in logical reading order.
- [x] 10.7 Verify all buttons have accessible names, especially card navigation, delete document, send message, retry, and clear conversation actions.

## 11. Playwright E2E Journeys

- [x] 11.1 RED write failing Playwright e2e for dashboard card navigation to `/dashboard/spaces/:spaceId` → GREEN satisfy route and UI behavior → COMMIT `test: cover dashboard to study space detail journey` → REFACTOR.
- [x] 11.2 RED write failing Playwright e2e for direct detail route loading owned space with documents → GREEN satisfy load behavior → COMMIT `test: cover direct study space detail loading` → REFACTOR.
- [x] 11.3 RED write failing Playwright e2e for foreign/missing space showing safe error → GREEN satisfy access error behavior → COMMIT `test: cover inaccessible study space detail` → REFACTOR.
- [x] 11.4 RED write failing Playwright e2e for adding a document through upload/process/associate → GREEN satisfy add-document journey → COMMIT `test: cover add document to study space` → REFACTOR.
- [x] 11.5 RED write failing Playwright e2e for deleting one document after confirmation → GREEN satisfy deletion journey → COMMIT `test: cover document deletion from study space` → REFACTOR.
- [x] 11.6 RED write failing Playwright e2e for deleting last document and seeing empty-space/copilot-unavailable state → GREEN satisfy empty-space journey → COMMIT `test: cover last document deletion` → REFACTOR.
- [x] 11.7 RED write failing Playwright e2e for loading copilot history and sending a message → GREEN satisfy copilot journey → COMMIT `test: cover study space copilot conversation` → REFACTOR.
- [x] 11.8 RED write failing Playwright e2e for clearing copilot conversation after confirmation → GREEN satisfy clear journey → COMMIT `test: cover clearing copilot conversation` → REFACTOR.
- [x] 11.9 RED write failing Playwright e2e for processing document blocking copilot input → GREEN satisfy blocked-state journey → COMMIT `test: cover copilot blocked while processing` → REFACTOR.

## 12. Final Validation and Review

- [x] 12.1 Run all targeted unit tests for study-space detail domain and application.
- [x] 12.2 Run all targeted adapter/store/component tests for study-space detail, documents, dashboard navigation, and copilot.
- [x] 12.3 Run all Playwright e2e tests added for this change.
- [x] 12.4 Run `/task-validate` and fix any compile, lint, format, or test failures with TDD discipline.
- [x] 12.6 Run `/task-architecture-review` and fix hexagonal boundary violations.
- [x] 12.7 Run `/task-testing-review` and fix missing or low-quality test coverage.
- [x] 12.8 Run `/task-frontend-review` and fix Angular/frontend pattern violations.
- [x] 12.9 Verify no backend repository files were modified by this frontend implementation.
- [x] 12.10 Verify `openspec status --change add-study-space-detail-copilot` reports the change apply-ready or complete according to the workflow.
- [x] 12.11 Commit all changes with a conventional commit message summarizing the implemented study-space detail and copilot capability.
