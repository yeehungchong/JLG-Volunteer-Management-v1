import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { ROLE_PRIORITY, ROLES, type Role } from '../constants/roles.js';

export interface CurrentUser {
  uid: string;
  displayName: string;
  email: string;
  roles: Role[];
  status: 'Active' | 'Inactive';
}

export async function getCurrentUser(uid: string): Promise<CurrentUser> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    throw new Error('User profile not found.');
  }
  const data = snap.data() as Omit<CurrentUser, 'uid'>;
  return { uid, ...data };
}

export function checkUserRole(user: CurrentUser, role: Role): boolean {
  return user.roles.includes(role);
}

export function hasMinimumRole(user: CurrentUser, minimumRole: Role): boolean {
  const currentMax = Math.max(...user.roles.map((r) => ROLE_PRIORITY[r] ?? 0));
  return currentMax >= ROLE_PRIORITY[minimumRole];
}

export function canAccessShift(user: CurrentUser, shiftOwnerUserId: string, assignedUserIds: string[]): boolean {
  if (checkUserRole(user, ROLES.SYSTEM_ADMINISTRATOR)) return true;
  if (user.uid === shiftOwnerUserId) return true;
  return assignedUserIds.includes(user.uid);
}

export function canUpdateShiftStatus(user: CurrentUser, toStatus: string): boolean {
  if (checkUserRole(user, ROLES.SYSTEM_ADMINISTRATOR)) return true;

  if (toStatus === 'Pending Reporting Officer Review') {
    return checkUserRole(user, ROLES.VOLUNTEER_LEADER);
  }
  if (toStatus === 'Volunteers Selected' || toStatus === 'Completed' || toStatus === 'Pending Completion') {
    return checkUserRole(user, ROLES.REPORTING_OFFICER);
  }
  if (toStatus === 'Pre-Shift Checklist Completed' || toStatus === 'Shift In Progress') {
    return checkUserRole(user, ROLES.DUTY_OFFICER) || checkUserRole(user, ROLES.SHIFT_OFFICER);
  }
  return false;
}
