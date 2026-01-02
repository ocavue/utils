/**
 * @internal
 */
export function objectGroupByPolyfill<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {}
  let index = 0
  for (const item of items) {
    const key = keySelector(item, index)
    const group = result[key]
    if (group) {
      group.push(item)
    } else {
      result[key] = [item]
    }
    index++
  }
  return result
}

let hasObjectGroupBy: boolean | undefined

/**
 * A polyfill for the `Object.groupBy` static method.
 *
 * @public
 */
export function objectGroupBy<K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Partial<Record<K, T[]>> {
  if (hasObjectGroupBy == null) {
    hasObjectGroupBy = !!Object.groupBy
  }
  if (hasObjectGroupBy) {
    return Object.groupBy(items, keySelector)
  }
  return objectGroupByPolyfill(items, keySelector)
}
