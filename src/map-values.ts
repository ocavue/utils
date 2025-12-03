export function mapValues<ValueIn, ValueOut>(
  object: Record<string, ValueIn>,
  callback: (value: ValueIn, key: string) => ValueOut,
): Record<string, ValueOut> {
  let result = {} as Record<string, ValueOut>
  for (const [key, value] of Object.entries(object)) {
    result[key] = callback(value, key)
  }
  return result
}
