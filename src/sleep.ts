/**
 * Pauses execution for a specified number of milliseconds.
 *
 * Returns a Promise that resolves after the given delay. This is useful for
 * adding delays in async functions, rate limiting, polling with intervals,
 * or creating timeouts in tests.
 *
 * @param ms - The number of milliseconds to wait before resolving the Promise.
 *             Must be a non-negative number. Values are clamped to the range
 *             supported by setTimeout (0 to 2^31-1 milliseconds, ~24.8 days).
 *
 * @returns A Promise that resolves to `void` after the specified delay.
 *
 * @example
 * ```typescript
 * // Basic usage with async/await
 * async function example() {
 *   console.log('Starting...')
 *   await sleep(1000)  // Wait 1 second
 *   console.log('Done!')
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Retry with exponential backoff
 * async function fetchWithRetry(url: string, maxRetries = 3) {
 *   for (let i = 0; i < maxRetries; i++) {
 *     try {
 *       return await fetch(url)
 *     } catch (error) {
 *       if (i === maxRetries - 1) throw error
 *       const delay = Math.pow(2, i) * 1000  // 1s, 2s, 4s
 *       console.log(`Retry ${i + 1} after ${delay}ms`)
 *       await sleep(delay)
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Polling with delay
 * async function pollUntilReady(checkStatus: () => Promise<boolean>) {
 *   while (true) {
 *     const isReady = await checkStatus()
 *     if (isReady) return
 *     await sleep(500)  // Poll every 500ms
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Animation delay
 * async function animateSequence() {
 *   element.classList.add('fade-in')
 *   await sleep(300)
 *   element.classList.add('slide-up')
 *   await sleep(300)
 *   element.classList.add('complete')
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Rate limiting API calls
 * async function batchProcess(items: string[]) {
 *   for (const item of items) {
 *     await processItem(item)
 *     await sleep(100)  // Wait 100ms between requests
 *   }
 * }
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
