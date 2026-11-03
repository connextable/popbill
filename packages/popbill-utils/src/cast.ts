/** Provider-owned codes remain readable when the server adds values or returns null. */
export type ProviderNumericCode = number | string | null

/** Preserve unrecognized flags instead of inventing a negative answer. */
export type ProviderBoolean = boolean | string | number | null

/** Reads integer codes without coercing absent values or losing numeric precision. */
export function parseSafeInteger(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) ? value : undefined
  }

  if (typeof value !== 'string' || !/^[+-]?\d+$/.test(value.trim())) {
    return undefined
  }

  const parsed = Number(value.trim())
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

/** Normalize decimal status codes without turning blank or future provider values into zero or NaN. */
export function preserveNumericCode<T extends ProviderNumericCode | undefined>(value: T): number | T {
  if (typeof value !== 'string') return value
  return parseSafeInteger(value) ?? value
}

/** Normalize known response flags while preserving null and future provider values. */
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

export function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === 'y' || normalized === '1'
  }

  return false
}
