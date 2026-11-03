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

/** Escape a multipart filename without changing its path or display-name policy. */
export function escapeMultipartFileName(value: string): string {
  // WHATWG multipart encoding escapes only CR, LF and quotes. Keep backslashes literal.
  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#multipart-form-data
  return value.replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/"/g, '%22')
}
