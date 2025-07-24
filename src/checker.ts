/**
 * Checks if the given value is an object.
 */
export function isObject(
  value: unknown,
): value is Record<string | symbol | number, unknown> {
  return value != null && typeof value === 'object'
}
