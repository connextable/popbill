// ESM and CJS entry points have distinct class instances but share the symbol registry.
const legacyValidationBrand = Symbol.for('@connextable/popbill-compat/LegacyValidationError')

class LegacyValidationError extends Error {
  readonly code = -99999999
  readonly [legacyValidationBrand] = true

  constructor(message: string) {
    super(message)
    this.name = 'LegacyValidationError'
  }
}

export function createLegacyValidationError(message: string): Error & { code: number } {
  return new LegacyValidationError(message)
}

export function isLegacyValidationError(error: unknown): error is LegacyValidationError {
  return error instanceof Error && legacyValidationBrand in error && error[legacyValidationBrand] === true
}
