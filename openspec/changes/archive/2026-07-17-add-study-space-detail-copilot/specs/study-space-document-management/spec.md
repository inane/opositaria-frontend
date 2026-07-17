## ADDED Requirements

### Requirement: User can list documents in a study space detail page
The system SHALL display documents that belong to the selected owned study space.

#### Scenario: Documents load for owned space
- **GIVEN** an authenticated user owns a study space with documents
- **WHEN** the user opens the study space detail page
- **THEN** the documents section lists the study-space documents
- **AND** each document shows its filename and processing status

#### Scenario: Processing documents are visible
- **GIVEN** an authenticated user owns a study space with a processing document
- **WHEN** the user opens the study space detail page
- **THEN** the documents section shows that the document is processing
- **AND** the copilot section is blocked with a loading state

#### Scenario: Document list failure is recoverable
- **GIVEN** an authenticated user opens an owned study space detail page
- **WHEN** the document list cannot be loaded
- **THEN** the documents section displays an error message
- **AND** the page offers a way to retry loading documents

### Requirement: User can add a document to an existing study space
The system SHALL allow an authenticated user to upload and process a document, then associate the ready document with the selected study space.

#### Scenario: Ready uploaded document is added to selected space
- **GIVEN** an authenticated user is viewing an owned study space detail page
- **WHEN** the user uploads a supported document
- **AND** the document processing status becomes done
- **AND** the backend associates the ready document with the current study space
- **THEN** the documents section includes the new document
- **AND** the study-space document count is refreshed

#### Scenario: Add document waits for processing
- **GIVEN** an authenticated user uploads a document from a study space detail page
- **WHEN** the backend reports the document is pending or processing
- **THEN** the page displays a processing state
- **AND** the document is not presented as ready for copilot interaction yet

#### Scenario: Unsupported document is rejected before upload
- **GIVEN** an authenticated user is viewing a study space detail page
- **WHEN** the user selects an unsupported file type
- **THEN** the system displays a validation message
- **AND** the system does not attempt to add the file to the study space

#### Scenario: Failed processing does not add document to ready list
- **GIVEN** an authenticated user uploads a document from a study space detail page
- **WHEN** document processing fails
- **THEN** the system displays the failure state
- **AND** the failed document is not treated as processed context for copilot

#### Scenario: Association failure is recoverable
- **GIVEN** an authenticated user uploads a document from a study space detail page
- **AND** the document processing status becomes done
- **WHEN** associating the ready document with the study space fails
- **THEN** the system displays a recoverable error message
- **AND** the page remains on the same study space detail view

### Requirement: User can delete documents individually
The system SHALL allow an authenticated user to delete one document from a study space after confirmation.

#### Scenario: Confirmed document deletion removes document
- **GIVEN** an authenticated user is viewing an owned study space with documents
- **WHEN** the user requests to delete one document
- **AND** the user confirms the deletion
- **THEN** the system deletes that document from the study space and backend storage
- **AND** the documents section no longer lists the deleted document

#### Scenario: Cancelled document deletion keeps document
- **GIVEN** an authenticated user is viewing an owned study space with documents
- **WHEN** the user requests to delete one document
- **AND** the user cancels the confirmation
- **THEN** the system keeps the document
- **AND** the documents section remains unchanged

#### Scenario: Last document deletion leaves empty space
- **GIVEN** an authenticated user owns a study space with exactly one document
- **WHEN** the user confirms deletion of that document
- **THEN** the document is removed
- **AND** the study space remains available with zero documents
- **AND** the copilot section becomes unavailable because there are no processed documents

#### Scenario: Delete failure preserves document in UI after refresh
- **GIVEN** an authenticated user is viewing an owned study space with documents
- **WHEN** deleting a document fails
- **THEN** the system displays an error message
- **AND** the system does not show the deletion as successful
- **AND** the user can retry the deletion

### Requirement: Document management respects ownership
The system SHALL rely on authenticated backend authorization and MUST NOT expose documents from study spaces that do not belong to the current user.

#### Scenario: Foreign document management is blocked
- **GIVEN** an authenticated user attempts to manage documents in another user's study space
- **WHEN** the backend rejects the operation
- **THEN** the system displays a not-permitted or not-found message
- **AND** no foreign document data is displayed

#### Scenario: User cannot delete a document outside selected owned space
- **GIVEN** an authenticated user is viewing one owned study space
- **WHEN** a delete operation is attempted for a document that does not belong to that space
- **THEN** the backend rejects the operation
- **AND** the system displays a safe error message
