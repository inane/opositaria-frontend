## ADDED Requirements

### Requirement: User can view persistent copilot history for a study space
The system SHALL display the persisted copilot conversation history for the selected study space.

#### Scenario: Existing conversation history is displayed
- **GIVEN** an authenticated user owns a study space with a previous copilot conversation
- **WHEN** the user opens the study space detail page
- **THEN** the copilot section displays the persisted conversation history
- **AND** messages are shown in chronological order

#### Scenario: Empty conversation displays start state
- **GIVEN** an authenticated user owns a study space with no previous copilot messages
- **WHEN** the user opens the study space detail page
- **THEN** the copilot section displays an empty conversation state
- **AND** the user can start a conversation when copilot is available

#### Scenario: Conversation load failure is recoverable
- **GIVEN** an authenticated user opens an owned study space detail page
- **WHEN** the conversation history cannot be loaded
- **THEN** the copilot section displays an error message
- **AND** the user can retry loading the conversation

### Requirement: User can send messages to the study-space copilot
The system SHALL allow an authenticated user to send a text message to a copilot scoped to the selected study space when copilot is available.

#### Scenario: Copilot answers a user message
- **GIVEN** an authenticated user owns a study space with at least one processed document
- **AND** no documents in the study space are processing
- **WHEN** the user sends a non-blank message in the copilot section
- **THEN** the system appends the user message to the conversation
- **AND** the system displays a loading state while waiting for the copilot answer
- **AND** the system appends the copilot answer when it arrives

#### Scenario: Blank message is not sent
- **GIVEN** an authenticated user is viewing an available copilot section
- **WHEN** the user tries to send a blank message
- **THEN** the system does not submit the message
- **AND** the conversation history remains unchanged

#### Scenario: Copilot send failure keeps typed context recoverable
- **GIVEN** an authenticated user sends a message to the study-space copilot
- **WHEN** the backend fails to return an answer
- **THEN** the system displays a recoverable error message
- **AND** the user can retry sending a message without losing the displayed conversation history

### Requirement: Copilot availability depends on document state
The system SHALL prevent copilot interaction when the study space has no processed document context or when any document is processing.

#### Scenario: Empty space cannot answer
- **GIVEN** an authenticated user owns a study space with no documents
- **WHEN** the user opens the study space detail page
- **THEN** the copilot input is disabled
- **AND** the copilot section explains that documents are required before asking questions

#### Scenario: No processed documents cannot answer
- **GIVEN** an authenticated user owns a study space with documents that are not processed
- **WHEN** the user opens the study space detail page
- **THEN** the copilot input is disabled
- **AND** the copilot section explains that processed documents are required before asking questions

#### Scenario: Processing documents block copilot with loading state
- **GIVEN** an authenticated user owns a study space with at least one processing document
- **WHEN** the user opens the study space detail page
- **THEN** the copilot input is disabled
- **AND** the copilot section displays a loading state until processing completes or fails

#### Scenario: Copilot becomes available after processing completes
- **GIVEN** an authenticated user owns a study space with a processing document
- **WHEN** the document status changes to processed
- **AND** the document list refreshes
- **THEN** the copilot input becomes available

### Requirement: User can clear the study-space conversation
The system SHALL allow an authenticated user to delete the persistent copilot conversation for the selected study space.

#### Scenario: Confirmed conversation clear removes history
- **GIVEN** an authenticated user owns a study space with copilot history
- **WHEN** the user requests to clear the conversation
- **AND** the user confirms the action
- **THEN** the system deletes the persisted conversation history for that study space
- **AND** the copilot section returns to the empty conversation state

#### Scenario: Cancelled conversation clear keeps history
- **GIVEN** an authenticated user owns a study space with copilot history
- **WHEN** the user requests to clear the conversation
- **AND** the user cancels the action
- **THEN** the system keeps the conversation history unchanged

#### Scenario: Clear conversation failure preserves history
- **GIVEN** an authenticated user owns a study space with copilot history
- **WHEN** clearing the conversation fails
- **THEN** the system displays an error message
- **AND** the existing conversation history remains visible

### Requirement: Copilot respects study-space ownership
The system SHALL rely on authenticated backend authorization and MUST NOT expose copilot history or answers for study spaces that do not belong to the current user.

#### Scenario: Foreign conversation is hidden
- **GIVEN** an authenticated user attempts to open another user's study-space copilot history
- **WHEN** the backend rejects or hides the space
- **THEN** the system displays a not-permitted or not-found message
- **AND** no foreign conversation messages are displayed

#### Scenario: Foreign copilot message is rejected
- **GIVEN** an authenticated user attempts to send a message to another user's study-space copilot
- **WHEN** the backend rejects the operation
- **THEN** the system displays a safe error message
- **AND** no foreign copilot answer is displayed
