/** Provider-owned codes remain readable when the server adds values or returns null. */
export type ProviderNumericCode = number | string | null

/** Preserve unrecognized flags instead of inventing a negative answer. */
export type ProviderBoolean = boolean | string | number | null

export function preserveBooleanResponse<T extends ProviderBoolean | undefined>(value: T): boolean | T {
  if (typeof value === 'boolean') return value
  if (value === 1) return true
  if (value === 0) return false
  if (typeof value !== 'string') return value

  const normalized = value.trim().toLowerCase()
  if (normalized === 'true' || normalized === 'y' || normalized === '1') return true
  if (normalized === 'false' || normalized === 'n' || normalized === '0') return false
  return value
}

/** Counts and sizes may be absent; null, blanks, and booleans are not zero. */
export function optionalResponseNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value !== 'string' || value.trim() === '') return undefined
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : undefined
}
