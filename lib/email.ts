// Structural check only: local@domain.tld, no spaces, 2+ character TLD. Deliberately lenient on
// the character set — the only authoritative check is mail that actually arrives. Shared by the
// signup form and the API routes so client and server can't drift into disagreeing about what's
// valid (a stricter client than server is a silent lead-loss bug).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}
