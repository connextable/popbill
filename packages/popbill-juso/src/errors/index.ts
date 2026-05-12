import { normalizeErrorMessage } from '@connextable/popbill-utils'

/**
 * 주소링크 요청 단계 상수입니다.
 */
export const JusoLinkRequestStages = {
  /**
   * 토큰 발급 단계입니다.
   */
  IssueToken: 'issue_token',
  /**
   * API 요청 단계입니다.
   */
  RequestApi: 'request_api',
} as const

/**
 * 주소링크 요청 단계 타입입니다.
 */
export type JusoLinkRequestStage = (typeof JusoLinkRequestStages)[keyof typeof JusoLinkRequestStages]

/**
 * 주소링크 공통 예외 코드입니다.
 */
export const JusoLinkErrorCodes = {
  /**
   * 원격 API 코드가 없는 경우 사용하는 내부 코드입니다.
   */
  Unexpected: -99999999,
} as const

/**
 * 주소링크 SDK 표준 에러 모델입니다.
 */
export interface JusoApiErrorDetails {
  /**
   * 서비스가 반환한 에러 코드입니다.
   */
  code: number

  /**
   * 에러 메시지입니다.
   */
  message: string

  /**
   * HTTP 상태 코드입니다.
   */
  httpStatusCode?: number

  /**
   * 실패한 공개 메서드 이름입니다.
   */
  operationName: string

  /**
   * 실패 단계입니다.
   */
  requestStage: JusoLinkRequestStage

  /**
   * 원본 예외 객체입니다.
   */
  cause?: unknown
}

/**
 * 주소링크 SDK 예외 클래스입니다.
 */
export class JusoApiError extends Error implements JusoApiErrorDetails {
  readonly code: number
  readonly httpStatusCode?: number
  readonly operationName: string
  readonly requestStage: JusoLinkRequestStage
  override readonly cause?: unknown

  constructor(details: JusoApiErrorDetails) {
    super(details.message)
    this.name = 'JusoApiError'
    this.code = details.code
    this.httpStatusCode = details.httpStatusCode
    this.operationName = details.operationName
    this.requestStage = details.requestStage
    this.cause = details.cause
  }
}

/**
 * 에러 정규화 입력 컨텍스트입니다.
 */
export interface NormalizeJusoApiErrorContext {
  /**
   * 실패한 공개 메서드 이름입니다.
   */
  operationName: string

  /**
   * 실패 단계입니다.
   */
  requestStage?: JusoLinkRequestStage
}

/**
 * 임의 예외를 `JusoApiError`로 정규화합니다.
 */
export function normalizeJusoApiError(error: unknown, context: NormalizeJusoApiErrorContext): JusoApiError {
  if (error instanceof JusoApiError) {
    return error
  }

  if (isJusoLinkRequestStageError(error)) {
    return normalizeJusoApiError(error.cause, {
      operationName: context.operationName,
      requestStage: error.requestStage,
    })
  }

  if (isHttpResponseErrorShape(error)) {
    const remoteError = extractRemoteError(error.body)

    return new JusoApiError({
      code: remoteError?.code ?? JusoLinkErrorCodes.Unexpected,
      message: remoteError?.message ?? createFallbackMessage(error.body),
      httpStatusCode: error.status,
      operationName: context.operationName,
      requestStage: context.requestStage ?? JusoLinkRequestStages.RequestApi,
      cause: error,
    })
  }

  return new JusoApiError({
    code: JusoLinkErrorCodes.Unexpected,
    message: normalizeErrorMessage(error),
    operationName: context.operationName,
    requestStage: context.requestStage ?? JusoLinkRequestStages.RequestApi,
    cause: error,
  })
}

/**
 * 에러 핸들러를 안전하게 호출합니다.
 */
export function dispatchJusoApiErrorSafely(handler: ((error: JusoApiError) => void) | undefined, error: JusoApiError): void {
  if (!handler) {
    return
  }

  try {
    handler(error)
  } catch {
    // 사용자 에러 핸들러 예외는 원래 예외 흐름을 방해하지 않는다.
  }
}

function extractRemoteError(value: unknown): { code: number; message: string } | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }

  const candidate = value as { code?: unknown; message?: unknown }
  if (typeof candidate.code !== 'number' || typeof candidate.message !== 'string') {
    return undefined
  }

  return {
    code: candidate.code,
    message: candidate.message,
  }
}

function createFallbackMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  return normalizeErrorMessage(value)
}

interface JusoLinkRequestStageErrorShape {
  /**
   * 실패 단계입니다.
   */
  requestStage: JusoLinkRequestStage

  /**
   * 원본 예외 객체입니다.
   */
  cause: unknown
}

function isJusoLinkRequestStageError(error: unknown): error is JusoLinkRequestStageErrorShape {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('requestStage' in error) || !('cause' in error)) {
    return false
  }

  const requestStage = (error as { requestStage: unknown }).requestStage
  return requestStage === JusoLinkRequestStages.IssueToken || requestStage === JusoLinkRequestStages.RequestApi
}

interface HttpResponseErrorShape {
  /**
   * HTTP 상태 코드입니다.
   */
  status: number

  /**
   * HTTP 응답 본문입니다.
   */
  body: unknown
}

function isHttpResponseErrorShape(error: unknown): error is HttpResponseErrorShape {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('status' in error) || !('body' in error)) {
    return false
  }

  return typeof (error as { status: unknown }).status === 'number'
}
