import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { ROLES } from '../constants/roles.js';
import type { ShiftStatus } from '../constants/statuses.js';
import { writeAuditLog } from '../utils/audit.js';
import { canUpdateShiftStatus, getCurrentUser } from '../utils/permissions.js';
import { validateCheckOut, validateShiftDateRange } from '../utils/validators.js';
import { ensureVolunteerActive } from './volunteerService.js';

export async function createShift(
  payload: {
    shiftId: string;
    title: string;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    description?: string;
  },
  userId: string
): Promise<void> {
  validateShiftDateRange(payload.startDateTime, payload.endDateTime);

  const user = await getCurrentUser(userId);
  if (!user.roles.includes(ROLES.VOLUNTEER_LEADER) && !user.roles.includes(ROLES.SYSTEM_ADMINISTRATOR)) {
    throw new Error('Only Volunteer Leader or System Administrator can create shifts.');
  }

  const shiftRef = doc(collection(db, 'shifts'), payload.shiftId);
  await runTransaction(db, async (trx) => {
    trx.set(shiftRef, {
      ...payload,
      status: 'Draft',
      createdByUserId: userId,
      emailNotificationStatus: 'Not Sent',
      CreatedBy: userId,
      CreatedAt: serverTimestamp(),
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shift',
    entityId: payload.shiftId,
    action: 'Create',
    performedBy: userId,
    afterData: payload
  });
}

export async function updateShiftStatus(shiftId: string, toStatus: ShiftStatus, userId: string, remarks?: string): Promise<void> {
  const user = await getCurrentUser(userId);
  if (!canUpdateShiftStatus(user, toStatus)) {
    throw new Error('User cannot update this shift status.');
  }

  const shiftRef = doc(db, 'shifts', shiftId);
  await runTransaction(db, async (trx) => {
    const shiftSnap = await trx.get(shiftRef);
    if (!shiftSnap.exists()) throw new Error('Shift not found.');

    const data = shiftSnap.data();
    if ((data.status === 'Completed' || data.status === 'Cancelled') && !user.roles.includes(ROLES.SYSTEM_ADMINISTRATOR)) {
      throw new Error('Cannot edit completed or cancelled shifts except by System Administrator.');
    }

    trx.update(shiftRef, { status: toStatus, UpdatedBy: userId, UpdatedAt: serverTimestamp() });

    const statusHistoryRef = doc(collection(db, `shifts/${shiftId}/statusHistory`));
    trx.set(statusHistoryRef, {
      statusHistoryId: statusHistoryRef.id,
      fromStatus: data.status,
      toStatus,
      changedBy: userId,
      changedAt: serverTimestamp(),
      remarks,
      CreatedBy: userId,
      CreatedAt: serverTimestamp(),
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shift',
    entityId: shiftId,
    action: 'Status Change',
    performedBy: userId,
    afterData: { toStatus },
    remarks
  });
}

export async function addIntendedVolunteer(
  shiftId: string,
  volunteerId: string,
  volunteerSnapshot: Record<string, unknown>,
  userId: string
): Promise<void> {
  await ensureVolunteerActive(volunteerId);
  const ref = doc(collection(db, `shifts/${shiftId}/shiftVolunteers`));

  await runTransaction(db, async (trx) => {
    trx.set(ref, {
      shiftVolunteerId: ref.id,
      volunteerId,
      volunteerSnapshot,
      intendedToJoin: true,
      selectedByReportingOfficer: false,
      attendanceStatus: 'Pending',
      completionStatus: 'Pending',
      CreatedBy: userId,
      CreatedAt: serverTimestamp(),
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shiftVolunteer',
    entityId: ref.id,
    action: 'Create',
    performedBy: userId,
    afterData: { shiftId, volunteerId },
    remarks: 'Add intended volunteer'
  });
}

export async function checkInOutVolunteer(
  shiftId: string,
  shiftVolunteerId: string,
  checkInDateTime: Date | undefined,
  checkOutDateTime: Date | undefined,
  userId: string
): Promise<void> {
  validateCheckOut(checkInDateTime, checkOutDateTime);

  const ref = doc(db, `shifts/${shiftId}/shiftVolunteers`, shiftVolunteerId);
  await runTransaction(db, async (trx) => {
    const snap = await trx.get(ref);
    if (!snap.exists()) throw new Error('Shift volunteer not found.');

    const current = snap.data();
    if (checkOutDateTime && !current.checkInDateTime && !checkInDateTime) {
      throw new Error('Cannot check out before check in.');
    }

    trx.update(ref, {
      checkInDateTime: checkInDateTime ?? current.checkInDateTime,
      checkOutDateTime: checkOutDateTime ?? null,
      attendanceStatus: checkOutDateTime ? 'Checked Out' : 'Checked In',
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shiftVolunteer',
    entityId: shiftVolunteerId,
    action: checkOutDateTime ? 'Check Out' : 'Check In',
    performedBy: userId,
    afterData: { shiftId, checkInDateTime, checkOutDateTime }
  });
}

export async function completeShift(shiftId: string, userId: string): Promise<void> {
  const shiftRef = doc(db, 'shifts', shiftId);
  const postShiftChecklistRef = doc(db, `shifts/${shiftId}/shiftChecklists`, 'post-shift');

  await runTransaction(db, async (trx) => {
    const shiftSnap = await trx.get(shiftRef);
    if (!shiftSnap.exists()) throw new Error('Shift not found.');

    const postChecklistSnap = await trx.get(postShiftChecklistRef);
    if (!postChecklistSnap.exists()) {
      throw new Error('Cannot complete shift before post-shift checklist is completed.');
    }

    trx.update(shiftRef, {
      status: 'Completed',
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shift',
    entityId: shiftId,
    action: 'Status Change',
    performedBy: userId,
    afterData: { status: 'Completed' },
    remarks: 'Complete shift'
  });
}

export async function selectVolunteer(
  shiftId: string,
  shiftVolunteerId: string,
  assignedShiftRole: string,
  selectionRemarks: string,
  userId: string
): Promise<void> {
  const ref = doc(db, `shifts/${shiftId}/shiftVolunteers`, shiftVolunteerId);

  await runTransaction(db, async (trx) => {
    const snap = await trx.get(ref);
    if (!snap.exists()) throw new Error('Shift volunteer not found.');

    trx.update(ref, {
      selectedByReportingOfficer: true,
      assignedShiftRole,
      selectionRemarks,
      UpdatedBy: userId,
      UpdatedAt: serverTimestamp()
    });
  });

  await writeAuditLog({
    entityType: 'shiftVolunteer',
    entityId: shiftVolunteerId,
    action: 'Update',
    performedBy: userId,
    afterData: { selectedByReportingOfficer: true, assignedShiftRole, selectionRemarks },
    remarks: 'Select volunteer and assign shift role'
  });
}

export async function markEmailNotificationSent(shiftId: string, userId: string): Promise<void> {
  const batch = writeBatch(db);
  const shiftRef = doc(db, 'shifts', shiftId);
  batch.update(shiftRef, {
    emailNotificationStatus: 'Sent',
    emailNotificationSentAt: serverTimestamp(),
    emailNotificationSentBy: userId,
    UpdatedBy: userId,
    UpdatedAt: serverTimestamp()
  });
  await batch.commit();

  await writeAuditLog({
    entityType: 'shift',
    entityId: shiftId,
    action: 'Update',
    performedBy: userId,
    afterData: { emailNotificationStatus: 'Sent' },
    remarks: 'Manual email notification marked as sent'
  });
}
