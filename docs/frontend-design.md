# Frontend Design (Web SPA)

## UX Goals
- Fast shift workflow for role-based users.
- Minimal-click completion for duty operations (checklist, check-in/out).
- Strong visibility of current shift status and next allowed action.

## Information Architecture
- **Login**
- **Dashboard** (role-specific widgets)
- **Volunteers**: list, detail, create/edit
- **Shifts**: list, detail, create/edit, intended volunteers
- **Reporting**: review queue, selected volunteers, shift completion
- **Operations**: pre-checklist, attendance, post-checklist
- **Admin**: checklist templates, user/role management, audit log viewer

## Layout System
- Persistent left navigation by role.
- Top app bar with current user, role chip, quick-search, and alerts.
- Main content area uses responsive card/table layout.

## Core Components
- `AppShell` (navigation and top bar)
- `ProtectedRoute` (auth + role gate)
- `StatusPill` (shift/attendance/checklist status)
- `AuditTimeline` (statusHistory rendering)
- `ChecklistForm` (pre/post template-driven items)
- `VolunteerSelector` (filter by skill/race/experience/availability)

## Role-driven Dashboard Widgets
- **System Administrator**: user count, active shifts, audit anomalies.
- **Volunteer Leader**: drafts, pending review, email-notification backlog.
- **Reporting Officer**: shifts waiting for review and pending completion.
- **Duty/Shift Officer**: today’s assignments and attendance actions.

## State Management
- Firebase Auth observer for session.
- Firestore listeners for real-time shift updates.
- Thin page-level state; service layer handles validations and writes.

## Accessibility & Responsiveness
- WCAG-friendly contrast and keyboard access.
- Mobile-first checklist and attendance pages.
- Desktop-optimized table views for reporting/audit screens.
