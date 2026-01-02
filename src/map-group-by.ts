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

let hasMapGroupBy: boolean | undefined = undefined

/**
 * A polyfill for the `Map.groupBy` static method.
 *
 * @public
 */
export function mapGroupBy<K, T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
): Map<K, T[]> {
  if (hasMapGroupBy == null) {
    hasMapGroupBy = !!Map.groupBy
  }
  if (hasMapGroupBy) {
    return Map.groupBy(items, keySelector)
  }
  return mapGroupByPolyfill(items, keySelector)
}
