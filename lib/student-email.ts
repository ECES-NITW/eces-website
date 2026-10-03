export function detailsFromStudentEmail(email: string) {
  // NITW student addresses sometimes end with the nine-character roll number.
  // The published roll format identifies the entry year and department code.
  const match = email.match(/([0-9]{2})([a-z]{2})([a-z])([0-9])([a-z])([0-9]{2})@student\.nitw\.ac\.in$/i);
  if (!match) return { year: null, branch: null, section: null };

  const yearNumber = 2000 + Number(match[1]);
  if (yearNumber < 2000 || yearNumber > 2099) return { year: null, branch: null, section: null };
  return { year: String(yearNumber), branch: match[2].toUpperCase(), section: null };
}
