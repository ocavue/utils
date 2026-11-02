import { isEqualWith } from './is-equal-with'
import { isSameValueZero } from './is-same-value-zero'

/**
 * Whether two values are shallowly equal. Arrays, Sets, Maps and plain objects
 * are equal when their direct values are equal. Nested values are compared by
 * reference.
 */
export function isShallowEqual(a: unknown, b: unknown): boolean {
  return isEqualWith(a, b, isSameValueZero )
}
