import type { PopbillApiError } from '@connextable/popbill'

export function formatError(error: unknown): Record<string, unknown> {
  if (isPopbillApiErrorLike(error)) {
    return {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      operation: error.operation,
      domain: error.domain,
      type: error.type,
      stage: error.stage,
      knownCode: error.knownCode,
      retriable: error.retriable,
      status: error.status,
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

function isPopbillApiErrorLike(error: unknown): error is PopbillApiError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('code' in error) || !('message' in error) || !('userMessage' in error)) {
    return false
  }

  return (
    typeof (error as { code: unknown }).code === 'number' &&
    typeof (error as { message: unknown }).message === 'string' &&
    typeof (error as { userMessage: unknown }).userMessage === 'string'
  )
}
