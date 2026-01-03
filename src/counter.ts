/**
 * A map that counts occurrences of keys.
 *
 * Similar to Python's [Counter](https://docs.python.org/3.13/library/collections.html#collections.Counter).
 */
export class Counter<K> extends Map<K, number> {
  constructor(iterable?: Iterable<readonly [K, number]>) {
    super(iterable)
  }

  override get(key: K): number {
    return super.get(key) ?? 0
  }

  /**
   * Increments the count for a key by a given amount (default 1).
   */
  increment(key: K, amount = 1): void {
    this.set(key, this.get(key) + amount)
  }

  /**
   * Decrements the count for a key by a given amount (default 1).
   */
  decrement(key: K, amount = 1): void {
    this.set(key, this.get(key) - amount)
  }
}

/**
 * A weak map that counts occurrences of object keys.
 *
 * Similar to Counter but uses WeakMap as the base, allowing garbage collection of keys.
 */
export class WeakCounter<K extends WeakKey> extends WeakMap<K, number> {
  constructor(entries?: readonly (readonly [K, number])[] | null) {
    super(entries)
  }

  override get(key: K): number {
    return super.get(key) ?? 0
  }

  /**
   * Increments the count for a key by a given amount (default 1).
   */
  increment(key: K, amount = 1): void {
    this.set(key, this.get(key) + amount)
  }

  /**
   * Decrements the count for a key by a given amount (default 1).
   */
  decrement(key: K, amount = 1): void {
    this.set(key, this.get(key) - amount)
  }
}
