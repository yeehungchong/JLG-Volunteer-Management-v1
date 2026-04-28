# JLG Volunteer Management System (Firebase Firestore)

Production-ready backend-first scaffold for managing volunteers, shifts, checklists, attendance, status workflow, and audit trails.

## Implemented Deliverables
1. **Firestore data model**: `docs/data-model.md`, typed entities in `src/types/models.ts`
2. **Firestore Security Rules**: `firestore/firestore.rules`
3. **Application architecture**: `docs/application-architecture.md`
4. **Folder structure**: `docs/folder-structure.md`
5. **Backend service layer**: `src/services/volunteerService.ts`, `src/services/shiftService.ts`
6. **Frontend screens/components plan**: `src/screens/screenRegistry.ts`
7. **Role-based permission logic**: `src/utils/permissions.ts`
8. **Audit helper functions**: `src/utils/audit.ts`
9. **Seed data**: `seeds/seedData.json`, `scripts/seed.ts`
10. **Example Firestore documents**: `docs/sample-documents.json`
11. **Maintainable TypeScript project layout** with strict typing and validation utilities.

## Setup
```bash
npm install
npm run lint
npm run build
npm run seed
```

## Role Hierarchy
`System Administrator > Volunteer Leader > Reporting Officer > Duty Officer / Shift Officer > Volunteer`

## Workflow Coverage
- Shift creation and intended volunteer addition
- Reporting officer selection and role assignment
- Email notification status marking
- Pre-shift and post-shift checklist progression
- Check-in/check-out attendance
- Shift completion with validation guards
- Audit log entry for major actions
