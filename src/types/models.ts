import type { Role } from '../constants/roles.js';
import type { ShiftStatus } from '../constants/statuses.js';

export interface AuditFields {
  CreatedBy: string;
  CreatedAt: unknown;
  UpdatedBy: string;
  UpdatedAt: unknown;
}

export interface UserDoc extends AuditFields {
  userId: string;
  displayName: string;
  email: string;
  roles: Role[];
  status: 'Active' | 'Inactive';
}

export interface VolunteerDoc extends AuditFields {
  volunteerId: string;
  fullName: string;
  contactNumbers: string[];
  emailAddresses: string[];
  race: string;
  experienceLevel: string;
  skills: string[];
  certifications: string[];
  status: 'Active' | 'Inactive';
  remarks?: string;
}

export interface ShiftDoc extends AuditFields {
  shiftId: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  description?: string;
  status: ShiftStatus;
  createdByUserId: string;
  emailNotificationStatus: 'Not Sent' | 'Sent';
  emailNotificationSentAt?: Date;
  emailNotificationSentBy?: string;
}

export interface AuditLogDoc extends AuditFields {
  auditLogId: string;
  entityType: string;
  entityId: string;
  action:
    | 'Create'
    | 'Update'
    | 'Delete'
    | 'Status Change'
    | 'Check In'
    | 'Check Out'
    | 'Checklist Completed';
  performedBy: string;
  performedAt: unknown;
  beforeData?: unknown;
  afterData?: unknown;
  remarks?: string;
}
