const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidLogDate(iso: string, todayISO: string): boolean {
  if (typeof iso !== 'string' || !ISO_RE.test(iso)) return false
  const [y, m, d] = iso.split('-').map((p) => parseInt(p, 10))
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return false
  }
  return iso <= todayISO
}
