const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER
let id = 0

/**
 * Generates a unique ID.
 */
export function getId(): number {
  id = (id % MAX_SAFE_INTEGER) + 1
  return id
}
