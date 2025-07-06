# Implementation Tasks - SenseNet Explorer React

A Windows Explorer-like content manager for SenseNet CMS, supporting all SenseNet content types and modern ECM features.

---

## Completed Stories

### Initial Project Setup
- [x] Create React app with TypeScript
- [x] Add Material-UI for UI components
- [x] Integrate SenseNet client
- [x] Set up router for navigation
- [x] Implement TreeExplorer (sidebar navigation)
- [x] Implement ContentList (main content area)
- [x] Implement ActionToolbar (top action bar)
- [x] Add responsive layout and theming
- [x] Add breadcrumb navigation
- [x] Add loading states and icons
- [x] Implement OIDC authentication (login/logout UI)
- [x] Remove deprecated local authentication code
- [x] Add authentication guide documentation

---

## In Progress Stories

### Story 01: Navigation - Tree View
- [ ] Display hierarchical tree of folders and containers
- [ ] Expand/collapse nodes and load children on demand
- [ ] Sync selection with main content area
- [ ] Highlight current path

### Story 02: Navigation - Breadcrumbs
- [ ] Show breadcrumb navigation bar
- [ ] Each segment is clickable
- [ ] Sync with tree and main view

### Story 03: Content Listing
- [ ] List all items in selected container
- [ ] Show name, type, icon, modified date, etc.
- [ ] Support all SenseNet content types
- [ ] Double-click to navigate into folders
- [ ] Sorting and basic filtering

---

## Planned Stories

### Story 04: Search
- [ ] Add search bar to main view
- [ ] Search by name, type, metadata
- [ ] Update content list and highlight matches

### Story 05: File and Folder Operations (CRUD)
- [ ] Context menu and toolbar actions (create, rename, move, copy, delete)
- [ ] Drag & drop for move/copy
- [ ] Confirmation dialogs for destructive actions
- [ ] Real-time UI updates

### Story 06: File Preview and Details
- [ ] Preview pane or modal for supported file types
- [ ] Details panel for metadata, version, permissions
- [ ] Support all SenseNet content types

### Story 07: Permissions and Sharing
- [ ] UI to view/manage permissions and sharing
- [ ] Grant/revoke access to users/groups
- [ ] Show effective permissions

### Story 08: Trash / Recycle Bin
- [ ] Move deleted items to trash
- [ ] Trash accessible from navigation
- [ ] Restore or permanently delete from trash
- [ ] Bulk restore/delete

### Story 09: Bulk Actions
- [ ] Multi-select in content list
- [ ] Bulk operations in toolbar/context menu
- [ ] Progress and error reporting

### Story 10: Support for All SenseNet Content Types
- [ ] UI supports all major SenseNet content types
- [ ] Creation dialogs/forms adapt to type
- [ ] Icons and metadata reflect type
- [ ] Filtering/search across all types

### Story 11: Dynamic Content Type Handling and Custom Views
- [ ] Detect and support new or custom content types at runtime
- [ ] Fetch and render custom fields/metadata for any content type
- [ ] Dynamically generate browse and edit views based on type schema
- [ ] Allow setting different default views (list, grid, form, preview) per content type
- [ ] Provide extensibility for future content types and custom editors
