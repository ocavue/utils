export interface DebounceOptions {
  /**
   * Whether the first call of a series invokes `callback` immediately.
   *
   * @default false
   */
  leading?: boolean

  /**
   * Whether the last call of a series invokes `callback`, once `delay`
   * milliseconds have passed without another call. If `leading` is also
   * `true`, this trailing invocation only happens when the series has more
   * than one call. `callback` never runs when both `leading` and `trailing`
   * are `false`.
   *
   * @default true
   */
  trailing?: boolean

  /**
   * An `AbortSignal` that cancels pending calls and prevents future calls when
   * aborted.
   */
  signal?: AbortSignal
}

/**
 * Creates a debounced function that delays invoking `callback` until `delay`
 * milliseconds have passed since the last time the debounced function was
 * called.
 *
 * By default `callback` runs on the trailing edge, with the arguments of the
 * last call. It can also run on the leading edge via `options`.
 *
 * @param callback The function to debounce
 * @param delay The number of milliseconds to wait after the last call
 * @param options Whether to invoke `callback` on the leading edge (defaults to `false`) and the trailing edge (defaults to `true`), and an optional `signal` to cancel the debounced function
 * @returns A debounced version of the function
 *
 * @example
 * ```js
 * const debounced = debounce((name) => console.log('called', name), 1000)
 * debounced('Alice') // skipped
 * debounced('Bob') // skipped
 * debounced('Charlie') // skipped
 * // 1000ms after the last call, logs 'called Charlie'
 * ```
 *
 * @example
 * ```js
 * const debounced = debounce((name) => console.log('called', name), 1000, {
 *   leading: true,
 * })
 * debounced('Alice') // logs 'called Alice' immediately
 * debounced('Bob') // skipped
 * // 1000ms after the last call, logs 'called Bob' (trailing call)
 * ```
 *
 * @example
 * ```js
 * const controller = new AbortController()
 * const debounced = debounce((name) => console.log('called', name), 1000, {
 *   signal: controller.signal,
 * })
 * debounced('Alice') // skipped
 * controller.abort() // cancels the pending trailing call
 * debounced('Bob') // skipped (aborted)
 * ```
 */
export function debounce<T extends (this: any, ...args: any[]) => unknown>(
  callback: T,
  delay: number,
  options?: DebounceOptions,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  const leading = options?.leading ?? false
  const trailing = options?.trailing ?? true
  const signal = options?.signal

  let timeoutId: ReturnType<typeof setTimeout> | undefined

  signal?.addEventListener('abort', () => clearTimeout(timeoutId), {
    once: true,
  })

  return function debounced(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): void {
    if (signal?.aborted) {
      return
    }

    const isLeadingCall = leading && timeoutId === undefined

    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      timeoutId = undefined

      if (trailing && !isLeadingCall) {
        callback.apply(this, args)
      }
    }, delay)

    if (isLeadingCall) {
      callback.apply(this, args)
    }
  }
}
