## ADDED Requirements

### Requirement: User can open an owned study space detail view
The system SHALL allow an authenticated user to open a study space from the dashboard and view a dedicated detail page for that space.

#### Scenario: Dashboard card opens study space detail
- **GIVEN** an authenticated user is viewing the dashboard
- **AND** the dashboard contains a study space owned by the user
- **WHEN** the user activates that study-space card
- **THEN** the system navigates to `/dashboard/spaces/{spaceId}`
- **AND** the detail page loads the selected study space

#### Scenario: Detail route can be opened directly
- **GIVEN** an authenticated user owns a study space
- **WHEN** the user opens `/dashboard/spaces/{spaceId}` directly
- **THEN** the system loads the selected study space detail page
- **AND** the page displays the study space name

#### Scenario: Dashboard list remains summary-only
- **GIVEN** an authenticated user is viewing the dashboard
- **WHEN** the system renders study-space cards
- **THEN** each card displays summary information
- **AND** document details and copilot history are not rendered inside the dashboard list

### Requirement: Detail page shows documents and copilot in one view
The system SHALL render the selected study space as a single page containing a document management area and a copilot area.

#### Scenario: Detail page renders split workspace
- **GIVEN** an authenticated user opens an owned study space detail page
- **WHEN** the study space data loads successfully
- **THEN** the page displays a documents section
- **AND** the page displays a copilot section in the same view

#### Scenario: Empty space is visible
- **GIVEN** an authenticated user owns a study space with no documents
- **WHEN** the user opens the study space detail page
- **THEN** the documents section shows an empty-state message
- **AND** the study space remains visible
- **AND** the copilot section explains that processed documents are required before asking questions

### Requirement: Detail page handles access denial and missing spaces safely
The system SHALL show a safe error state when the selected study space cannot be accessed by the current user.

#### Scenario: Foreign space is not accessible
- **GIVEN** an authenticated user tries to open a study space that belongs to another user
- **WHEN** the backend rejects or hides the study space
- **THEN** the page displays a not-permitted or not-found message
- **AND** no foreign study-space documents or conversation messages are displayed

#### Scenario: Missing space shows not found
- **GIVEN** an authenticated user opens `/dashboard/spaces/{spaceId}` for a missing study space
- **WHEN** the backend reports that the study space does not exist
- **THEN** the page displays a not-found message
- **AND** the page offers a way to return to the dashboard

#### Scenario: Expired session is handled
- **GIVEN** the user's session has expired
- **WHEN** the user opens a study space detail route
- **THEN** the system prevents access to protected study-space data
- **AND** the user is guided back to authentication according to the existing auth behavior

### Requirement: Created study spaces preserve the first-document-then-name flow
The system SHALL keep the creation flow where the first document is uploaded and processed before the user names and saves the study space.

#### Scenario: User names space after first document is ready
- **GIVEN** an authenticated user starts creating a new study space
- **AND** the user uploads the first document
- **WHEN** the document processing status becomes done
- **THEN** the system asks the user for the study-space name
- **AND** the system saves the study space using the ready document identifier

#### Scenario: Blank name is rejected during create flow
- **GIVEN** an authenticated user has a processed first document pending save
- **WHEN** the user tries to save the study space with a blank name
- **THEN** the system displays a validation message
- **AND** the pending document remains available for saving

#### Scenario: Backend rejects unready first document
- **GIVEN** an authenticated user has uploaded a first document
- **WHEN** the user tries to save the study space before the backend considers the document ready
- **THEN** the system displays a recoverable message
- **AND** the create flow remains open
