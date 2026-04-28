import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address.');
export const contactSchema = z
  .string()
  .regex(/^[+]?[(]?[0-9]{2,4}[)]?[-\s./0-9]*$/, 'Invalid contact number.');

export function validateShiftDateRange(startDateTime: Date, endDateTime: Date): void {
  if (endDateTime <= startDateTime) {
    throw new Error('Shift end date/time must be after shift start date/time.');
  }
}

export function validateChecklistOrder(preShiftDone: boolean, postShiftDone: boolean): void {
  if (!preShiftDone && postShiftDone) {
    throw new Error('Cannot complete pre-shift checklist after post-shift checklist.');
  }
}

export function validateCheckOut(checkInDateTime?: Date, checkOutDateTime?: Date): void {
  if (!checkInDateTime || !checkOutDateTime) return;
  if (checkOutDateTime < checkInDateTime) {
    throw new Error('Cannot check out before check in.');
  }
}
