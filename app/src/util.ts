export function stringify(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}

export function csvString(s: string) {
  const escapedString = s.replace(/"/g, '""');
  const quotedString = '"' + escapedString + '"';
  return quotedString;
}
