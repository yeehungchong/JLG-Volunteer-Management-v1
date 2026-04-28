import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { createWithAudit, updateWithAudit } from '../utils/audit.js';
import { contactSchema, emailSchema } from '../utils/validators.js';

export async function createVolunteer(payload: {
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
}, userId: string): Promise<void> {
  payload.emailAddresses.forEach((email) => emailSchema.parse(email));
  payload.contactNumbers.forEach((contact) => contactSchema.parse(contact));

  const ref = doc(collection(db, 'volunteers'), payload.volunteerId);
  await createWithAudit(ref, payload, { userId }, 'volunteer');
}

export async function updateVolunteer(
  volunteerId: string,
  payload: Partial<{
    fullName: string;
    contactNumbers: string[];
    emailAddresses: string[];
    race: string;
    experienceLevel: string;
    skills: string[];
    certifications: string[];
    status: 'Active' | 'Inactive';
    remarks?: string;
  }>,
  userId: string
): Promise<void> {
  payload.emailAddresses?.forEach((email) => emailSchema.parse(email));
  payload.contactNumbers?.forEach((contact) => contactSchema.parse(contact));

  const ref = doc(db, 'volunteers', volunteerId);
  await updateWithAudit(ref, payload, { userId }, 'volunteer');
}

export async function ensureVolunteerActive(volunteerId: string): Promise<void> {
  const snap = await getDoc(doc(db, 'volunteers', volunteerId));
  if (!snap.exists() || snap.data().status !== 'Active') {
    throw new Error('Cannot select inactive volunteers.');
  }
}
