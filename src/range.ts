/**
 * Creates an array of numbers progressing from `start` up to, but not
 * including, `end`.
 *
 * If only one argument is given, it is used as `end` and `start` is `0`. The
 * default `step` is `1`, or `-1` when `end` is less than `start`. A `step` of
 * `0` repeats `start` for the length of the range.
 *
 * @example
 * ```ts
 * range(4) // [0, 1, 2, 3]
 * range(-4) // [0, -1, -2, -3]
 * range(1, 5) // [1, 2, 3, 4]
 * range(0, 20, 5) // [0, 5, 10, 15]
 * range(0, -4, -1) // [0, -1, -2, -3]
 * range(1, 4, 0) // [1, 1, 1]
 * range(0) // []
 * ```
 *
 * @param end - The end of the range (exclusive). The start is `0`.
 * @returns The array of numbers.
 */
export function range(end: number): number[]
/**
 * @param start - The start of the range (inclusive).
 * @param end - The end of the range (exclusive).
 * @param step - The value to increment or decrement by.
 * @returns The array of numbers.
 */
export function range(start: number, end: number, step?: number): number[]
export function range(start: number, end?: number, step?: number): number[] {
  if (end === undefined) {
    end = start
    start = 0
  }
  if (step === undefined) {
    step = start < end ? 1 : -1
  }
  const length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  const result = new Array<number>(length)
  for (let i = 0; i < length; i++) {
    result[i] = start + i * step
  }
  return result
}
