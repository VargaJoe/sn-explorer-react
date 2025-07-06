# Story 01: Navigation - Tree View

**As a user, I want to browse the content repository using a hierarchical tree view, so I can quickly navigate between folders and nested structures, just like in Windows File Explorer.**

## Acceptance Criteria
- The left sidebar displays a collapsible tree of folders and containers.
- Expanding a node loads its children on demand.
- Selecting a node updates the main content area to show its contents.
- The tree supports deep nesting and large hierarchies.
- The current path is highlighted and synchronized with the main view.

## Notes
- Should support all SenseNet container types (e.g., Folder, Workspace, ContentList, SmartFolder).
- Should be performant for large repositories.
