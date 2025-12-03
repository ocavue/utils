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

/**
 * A polyfill for the `Object.groupBy` static method.
 * 
 * @public
 */
export const objectGroupBy: <K extends PropertyKey, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
) => Partial<Record<K, T[]>> = Object.groupBy
  ? (items, keySelector) => Object.groupBy(items, keySelector)
  : objectGroupByPolyfill
