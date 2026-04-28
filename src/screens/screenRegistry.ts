export interface ScreenDefinition {
  key: string;
  title: string;
  route: string;
  module:
    | 'Auth'
    | 'Dashboard'
    | 'Volunteer'
    | 'Shift'
    | 'Checklist'
    | 'Reporting'
    | 'UserRole'
    | 'Audit';
}

export const SCREENS: ScreenDefinition[] = [
  { key: 'login', title: 'Login', route: '/login', module: 'Auth' },
  { key: 'dashboard', title: 'Dashboard', route: '/', module: 'Dashboard' },
  { key: 'volunteer-list', title: 'Volunteer List', route: '/volunteers', module: 'Volunteer' },
  { key: 'volunteer-detail', title: 'Volunteer Detail', route: '/volunteers/:id', module: 'Volunteer' },
  { key: 'volunteer-edit', title: 'Create / Edit Volunteer', route: '/volunteers/:id/edit', module: 'Volunteer' },
  { key: 'shift-list', title: 'Shift List', route: '/shifts', module: 'Shift' },
  { key: 'shift-detail', title: 'Shift Detail', route: '/shifts/:id', module: 'Shift' },
  { key: 'shift-edit', title: 'Create / Edit Shift', route: '/shifts/:id/edit', module: 'Shift' },
  { key: 'add-intended-volunteers', title: 'Add Intended Volunteers', route: '/shifts/:id/intended-volunteers', module: 'Shift' },
  { key: 'reporting-review', title: 'Reporting Officer Review', route: '/shifts/:id/review', module: 'Reporting' },
  { key: 'selected-volunteer-list', title: 'Selected Volunteer List', route: '/shifts/:id/selected-volunteers', module: 'Reporting' },
  { key: 'pre-shift-checklist', title: 'Pre-Shift Checklist', route: '/shifts/:id/checklists/pre', module: 'Checklist' },
  { key: 'checkin-checkout', title: 'Check-In / Check-Out', route: '/shifts/:id/attendance', module: 'Shift' },
  { key: 'post-shift-checklist', title: 'Post-Shift Checklist', route: '/shifts/:id/checklists/post', module: 'Checklist' },
  { key: 'shift-completion', title: 'Shift Completion', route: '/shifts/:id/completion', module: 'Reporting' },
  { key: 'checklist-template-management', title: 'Checklist Template Management', route: '/checklist-templates', module: 'Checklist' },
  { key: 'user-role-management', title: 'User & Role Management', route: '/admin/users', module: 'UserRole' },
  { key: 'audit-log-viewer', title: 'Audit Log Viewer', route: '/admin/audit-logs', module: 'Audit' }
];
