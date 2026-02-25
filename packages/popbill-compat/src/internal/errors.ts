import {
  isPopbillRequestStageError,
  normalizePopbillError,
  PopbillErrorStage,
  type PopbillApiError,
} from '@connextable/popbill-core'

export interface LegacyCompatError {
  code: number
  message: string
}

export type CompatRuntimeError = LegacyCompatError | PopbillApiError

export function createLegacyValidationError(message: string): LegacyCompatError {
  return {
    code: -99999999,
    message,
  }
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
  defaultErrorHandler: ((error: CompatRuntimeError) => void) | undefined,
): void {
  if (errorCallback) {
    errorCallback(error)
    return
  }

  defaultErrorHandler?.(error)
}

function isLegacyCompatError(error: unknown): error is LegacyCompatError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('code' in error) || !('message' in error)) {
    return false
  }

  return typeof (error as { code: unknown }).code === 'number'
    && typeof (error as { message: unknown }).message === 'string'
}
