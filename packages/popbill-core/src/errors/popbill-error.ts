import { normalizeErrorMessage } from '@/utils/error'
import { getPopbillErrorCodeDefinition } from './code-catalog'
import type { PopbillApiError } from './types'
import { PopbillErrorStage, PopbillErrorType } from './enums'

const UNKNOWN_ERROR_CODE = -99999999
const HTTP_ERROR_CODE = -99999996
const NETWORK_ERROR_CODE = -99999998
const TIMEOUT_ERROR_CODE = -99999997

interface HttpErrorPayload {
  status: number
  body: unknown
}

export interface PopbillErrorContext {
  operation?: string
  stage?: PopbillErrorStage
}

export function createInputValidationError(message: string, context?: PopbillErrorContext): PopbillApiError {
  return createError({
    code: UNKNOWN_ERROR_CODE,
    message,
    type: PopbillErrorType.InputValidation,
    retriable: false,
    ...context,
  })
}

export function createApiResponseError(
  code: number,
  message: string,
  context?: PopbillErrorContext & { status?: number; raw?: unknown }
): PopbillApiError {
  return createError({
    code,
    message,
    type: PopbillErrorType.ApiResponse,
    status: context?.status,
    raw: context?.raw,
    retriable: typeof context?.status === 'number' ? context.status >= 500 : false,
    operation: context?.operation,
    stage: context?.stage,
  })
}

export function createHttpError(status: number, raw: unknown, context?: PopbillErrorContext): PopbillApiError {
  return createError({
    code: HTTP_ERROR_CODE,
    message: `HTTP ${String(status)}`,
    type: PopbillErrorType.Http,
    status,
    raw,
    retriable: status >= 500,
    ...context,
  })
}

export function createNetworkError(error: unknown, context?: PopbillErrorContext): PopbillApiError {
  return createError({
    code: NETWORK_ERROR_CODE,
    message: normalizeErrorMessage(error),
    type: PopbillErrorType.Network,
    raw: error,
    retriable: true,
    ...context,
  })
}

export function createTimeoutError(error: unknown, context?: PopbillErrorContext): PopbillApiError {
  return createError({
    code: TIMEOUT_ERROR_CODE,
    message: normalizeErrorMessage(error),
    type: PopbillErrorType.Timeout,
    raw: error,
    retriable: true,
    ...context,
  })
}

export function createUnknownError(error: unknown, context?: PopbillErrorContext): PopbillApiError {
  return createError({
    code: UNKNOWN_ERROR_CODE,
    message: normalizeErrorMessage(error),
    type: PopbillErrorType.Unknown,
    raw: error,
    retriable: false,
    ...context,
  })
}

export function normalizePopbillError(error: unknown, context?: PopbillErrorContext): PopbillApiError {
  if (isPopbillApiError(error)) {
    const inferredType = error.type ?? inferErrorTypeFromCode(error.code)
    const inferredStage = context?.stage ?? error.stage ?? inferErrorStageFromCode(error.code)

    return createError({
      ...error,
      code: error.code,
      message: error.message,
      type: inferredType,
      operation: context?.operation ?? error.operation,
      stage: inferredStage,
      retriable: error.retriable ?? inferRetriable(error.status),
      status: error.status,
      raw: error.raw,
    })
  }

  if (isHttpErrorPayload(error) && isApiErrorBody(error.body)) {
    return createApiResponseError(error.body.code, error.body.message, {
      status: error.status,
      raw: error.body,
      ...context,
    })
  }

  if (isHttpErrorPayload(error)) {
    return createHttpError(error.status, error.body, context)
  }

  if (isTimeoutError(error)) {
    return createTimeoutError(error, context)
  }

  if (isNetworkError(error)) {
    return createNetworkError(error, context)
  }

  return createUnknownError(error, context)
}

export function isPopbillApiError(payload: unknown): payload is PopbillApiError {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  return 'code' in payload && 'message' in payload
}

function isHttpErrorPayload(payload: unknown): payload is HttpErrorPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  return 'status' in payload && 'body' in payload
}

function isApiErrorBody(payload: unknown): payload is { code: number; message: string } {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  if (!('code' in payload) || !('message' in payload)) {
    return false
  }

  return (
    typeof (payload as { code: unknown }).code === 'number' &&
    typeof (payload as { message: unknown }).message === 'string'
  )
}

function isTimeoutError(error: unknown): error is Error {
  return error instanceof Error && error.name === 'AbortError'
}

function isNetworkError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false
  }

  const code = (error as NodeJS.ErrnoException).code
  if (typeof code === 'string' && code.length > 0) {
    return true
  }

  return error.name === 'TypeError' && /fetch/i.test(error.message)
}

function createError(error: PopbillApiError): PopbillApiError {
  const codeDefinition = getPopbillErrorCodeDefinition(error.code)
  const canonicalMessage = codeDefinition?.message

  return {
    ...error,
    message: resolveApiErrorMessage(error.message, canonicalMessage),
    knownCode: error.knownCode ?? codeDefinition !== undefined,
    category: error.category ?? codeDefinition?.category,
    canonicalMessage: error.canonicalMessage ?? canonicalMessage,
    retriable: error.retriable ?? inferRetriable(error.status),
    stage: error.stage ?? PopbillErrorStage.Unknown,
    type: error.type ?? PopbillErrorType.Unknown,
  }
}

function resolveApiErrorMessage(message: string, fallbackMessage: string | undefined): string {
  if (message.trim().length > 0) {
    return message
  }

  return fallbackMessage ?? message
}

function inferRetriable(status: number | undefined): boolean {
  if (typeof status !== 'number') {
    return false
  }

  return status >= 500
}

function inferErrorTypeFromCode(code: number): PopbillErrorType {
  if (code === UNKNOWN_ERROR_CODE) {
    return PopbillErrorType.InputValidation
  }

  return PopbillErrorType.Unknown
}

function inferErrorStageFromCode(code: number): PopbillErrorStage {
  if (code === UNKNOWN_ERROR_CODE) {
    return PopbillErrorStage.ValidateInput
  }

  return PopbillErrorStage.Unknown
}
