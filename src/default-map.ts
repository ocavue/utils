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
