export interface ThrottleOptions {
  /**
   * Whether the first call of a series invokes `callback` immediately. If
   * `false`, that leading invocation is skipped.
   *
   * @default true
   */
  leading?: boolean

  /**
   * Whether the last call of a series invokes `callback` one final time, once
   * `delay` milliseconds have passed. If `false`, calls made while throttled
   * are dropped. `callback` never runs when both `leading` and `trailing` are
   * `false`.
   *
   * @default true
   */
  trailing?: boolean
}

/**
 * Creates a throttled function that invokes `callback` at most once per every
 * `delay` milliseconds.
 *
 * By default `callback` runs on the leading edge, and runs once more `delay`
 * milliseconds later with the arguments of the last suppressed call. Either
 * edge can be turned off via `options`.
 *
 * @param callback The function to throttle
 * @param delay The number of milliseconds to throttle invocations to
 * @param options Whether to invoke `callback` on the leading and trailing edges. Both default to `true`
 * @returns A throttled version of the function
 *
 * @example
 * ```js
 * const throttled = throttle((name) => console.log('called', name), 1000)
 * throttled('Alice') // logs 'called Alice' immediately
 * throttled('Bob') // skipped (within 1000ms)
 * throttled('Charlie') // skipped (within 1000ms)
 * // after 1000ms, logs 'called Charlie' again (trailing call)
 * ```
 *
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
  delay: number,
  options?: ThrottleOptions,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  const leading = options?.leading ?? true
  const trailing = options?.trailing ?? true

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let windowStart = 0

  return function throttled(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    clearTimeout(timeoutId)

    const now = Date.now()

    if (now - windowStart >= delay) {
      windowStart = now

      if (leading) {
        callback.apply(this, args)
        return
      }
    }

    if (trailing) {
      timeoutId = setTimeout(
        () => {
          windowStart = Date.now()
          callback.apply(this, args)
        },
        delay + windowStart - now,
      )
    }
  }
}
