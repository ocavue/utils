
/**
 * @internal
 */
export function isSameValueZero(a: unknown, b: unknown): boolean {
  return a === b || (Number.isNaN(a) && Number.isNaN(b))
}
