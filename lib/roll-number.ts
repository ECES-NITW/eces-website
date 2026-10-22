/** Uppercases and strips spaces so "23ecb0a12" and "23 ECB 0A12" are stored the same way. */
export function normalizeRollNumber(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function detailsFromRollNumber(rollNumber: string) {
  // The published NITW roll format, e.g. 23ECB0A12, identifies the entry year and department code.
  const match = rollNumber.match(/^([0-9]{2})([A-Z]{2})([A-Z])([0-9])([A-Z])([0-9]{2})$/);
  if (!match) return { year: null, branch: null, section: null };
  return { year: String(2000 + Number(match[1])), branch: match[2], section: null };
}
