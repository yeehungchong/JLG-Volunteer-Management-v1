export const SHIFT_STATUSES = [
  'Draft',
  'Volunteer List Added',
  'Pending Reporting Officer Review',
  'Volunteers Selected',
  'Ready for Shift',
  'Pre-Shift Checklist Completed',
  'Shift In Progress',
  'Post-Shift Checklist Completed',
  'Pending Completion',
  'Completed',
  'Cancelled'
] as const;

export type ShiftStatus = (typeof SHIFT_STATUSES)[number];

export const ATTENDANCE_STATUSES = ['Pending', 'Checked In', 'Checked Out', 'Absent'] as const;
export const COMPLETION_STATUSES = ['Pending', 'Completed'] as const;
export const CHECKLIST_TYPES = ['PreShift', 'PostShift'] as const;
export const CHECKLIST_ITEM_STATUSES = ['Pending', 'Completed', 'Not Applicable'] as const;
