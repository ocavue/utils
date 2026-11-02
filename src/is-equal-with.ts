import { isMap, isSet } from './checker'
import { isSameValueZero } from './is-same-value-zero'

/**
 * Whether two values are equal. Values inside arrays, Maps and plain objects
 * are compared with `compareValue`.
 *
 * @internal
 */
export function isEqualWith(
  a: unknown,
  b: unknown,
  compareValue: (a: unknown, b: unknown) => boolean,
): boolean {
  if (isSameValueZero(a, b)) {
    return true
  }

  // Handle null and undefined early
  if (a == null || b == null) {
    return false
  }

  const aType = typeof a
  if (aType !== typeof b) {
    return false
  }

  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false
    }
    const size = a.length
    for (let i = 0; i < size; i++) {
      if (!compareValue(a[i], b[i])) {
        return false
      }
    }
    return true
  }
  if (aIsArray || bIsArray) {
    return false
  }

  const aIsSet = isSet(a)
  const bIsSet = isSet(b)
  if (aIsSet && bIsSet) {
    if (a.size !== b.size) {
      return false
    }
    for (const value of a) {
      if (!b.has(value)) {
        return false
      }
    }
    return true
  }
  if (aIsSet || bIsSet) {
    return false
  }

  const aIsMap = isMap(a)
  const bIsMap = isMap(b)
  if (aIsMap && bIsMap) {
    if (a.size !== b.size) {
      return false
    }
    for (const key of a.keys()) {
      if (!b.has(key)) {
        return false
      }
      if (!compareValue(a.get(key), b.get(key))) {
        return false
      }
    }
    return true
  }
  if (aIsMap || bIsMap) {
    return false
  }

  if (aType === 'object') {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) {
      return false
    }
    for (const key of aKeys) {
      if (
        !Object.hasOwn(b, key) ||
        !compareValue(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
        )
      ) {
        return false
      }
    }
    return true
  }

  return false
}
