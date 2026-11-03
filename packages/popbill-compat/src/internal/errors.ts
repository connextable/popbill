import { normalizePopbillError, PopbillErrorStage, type PopbillApiError } from '@/errors'
import { isPopbillRequestStageError } from '@connextable/popbill-runtime'
import { invokeUserCallback } from './callback'
import { isLegacyValidationError } from '../popbill-error/legacy-validation'
export { createLegacyValidationError } from '../popbill-error/legacy-validation'

export interface LegacyCompatError extends Error {
  code: number
}

export type CompatRuntimeError = LegacyCompatError | PopbillApiError

export function asThrowableCompatError(error: CompatRuntimeError): Error & CompatRuntimeError {
  if (error instanceof Error) {
    return error
  }

  return Object.assign(new Error(error.message), error)
}

export function toCompatRuntimeError(error: unknown, operation: string): CompatRuntimeError {
  if (isLegacyValidationError(error)) {
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
  invokeUserCallback(errorCallback ?? defaultErrorHandler, error)
}
