export const MAX_TIMEOUT_MILLISECONDS = 2_147_483_647

/** Matches the SDK clients' positive integer timeout range without coercion. */
export function isValidTimeoutMilliseconds(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= MAX_TIMEOUT_MILLISECONDS
}

export function isValidDate8(value: string): boolean {
  return /^(\d{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(value)
}

/** Checks an untrimmed yyyyMMdd value against UTC calendar components. */
export function isValidCalendarDate8(value: string): boolean {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(value)
  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}
