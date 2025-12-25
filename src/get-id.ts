let id = 0

let MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER

/**
 * Sets the maximum safe integer for the id generator. Only for testing purposes.
 *
 * @internal
 */
export function setMaxSafeInteger(max: number) {
  MAX_SAFE_INTEGER = max
}

/**
 * Generates a unique positive integer.
 */
export function getId(): number {
  id++
  if (id >= MAX_SAFE_INTEGER) {
    id = 1
  }
  return id
}
