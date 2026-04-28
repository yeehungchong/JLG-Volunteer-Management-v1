# Firestore Data Model

## Collections
- `users`
- `volunteers`
- `shifts`
  - `shiftVolunteers` (subcollection)
  - `shiftChecklists` (subcollection)
  - `statusHistory` (subcollection)
- `checklistTemplates`
  - `items` (subcollection)
- `auditLogs`

## Shared audit metadata (required in every document)
- `CreatedBy`
- `CreatedAt`
- `UpdatedBy`
- `UpdatedAt`

## Validation Constraints
- Shift end must be after shift start.
- Volunteer emails and contact numbers validated.
- Cannot check out before check in.
- Cannot complete shift before post-shift checklist.
- Cannot update completed/cancelled shifts unless System Administrator.
- Cannot select inactive volunteers.
