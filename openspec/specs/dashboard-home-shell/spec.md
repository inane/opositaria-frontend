## Purpose

The dashboard home shell provides the main layout shell for the `/dashboard` route. It renders a header with a burger menu control, a main content area that hosts the source ingestion experience, and a footer reserved area. It manages a single responsive side navigation that behaves as a desktop rail/expanded panel on viewports at or above `1024px` and as a mobile offcanvas overlay below `1024px`.

## Requirements

### Requirement: Root route redirects based on authentication state
The system SHALL redirect users who navigate to the root route `/` based on access-token presence.

#### Scenario: Unauthenticated user opens root route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the application redirects the user to `/login`

#### Scenario: Authenticated user opens root route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/`
- **THEN** the application redirects the user to `/dashboard`
- **AND** the dashboard home shell is displayed

### Requirement: Dashboard route renders the home shell
The system SHALL render the dashboard home shell when a user navigates to `/dashboard`.

#### Scenario: User opens dashboard route
- **GIVEN** a user is in the frontend application
- **WHEN** the user navigates to `/dashboard`
- **THEN** the application displays a dashboard shell
- **AND** the shell contains a header area
- **AND** the shell contains a main content area
- **AND** the shell contains a footer reserved area

### Requirement: Dashboard main content hosts source ingestion
The dashboard home shell SHALL render the existing source ingestion experience inside its main content area.

#### Scenario: User opens dashboard and sees source ingestion
- **GIVEN** a user is in the frontend application
- **WHEN** the user navigates to `/dashboard`
- **THEN** the dashboard main content displays the source ingestion experience
- **AND** the source ingestion upload UI keeps its existing title, source file section, upload control, and start ingestion action

#### Scenario: Source ingestion behavior remains unchanged in dashboard
- **GIVEN** a user is viewing `/dashboard`
- **WHEN** the user interacts with the source ingestion upload flow
- **THEN** the source ingestion validation, selected source display, start ingestion action, and status feedback behave as defined by the existing source ingestion module

### Requirement: Source ingestion has no standalone route
The system SHALL NOT expose `/source-ingestion` as a standalone application route while source ingestion is hosted by the dashboard.

#### Scenario: Application routes are configured
- **GIVEN** the frontend application routes are configured
- **WHEN** the route list is inspected
- **THEN** no route with path `source-ingestion` is configured
- **AND** source ingestion is reachable from `/dashboard`

### Requirement: Header exposes only the burger menu control
The dashboard home shell header SHALL expose a burger menu button aligned to the left as its only visible header control.

#### Scenario: Header is rendered
- **GIVEN** a user is viewing `/dashboard`
- **WHEN** the dashboard header is displayed
- **THEN** the header contains a burger menu button aligned to the left
- **AND** the header does not display additional header controls

#### Scenario: Burger button is accessible
- **GIVEN** a user is viewing `/dashboard`
- **WHEN** the dashboard header is displayed
- **THEN** the burger menu control is operable as a button
- **AND** the button exposes an accessible name for opening or closing the menu
- **AND** the button exposes whether the side menu is expanded or collapsed

### Requirement: Dashboard shell delegates side navigation rendering
The dashboard home shell SHALL delegate side navigation rendering to a dedicated `DashboardSideNavigationComponent` while retaining ownership of dashboard layout and local open/collapsed state.

#### Scenario: Shell renders side navigation through a child component
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the dashboard shell is rendered
- **THEN** the shell renders a dedicated dashboard side navigation component
- **AND** the shell still renders the header area
- **AND** the shell still renders the main routed content area
- **AND** the shell still renders the footer reserved area

#### Scenario: Shell owns navigation open state
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the user activates the burger menu button
- **THEN** the shell updates its local open/collapsed state
- **AND** the dedicated side navigation component receives the updated state
- **AND** the burger menu button exposes the matching expanded/collapsed state

#### Scenario: Side navigation component renders navigation item semantics
- **GIVEN** the dedicated side navigation component receives the collapsed or expanded state
- **WHEN** the side navigation is rendered
- **THEN** it exposes exactly one side navigation landmark
- **AND** it renders the `Inicio` navigation link to `/dashboard`
- **AND** it preserves the existing icon, visual label, accessible name, and current-page semantics

#### Scenario: Side navigation item selection notifies the shell
- **GIVEN** the dedicated side navigation component is rendered inside the dashboard shell
- **AND** the side navigation is open or expanded
- **WHEN** the user activates the `Inicio` navigation item
- **THEN** the side navigation component emits an item-selected event
- **AND** the shell closes or collapses the side navigation using its local state
- **AND** the application still navigates to `/dashboard`

#### Scenario: Responsive side navigation behavior is preserved after extraction
- **GIVEN** the dashboard side navigation has been extracted into a child component
- **WHEN** the dashboard is viewed below `1024px`
- **THEN** the side navigation still behaves as an offcanvas drawer with backdrop controlled by the shell
- **AND** when the dashboard is viewed at or above `1024px`
- **THEN** the side navigation still behaves as a collapsed icon rail or expanded panel beside the main content

#### Scenario: No new navigation routes or dependencies are introduced
- **GIVEN** the dashboard side navigation has been extracted into a child component
- **WHEN** the application dependencies and routes are inspected
- **THEN** no PrimeNG, PrimeIcons, or other icon/UI dependency is required
- **AND** no new dashboard navigation item or route is exposed beyond `Inicio` and `/dashboard`

### Requirement: Side navigation uses a single responsive sidebar structure
The dashboard home shell SHALL represent the side navigation with one responsive sidebar structure that changes presentation by viewport and open state, rather than rendering separate duplicated desktop and overlay navigation structures.

#### Scenario: Dashboard shell renders one side navigation landmark
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the dashboard shell is rendered
- **THEN** exactly one side navigation landmark is present for the dashboard menu
- **AND** the `Inicio` navigation item is represented in that single side navigation structure

#### Scenario: User opens navigation without duplicated menu content
- **GIVEN** a user is viewing `/dashboard`
- **WHEN** the user activates the hamburger button
- **THEN** the same side navigation structure changes to its opened presentation
- **AND** a second navigation panel containing duplicate `Inicio` content is not rendered

#### Scenario: Side navigation follows PrimeNG-inspired interaction pattern without dependency
- **GIVEN** the dashboard shell is implemented
- **WHEN** the side navigation behavior is inspected
- **THEN** it follows a custom PrimeNG-inspired sidebar pattern
- **AND** PrimeNG or PrimeIcons are not required as runtime dependencies for this change

### Requirement: Side navigation renders from a scalable item model
The dashboard home shell SHALL render its side navigation entries from a collection-shaped navigation model while exposing only the `Inicio` item until additional routes are defined.

#### Scenario: Side navigation exposes the current item
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the side navigation is rendered
- **THEN** the navigation contains exactly one visible navigation item named `Inicio`
- **AND** no future undefined navigation items are displayed

#### Scenario: Side navigation item exposes icon and label semantics
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the `Inicio` navigation item is rendered
- **THEN** the item exposes a home icon area as part of the selectable navigation target
- **AND** the item exposes `Inicio` as its accessible name

### Requirement: Inicio navigates to dashboard
The dashboard home shell SHALL expose `Inicio` as a real navigation link to `/dashboard` and SHALL mark it as the current page when the dashboard route is active.

#### Scenario: User activates Inicio
- **GIVEN** a user is viewing the dashboard home shell
- **WHEN** the user activates the `Inicio` navigation item
- **THEN** the application navigates to `/dashboard`
- **AND** the dashboard home shell remains displayed

#### Scenario: Inicio is active on dashboard
- **GIVEN** a user is viewing `/dashboard`
- **WHEN** the side navigation is rendered
- **THEN** the `Inicio` navigation item exposes current-page state

### Requirement: Desktop side navigation supports collapsed and expanded states
The dashboard home shell SHALL keep a left-side navigation rail available on viewports at or above `1024px` when the side navigation is collapsed and SHALL expand the same sidebar panel when the hamburger button is activated.

#### Scenario: Desktop navigation starts collapsed
- **GIVEN** a user opens `/dashboard` on a viewport at or above `1024px`
- **WHEN** the dashboard shell first renders
- **THEN** a compact left-side navigation rail is displayed
- **AND** the `Inicio` icon area is selectable
- **AND** the expanded `Inicio` text label is not visually presented as expanded panel content

#### Scenario: User expands desktop navigation
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is collapsed
- **WHEN** the user activates the hamburger button
- **THEN** the side navigation expands
- **AND** the `Inicio` item displays its icon and text label together
- **AND** the hamburger button exposes the expanded state

#### Scenario: User collapses desktop navigation
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is expanded
- **WHEN** the user activates the hamburger button
- **THEN** the side navigation collapses to the compact icon rail
- **AND** the hamburger button exposes the collapsed state

#### Scenario: Collapsed desktop navigation visually hides item labels
- **GIVEN** a user opens `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is collapsed
- **WHEN** the `Inicio` navigation item is displayed in the rail
- **THEN** the home icon is visually displayed as the primary selectable affordance
- **AND** the `Inicio` text label is not visually displayed in the collapsed rail
- **AND** the navigation item still exposes `Inicio` as its accessible name

#### Scenario: Desktop navigation animates between collapsed and expanded states
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **WHEN** the user expands or collapses the side navigation
- **THEN** the sidebar width changes with a short transition instead of an abrupt jump
- **AND** the visual label appears or disappears with a matching non-disruptive transition

#### Scenario: Collapsed desktop icon remains visually prominent
- **GIVEN** a user opens `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is collapsed
- **WHEN** the `Inicio` navigation item is displayed
- **THEN** the home icon is large enough to read clearly inside the compact rail
- **AND** the selectable target keeps the minimum touch target size

### Requirement: Desktop content reflows with side navigation
The dashboard home shell SHALL let the main content area reflow beside the left-side navigation on viewports at or above `1024px` instead of being covered by the side navigation.

#### Scenario: Desktop content uses remaining width while collapsed
- **GIVEN** a user opens `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is collapsed
- **WHEN** the dashboard shell is displayed
- **THEN** the main content area is laid out beside the compact navigation rail
- **AND** the main content is not covered by the navigation rail

#### Scenario: Desktop content uses remaining width while expanded
- **GIVEN** a user opens `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is expanded
- **WHEN** the dashboard shell is displayed
- **THEN** the main content area is laid out beside the expanded navigation panel
- **AND** the main content is not covered by the expanded navigation panel

### Requirement: Navigation item selection closes or collapses navigation
The dashboard home shell SHALL close mobile navigation overlays or collapse desktop side navigation after a navigation item is selected.

#### Scenario: Desktop item selection collapses navigation
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is expanded
- **WHEN** the user activates the `Inicio` navigation item
- **THEN** the application navigates to `/dashboard`
- **AND** the side navigation collapses to the compact icon rail

#### Scenario: Mobile item selection closes navigation
- **GIVEN** a user is viewing `/dashboard` on a viewport below `1024px`
- **AND** the side navigation drawer is open
- **WHEN** the user activates the `Inicio` navigation item
- **THEN** the application navigates to `/dashboard`
- **AND** the side navigation drawer closes
- **AND** the backdrop is no longer displayed

### Requirement: Burger menu opens a responsive side navigation with Inicio
The dashboard home shell SHALL use the burger menu button to reveal the side navigation. On viewports below `1024px`, it SHALL open the same sidebar as a lateral offcanvas overlay containing an `Inicio` entry. On viewports at or above `1024px`, it SHALL expand the same sidebar from a compact icon rail into a wider panel containing the `Inicio` icon and label.

#### Scenario: User opens the side menu on mobile
- **GIVEN** a user is viewing `/dashboard` on a viewport below `1024px`
- **AND** the side menu is closed
- **WHEN** the user activates the burger menu button
- **THEN** a lateral menu overlay is displayed
- **AND** the menu contains an `Inicio` entry
- **AND** the main dashboard content remains in place behind the overlay

#### Scenario: Mobile side menu starts closed
- **GIVEN** a user navigates to `/dashboard` on a viewport below `1024px`
- **WHEN** the dashboard shell first renders
- **THEN** the side menu overlay is not displayed

#### Scenario: User expands the side navigation on desktop
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is collapsed to its compact rail
- **WHEN** the user activates the burger menu button
- **THEN** the side navigation expands into a wider panel
- **AND** the panel contains an `Inicio` entry with icon and text
- **AND** the main dashboard content reflows beside the expanded panel

### Requirement: Side menu closes from the burger button or outside click
The dashboard home shell SHALL close the offcanvas side menu when the user activates the burger menu button while the menu is open or clicks outside the side menu panel on viewports below `1024px`. On viewports at or above `1024px`, the dashboard home shell SHALL collapse the expanded side navigation when the user activates the burger menu button or presses Escape.

#### Scenario: User closes the mobile side menu with the burger button
- **GIVEN** a user is viewing `/dashboard` on a viewport below `1024px`
- **AND** the side menu overlay is open
- **WHEN** the user activates the burger menu button
- **THEN** the side menu overlay is closed

#### Scenario: User closes the mobile side menu by clicking outside
- **GIVEN** a user is viewing `/dashboard` on a viewport below `1024px`
- **AND** the side menu overlay is open
- **WHEN** the user clicks outside the side menu panel
- **THEN** the side menu overlay is closed

#### Scenario: User clicks inside the open mobile side menu
- **GIVEN** a user is viewing `/dashboard` on a viewport below `1024px`
- **AND** the side menu overlay is open
- **WHEN** the user clicks inside the side menu panel
- **THEN** the side menu overlay remains open

#### Scenario: User collapses desktop side navigation with the burger button
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is expanded
- **WHEN** the user activates the burger menu button
- **THEN** the side navigation collapses to the compact icon rail

#### Scenario: User collapses desktop side navigation with Escape
- **GIVEN** a user is viewing `/dashboard` on a viewport at or above `1024px`
- **AND** the side navigation is expanded
- **WHEN** the user presses Escape
- **THEN** the side navigation collapses to the compact icon rail

### Requirement: Footer remains visually attached to the bottom
The dashboard home shell SHALL keep the reserved footer area visually attached to the bottom of the viewport when the dashboard content is shorter than the viewport.

#### Scenario: Dashboard content is short
- **GIVEN** a user is viewing `/dashboard`
- **AND** the main content area has less content than the available viewport height
- **WHEN** the dashboard shell is displayed
- **THEN** the footer reserved area is displayed at the bottom of the viewport
- **AND** the main content area grows to fill the space between the header and footer

#### Scenario: Dashboard content grows in the future
- **GIVEN** a user is viewing `/dashboard`
- **AND** future dashboard content exceeds the available viewport height
- **WHEN** the dashboard shell is displayed
- **THEN** the footer reserved area follows the content without overlapping it

### Requirement: Dashboard route requires authentication
The system SHALL prevent unauthenticated users from accessing the dashboard route.

#### Scenario: Unauthenticated user opens dashboard route
- **GIVEN** no access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system redirects the user to `/login`

#### Scenario: Authenticated user opens dashboard route
- **GIVEN** an access token exists in browser storage
- **WHEN** the user navigates to `/dashboard`
- **THEN** the system displays the dashboard
