export const ROLES = {
  SYSTEM_ADMINISTRATOR: 'System Administrator',
  VOLUNTEER_LEADER: 'Volunteer Leader',
  REPORTING_OFFICER: 'Reporting Officer',
  DUTY_OFFICER: 'Duty Officer',
  SHIFT_OFFICER: 'Shift Officer',
  VOLUNTEER: 'Volunteer'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_PRIORITY: Record<Role, number> = {
  [ROLES.SYSTEM_ADMINISTRATOR]: 100,
  [ROLES.VOLUNTEER_LEADER]: 80,
  [ROLES.REPORTING_OFFICER]: 60,
  [ROLES.DUTY_OFFICER]: 40,
  [ROLES.SHIFT_OFFICER]: 40,
  [ROLES.VOLUNTEER]: 20
};
