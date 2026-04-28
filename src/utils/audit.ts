import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

export interface AuditContext {
  userId: string;
  remarks?: string;
}

export async function writeAuditLog(input: {
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  beforeData?: unknown;
  afterData?: unknown;
  remarks?: string;
}): Promise<void> {
  await addDoc(collection(db, 'auditLogs'), {
    ...input,
    performedAt: serverTimestamp(),
    CreatedBy: input.performedBy,
    CreatedAt: serverTimestamp(),
    UpdatedBy: input.performedBy,
    UpdatedAt: serverTimestamp()
  });
}

export async function createWithAudit<T extends DocumentData>(
  ref: DocumentReference,
  data: T,
  ctx: AuditContext,
  entityType: string
): Promise<void> {
  const payload = {
    ...data,
    CreatedBy: ctx.userId,
    CreatedAt: serverTimestamp(),
    UpdatedBy: ctx.userId,
    UpdatedAt: serverTimestamp()
  };

  await setDoc(ref, payload);
  await writeAuditLog({
    entityType,
    entityId: ref.id,
    action: 'Create',
    performedBy: ctx.userId,
    afterData: payload,
    remarks: ctx.remarks
  });
}

export async function updateWithAudit<T extends DocumentData>(
  ref: DocumentReference,
  data: Partial<T>,
  ctx: AuditContext,
  entityType: string,
  action = 'Update'
): Promise<void> {
  const beforeSnap = await getDoc(ref);
  const beforeData = beforeSnap.exists() ? beforeSnap.data() : undefined;

  const payload = {
    ...data,
    UpdatedBy: ctx.userId,
    UpdatedAt: serverTimestamp()
  };

  await updateDoc(ref, payload);
  await writeAuditLog({
    entityType,
    entityId: ref.id,
    action,
    performedBy: ctx.userId,
    beforeData,
    afterData: payload,
    remarks: ctx.remarks
  });
}

export function withAuditFields<T extends object>(data: T, userId: string): T & Record<string, unknown> {
  return {
    ...data,
    CreatedBy: userId,
    CreatedAt: serverTimestamp(),
    UpdatedBy: userId,
    UpdatedAt: serverTimestamp()
  };
}

export function withUpdatedAuditFields<T extends object>(data: T, userId: string): T & Record<string, unknown> {
  return {
    ...data,
    UpdatedBy: userId,
    UpdatedAt: serverTimestamp()
  };
}
