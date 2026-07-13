const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** Generate a secure temporary password (min 12 chars, no ambiguous characters). */
export function generateTemporaryPassword(length = 12): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => PASSWORD_CHARS[byte % PASSWORD_CHARS.length]).join('');
}
