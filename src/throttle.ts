export interface ThrottleOptions {
  /**
   * Whether to invoke `callback` on the leading edge of the wait period.
   *
   * @default true
   */
  leading?: boolean

  /**
   * Whether to invoke `callback` on the trailing edge of the wait period.
   *
   * @default true
   */
  trailing?: boolean
}

/**
 * Creates a throttled function that only invokes `fn` at most once per every
 * `wait` milliseconds. The first call executes immediately (leading edge).
 * If called again during the wait period, the last call will be executed at
 * the end of the wait period (trailing edge).
 *
 * Both edges can be turned off via `options`.
 *
 * @param callback The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @param options Whether to invoke on the leading and trailing edges. Both default to `true`
 * @returns A throttled version of the function
 * @example
 * ```js
 * const throttled = throttle((name) => console.log('called', name), 1000)
 * throttled('Alice') // logs 'called Alice' immediately
 * throttled('Bob') // skipped (within 1000ms)
 * throttled('Charlie') // skipped (within 1000ms)
 * // after 1000ms, logs 'called Charlie' again (trailing call)
 * ```
 * @example
 * ```js
 * const throttled = throttle((name) => console.log('called', name), 1000, {
 *   leading: false,
 * })
 * throttled('Alice') // skipped
 * throttled('Bob') // skipped
 * // after 1000ms, logs 'called Bob' (trailing call)
 * ```
 */
export function throttle<T extends (this: any, ...args: any[]) => unknown>(
  callback: T,
  wait: number,
  options?: ThrottleOptions,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  const leading = options?.leading ?? true
  const trailing = options?.trailing ?? true

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastCallTime = 0

  return function throttled(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    clearTimeout(timeoutId)

    const now = Date.now()

    if (lastCallTime === 0 && !leading) {
      lastCallTime = now
    }

    const delay = wait + lastCallTime - now

    if (delay <= 0 && leading) {
      lastCallTime = now
      callback.apply(this, args)
    } else if (trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = leading ? Date.now() : 0
        callback.apply(this, args)
      }, delay)
    }
  }
}
