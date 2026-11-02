type TypeName = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type Shape = Record<string, TypeName>;

/** Returns a list of problems; an empty list means the object matches the shape. */
export function validateShape(obj: unknown, shape: Shape, path = 'root'): string[] {
  if (typeof obj !== 'object' || obj === null) return [`${path} is not an object`];
  const record = obj as Record<string, unknown>;
  const problems: string[] = [];
  for (const [key, expected] of Object.entries(shape)) {
    const value = record[key];
    const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    if (actual !== expected) problems.push(`${path}.${key}: expected ${expected}, got ${actual}`);
  }
  return problems;
}
