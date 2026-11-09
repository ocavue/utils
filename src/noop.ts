/**
 * A function that does nothing and returns `undefined`.
 *
 * @example
 * ```ts
 * element.addEventListener('click', noop)
 * ```
 */
export function noop(): undefined {}

/**
 * A function that always returns `true`.
 *
 * @example
 * ```ts
 * items.filter(returnTrue) // keeps every item
 * ```
 */
export function returnTrue(): true {
  return true
}

/**
 * A function that always returns `false`.
 *
 * @example
 * ```ts
 * items.filter(returnFalse) // drops every item
 * ```
 */
export function returnFalse(): false {
  return false
}

/**
 * A function that always returns `null`.
 */
export function returnNull(): null {
  return null
}

/**
 * A function that always returns `undefined`.
 */
export function returnUndefined(): undefined {
  return
}
