import { normalizeErrorMessage, parseSafeInteger } from '@connextable/popbill-utils'
import { getPopbillErrorCodeDefinition, POPBILL_ERROR_CATEGORIES } from './code-catalog'
import { getPopbillErrorDomainLabel, resolvePopbillErrorDomainFromCategory } from './domains'
import { PopbillErrorDomain, PopbillErrorStage, PopbillErrorType } from './enums'
import type { PopbillApiError, PopbillApiErrorInput } from './types'
import { isFetchRequestError, isRequestAbortError, isResponseBodyError } from '@connextable/popbill-runtime'
import { isLegacyValidationError } from './legacy-validation'

const UNKNOWN_ERROR_CODE = -99999999
const HTTP_ERROR_CODE = -99999996
const NETWORK_ERROR_CODE = -99999998
const TIMEOUT_ERROR_CODE = -99999997
const NETWORK_ERROR_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ECONNABORTED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'EPIPE',
  'ENETUNREACH',
  'EHOSTUNREACH',
  'UND_ERR_SOCKET',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_RES_CONTENT_LENGTH_MISMATCH',
])

const POPBILL_ERROR_TYPE_SET = new Set<string>(Object.values(PopbillErrorType))
const POPBILL_ERROR_STAGE_SET = new Set<string>(Object.values(PopbillErrorStage))
const POPBILL_ERROR_DOMAIN_SET = new Set<string>(Object.values(PopbillErrorDomain))
const POPBILL_ERROR_CATEGORY_SET = new Set<string>(POPBILL_ERROR_CATEGORIES)

interface HttpErrorPayload {
  status: number
  body: unknown
}

interface UserMessageContext {
  type: PopbillErrorType
  domain: PopbillErrorDomain
  message: string
  canonicalMessage?: string
  knownCode: boolean
  status?: number
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
    retriable: false,
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
  if (isFetchRequestError(error)) {
    return isNetworkError(error.cause) ? createNetworkError(error.cause, context) : createUnknownError(error.cause, context)
  }
  if (isRequestAbortError(error)) {
    const normalized =
      error.abort.source === 'request_timeout' ? createTimeoutError(error.abort.reason, context) : createUnknownError(error.abort.reason, context)
    return { ...normalized, abort: error.abort, retriable: false }
  }
  if (isResponseBodyError(error)) {
    const normalized = isNetworkError(error.cause) ? createNetworkError(error.cause, context) : createUnknownError(error.cause, context)
    return { ...normalized, retriable: false }
  }
  if (isLegacyValidationError(error)) {
    return createInputValidationError(error.message, { stage: PopbillErrorStage.ValidateInput, ...context })
  }
  // Native exceptions can have numeric codes (DOMException uses 20/23).
  // Only SDK-normalized exceptions may take the API payload path.
  if (error instanceof Error && !isPopbillApiError(error) && !isHttpErrorPayload(error)) {
    return isNetworkError(error) ? createNetworkError(error, context) : createUnknownError(error, context)
  }
  const parsedError = parseApiErrorBody(error)
  if (parsedError) {
    const payload = error as PopbillApiErrorInput
    const inferredType = payload.type ?? inferErrorTypeFromCode(parsedError.code)
    const inferredStage = context?.stage ?? payload.stage ?? inferErrorStageFromType(inferredType)

    return createError({
      ...payload,
      code: parsedError.code,
      message: parsedError.message,
      type: inferredType,
      operation: context?.operation ?? payload.operation,
      stage: inferredStage,
      retriable: payload.retriable ?? inferRetriable(payload.status),
      status: payload.status,
      raw: payload.raw === undefined && payload.code !== parsedError.code ? error : payload.raw,
      userMessage: payload.userMessage,
      domain: payload.domain,
      category: payload.category,
      canonicalMessage: payload.canonicalMessage,
      knownCode: payload.knownCode,
    })
  }

  if (isHttpErrorPayload(error)) {
    const body = parseApiErrorBody(error.body)
    if (body) {
      return createApiResponseError(body.code, body.message, {
        status: error.status,
        raw: error.body,
        ...context,
      })
    }
    return createHttpError(error.status, error.body, context)
  }

  if (isNetworkError(error)) {
    return createNetworkError(error, context)
  }

  return createUnknownError(error, context)
}

/**
 * 정규화가 끝난 PopbillApiError 형태인지 판별합니다.
 */
export function isPopbillApiError(payload: unknown): payload is PopbillApiError {
  if (!isPopbillApiErrorPayload(payload)) {
    return false
  }

  const domain = (payload as { domain: unknown }).domain
  const userMessage = (payload as { userMessage: unknown }).userMessage
  const type = (payload as { type: unknown }).type
  const stage = (payload as { stage: unknown }).stage
  const retriable = (payload as { retriable: unknown }).retriable
  const knownCode = (payload as { knownCode: unknown }).knownCode
  const category = (payload as { category?: unknown }).category
  const canonicalMessage = (payload as { canonicalMessage?: unknown }).canonicalMessage

  if (!isPopbillErrorDomain(domain) || typeof userMessage !== 'string') {
    return false
  }

  if (!isPopbillErrorType(type) || !isPopbillErrorStage(stage) || typeof retriable !== 'boolean') {
    return false
  }

  if (knownCode !== true && knownCode !== false) {
    return false
  }

  if (knownCode) {
    return isPopbillErrorCategory(category) && typeof canonicalMessage === 'string'
  }

  return category === undefined && canonicalMessage === undefined
}

function isPopbillApiErrorPayload(payload: unknown): payload is PopbillApiErrorInput {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  if (!('code' in payload) || !('message' in payload)) {
    return false
  }

  return typeof (payload as { code: unknown }).code === 'number' && typeof (payload as { message: unknown }).message === 'string'
}

function isHttpErrorPayload(payload: unknown): payload is HttpErrorPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  return 'status' in payload && 'body' in payload
}

function parseApiErrorBody(payload: unknown): { code: number; message: string } | undefined {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  if (!('code' in payload) || !('message' in payload)) {
    return undefined
  }

  const code = typeof payload.code === 'number' ? payload.code : parseSafeInteger(payload.code)
  return code !== undefined && typeof payload.message === 'string' ? { code, message: payload.message } : undefined
}

function isNetworkError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false
  }

  const visited = new Set<unknown>()
  let current: unknown = error
  let hasErrorCode = false
  while (current instanceof Error && !visited.has(current)) {
    visited.add(current)
    const code = (current as NodeJS.ErrnoException).code
    if (code !== undefined && code !== null) {
      if (typeof code === 'string' && NETWORK_ERROR_CODES.has(code)) return true
      hasErrorCode = true
    }
    current = current.cause
  }

  // Retain Node fetch's unadorned failure without treating arbitrary local errors as network failures.
  return !hasErrorCode && error.name === 'TypeError' && error.message === 'fetch failed'
}

function createError(error: PopbillApiErrorInput): PopbillApiError {
  const codeDefinition = getPopbillErrorCodeDefinition(error.code)
  const resolvedCategory = error.category ?? codeDefinition?.category
  const resolvedCanonicalMessage = error.canonicalMessage ?? codeDefinition?.message
  const requestedKnownCode = error.knownCode ?? codeDefinition !== undefined
  const hasCatalogMetadata = resolvedCategory !== undefined && resolvedCanonicalMessage !== undefined
  const knownCode = requestedKnownCode && hasCatalogMetadata

  const domain = error.domain ?? resolvePopbillErrorDomainFromCategory(resolvedCategory)
  const type = error.type ?? inferErrorTypeFromCode(error.code)
  const stage = error.stage ?? inferErrorStageFromType(type)
  const retriable = error.retriable ?? inferRetriable(error.status)
  const message = resolveApiErrorMessage(error.message, knownCode ? resolvedCanonicalMessage : undefined)
  const userMessage =
    resolveUserMessage(error.userMessage) ??
    createStandardUserMessage({
      type,
      domain,
      message,
      canonicalMessage: knownCode ? resolvedCanonicalMessage : undefined,
      knownCode,
      status: error.status,
    })

  const baseError = {
    ...error,
    code: error.code,
    message,
    userMessage,
    domain,
    type,
    stage,
    retriable,
    operation: error.operation,
    status: error.status,
    raw: error.raw,
  }

  if (knownCode) {
    return {
      ...baseError,
      knownCode: true,
      category: resolvedCategory!,
      canonicalMessage: resolvedCanonicalMessage!,
    }
  }

  return {
    ...baseError,
    knownCode: false,
    category: undefined,
    canonicalMessage: undefined,
  }
}

function resolveUserMessage(message: string | undefined): string | undefined {
  if (typeof message !== 'string') {
    return undefined
  }

  return message.trim().length > 0 ? message : undefined
}

function resolveApiErrorMessage(message: string, fallbackMessage: string | undefined): string {
  if (message.trim().length > 0) {
    return message
  }

  return fallbackMessage ?? message
}

function createStandardUserMessage(context: UserMessageContext): string {
  const domainLabel = getPopbillErrorDomainLabel(context.domain)

  if (context.type === PopbillErrorType.InputValidation) {
    return `입력값 확인이 필요해. ${context.message}`
  }

  if (context.type === PopbillErrorType.Network) {
    return '네트워크 문제로 팝빌 응답을 확인하지 못했어. 재요청 전에 처리 결과를 확인해줘.'
  }

  if (context.type === PopbillErrorType.Timeout) {
    return '팝빌 응답 시간이 초과됐어. 재요청 전에 처리 결과를 확인해줘.'
  }

  if (context.type === PopbillErrorType.Http) {
    if (typeof context.status === 'number') {
      return `팝빌 HTTP 응답 처리에 실패했어. (HTTP ${String(context.status)})`
    }

    return '팝빌 HTTP 응답 처리에 실패했어.'
  }

  if (context.knownCode && typeof context.canonicalMessage === 'string') {
    return `[${domainLabel}] ${context.canonicalMessage}`
  }

  if (context.message.trim().length > 0) {
    return `[${domainLabel}] ${context.message}`
  }

  return `[${domainLabel}] 요청 처리 중 오류가 발생했어.`
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

function inferErrorStageFromType(type: PopbillErrorType): PopbillErrorStage {
  if (type === PopbillErrorType.InputValidation) {
    return PopbillErrorStage.ValidateInput
  }

  return PopbillErrorStage.Unknown
}

function isPopbillErrorType(value: unknown): value is PopbillErrorType {
  return typeof value === 'string' && POPBILL_ERROR_TYPE_SET.has(value)
}

function isPopbillErrorStage(value: unknown): value is PopbillErrorStage {
  return typeof value === 'string' && POPBILL_ERROR_STAGE_SET.has(value)
}

function isPopbillErrorDomain(value: unknown): value is PopbillErrorDomain {
  return typeof value === 'string' && POPBILL_ERROR_DOMAIN_SET.has(value)
}

function isPopbillErrorCategory(value: unknown): value is (typeof POPBILL_ERROR_CATEGORIES)[number] {
  return typeof value === 'string' && POPBILL_ERROR_CATEGORY_SET.has(value)
}
