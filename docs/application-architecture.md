# JLG Volunteer Management System Architecture

## 1) High-Level Architecture
- **Frontend (Web SPA)**: React + Firebase Auth UI + route guards by role.
- **Service Layer**: Typed TypeScript services in `src/services` for all Firestore writes.
- **Persistence**: Cloud Firestore with top-level collections and per-shift subcollections.
- **Authorization**: Firebase Security Rules (RBAC) + service-level permission checks.
- **Auditability**: centralized helpers write immutable records into `auditLogs`.

## 2) Modules
1. Volunteer Module
2. Shift Module
3. Checklist Module
4. User & Role Management Module
5. Audit Log Module
6. Reporting / Completion Module

## 3) Request Flow
1. UI calls service methods (e.g. `createShift`, `addIntendedVolunteer`).
2. Service validates payload and role eligibility.
3. Service executes transaction/batch for consistency-sensitive operations.
4. Service writes operational data with audit fields.
5. Service appends audit log entry for traceability.

## 4) Consistency-Sensitive Operations
- Shift status transitions
- Selecting volunteers
- Attendance check-in/check-out
- Checklist completion
- Shift completion

## 5) Security Layers
- **Layer A**: Route guard in frontend by user role.
- **Layer B**: Service-level role and workflow checks.
- **Layer C**: Firestore rules enforcement (authoritative).

## 6) Deployment Artifacts
- `firestore/firestore.rules`
- `firestore/firestore.indexes.json`
- `seeds/seedData.json`
- `src/services/*.ts`
- `src/utils/audit.ts`, `src/utils/permissions.ts`
