export function formatExpiry(month: number, year: number) {
  // Take last 2 digits of the year
  const shortYear = year.toString().slice(-2);
  // Pad month with leading zero if needed
  const paddedMonth = month.toString().padStart(2, '0');
  return `${paddedMonth}/${shortYear}`;
}
