/**
 * @internal
 */
export function mapGroupByPolyfill<K, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>()
  let index = 0
  for (const item of items) {
    const key = keySelector(item, index)
    const group = map.get(key)
    if (group) {
      group.push(item)
    } else {
      map.set(key, [item])
    }
    index++
  }
  return map
}

/**
 * @internal
 */
export function mapGroupByNative<K, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Map<K, T[]> {
  return Map.groupBy(items, keySelector)
}

/**
 * A polyfill for the `Map.groupBy` static method.
 *
 * @public
 */
export const mapGroupBy: <K, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
) => Map<K, T[]> = !!Map.groupBy ? mapGroupByNative : mapGroupByPolyfill
