class LegacyValidationError extends Error {
  readonly code = -99999999

  constructor(message: string) {
    super(message)
    this.name = 'LegacyValidationError'
  }
}

export function createLegacyValidationError(message: string): Error & { code: number } {
  return new LegacyValidationError(message)
}

export function isLegacyValidationError(error: unknown): error is LegacyValidationError {
  return error instanceof LegacyValidationError
}
