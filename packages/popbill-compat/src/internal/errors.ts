import { normalizePopbillError, PopbillErrorStage, type PopbillApiError } from '@/errors'
import { isPopbillRequestStageError } from '@/internal/popbill'

export interface LegacyCompatError extends Error {
  code: number
}

export type CompatRuntimeError = LegacyCompatError | PopbillApiError

class LegacyValidationError extends Error implements LegacyCompatError {
  readonly code: number

  constructor(message: string) {
    super(message)
    this.name = 'LegacyValidationError'
    this.code = -99999999
  }
}

export function createLegacyValidationError(message: string): LegacyCompatError {
  return new LegacyValidationError(message)
}

export function asThrowableCompatError(error: CompatRuntimeError): Error & CompatRuntimeError {
  if (error instanceof Error) {
    return error
  }

  return Object.assign(new Error(error.message), error)
}

export function toCompatRuntimeError(error: unknown, operation: string): CompatRuntimeError {
  if (isLegacyCompatError(error)) {
    return error
  }

  if (isPopbillRequestStageError(error)) {
    return normalizePopbillError(error.cause, {
      operation,
      stage: error.requestStage,
    })
  }

  return normalizePopbillError(error, {
    operation,
    stage: PopbillErrorStage.RequestApi,
  })
}

export function dispatchCallbackError(
  error: CompatRuntimeError,
  errorCallback: ((error: unknown) => void) | undefined,
  defaultErrorHandler: ((error: CompatRuntimeError) => void) | undefined
): void {
  if (errorCallback) {
    errorCallback(error)
    return
  }

  defaultErrorHandler?.(error)
}

function isLegacyCompatError(error: unknown): error is LegacyCompatError {
  if (!(error instanceof Error)) {
    return false
  }

  if (!('code' in error)) {
    return false
  }

  return typeof (error as { code: unknown }).code === 'number'
}
