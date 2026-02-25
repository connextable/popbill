export function isValidDate8(value: string): boolean {
  return /^(\d{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.test(value)
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
