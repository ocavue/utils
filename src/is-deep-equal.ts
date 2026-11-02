import { isEqualWith } from './is-equal-with'

/**
 * Whether two values are deeply equal.
 */
export function isDeepEqual<T>(a: T, b: T): boolean {
  return isEqualWith(a, b, isDeepEqual)
}
