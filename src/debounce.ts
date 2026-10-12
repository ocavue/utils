export interface DebounceOptions {
  /**
   * Whether to invoke `callback` immediately when a new debounce window
   * begins. Calls made during that window are still delayed, so a trailing
   * invocation only happens if the debounced function was called again during
   * the window.
   *
   * @default false
   */
  leading?: boolean

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
 * When the debounced function is called more than once before the delay
 * expires, `callback` receives the arguments of the most recent call.
 *
 * @param callback The function to debounce
 * @param delay The number of milliseconds to wait after the last call
 * @param options Whether to also invoke `callback` on the leading edge (defaults to `false`), and an optional `signal` to cancel the debounced function
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

      if (!isLeadingCall) {
        callback.apply(this, args)
      }
    }, delay)

    if (isLeadingCall) {
      callback.apply(this, args)
    }
  }
}
