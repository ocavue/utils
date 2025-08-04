let id = 0

/**
 * Generates a unique positive integer.
 */
export function getId(): number {
  id = (id % Number.MAX_SAFE_INTEGER) + 1
  return id
}
