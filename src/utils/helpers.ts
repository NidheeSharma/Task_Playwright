/** "Rs. 1,500" -> 1500 */
export function parsePrice(text: string): number {
  const digits = text.replace(/[^\d.]/g, '');
  const value = Number(digits);
  if (Number.isNaN(value) || digits === '') {
    throw new Error(`Cannot parse price from "${text}"`);
  }
  return value;
}

/** Collapse whitespace and non-breaking spaces for safe text comparison. */
export function normalizeText(text: string): string {
  return text.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}
