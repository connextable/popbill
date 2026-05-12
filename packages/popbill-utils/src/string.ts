export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function normalizeRequiredString(value: unknown, errorMessage: string): string {
  if (typeof value !== 'string') {
    throw new Error(errorMessage)
  }

  const trimmed = value.trim()
  if (trimmed.length === 0) {
    throw new Error(errorMessage)
  }

  return trimmed
}

export function normalizeOptionalString(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}
