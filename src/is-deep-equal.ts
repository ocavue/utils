import { isEqualWith } from './is-equal-with'

/**
 * Whether two values are deeply equal.
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  return isEqualWith(a, b, isDeepEqual)
}
