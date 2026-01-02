/**
 * A map that automatically creates values for missing keys using a factory function.
 *
 * Similar to Python's [defaultdict](https://docs.python.org/3.13/library/collections.html#collections.defaultdict).
 */
export class DefaultMap<K, V> extends Map<K, V> {
  private readonly defaultFactory: () => V

  constructor(defaultFactory: () => V, iterable?: Iterable<readonly [K, V]>) {
    super(iterable)
    this.defaultFactory = defaultFactory
  }

  override get(key: K): V {
    if (this.has(key)) {
      return super.get(key)!
    }
    const value = this.defaultFactory()
    this.set(key, value)
    return value
  }
}

/**
 * A weak map that automatically creates values for missing keys using a factory function.
 *
 * Similar to DefaultMap but uses WeakMap as the base, allowing garbage collection of keys.
 */
export class DefaultWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
  private readonly defaultFactory: () => V

  constructor(
    defaultFactory: () => V,
    entries?: readonly (readonly [K, V])[] | null,
  ) {
    super(entries)
    this.defaultFactory = defaultFactory
  }

  override get(key: K): V {
    if (this.has(key)) {
      return super.get(key)!
    }
    const value = this.defaultFactory()
    this.set(key, value)
    return value
  }
}

/**
 * A map that counts occurrences of keys.
 *
 * Similar to Python's [Counter](https://docs.python.org/3.13/library/collections.html#collections.Counter).
 */
export class Counter<K> extends DefaultMap<K, number> {
  constructor(iterable?: Iterable<readonly [K, number]>) {
    super(() => 0, iterable)
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
export class WeakCounter<K extends WeakKey> extends DefaultWeakMap<K, number> {
  constructor(entries?: readonly (readonly [K, number])[] | null) {
    super(() => 0, entries)
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
