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
