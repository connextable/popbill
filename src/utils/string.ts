export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function normalizeOptionalString(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}
