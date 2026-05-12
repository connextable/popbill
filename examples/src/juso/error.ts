import type { JusoApiError } from '@connextable/popbill-juso'

export function formatJusoError(error: unknown): Record<string, unknown> {
  if (isJusoApiErrorLike(error)) {
    return {
      code: error.code,
      message: error.message,
      operationName: error.operationName,
      requestStage: error.requestStage,
      httpStatusCode: error.httpStatusCode,
    }
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    }
  }

  return { raw: error }
}

function isJusoApiErrorLike(error: unknown): error is JusoApiError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('code' in error) || !('message' in error) || !('operationName' in error) || !('requestStage' in error)) {
    return false
  }

  return (
    typeof (error as { code: unknown }).code === 'number' &&
    typeof (error as { message: unknown }).message === 'string' &&
    typeof (error as { operationName: unknown }).operationName === 'string' &&
    typeof (error as { requestStage: unknown }).requestStage === 'string'
  )
}
