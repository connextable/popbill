import { isPopbillApiError } from '@connextable/popbill'

export function formatError(error: unknown): Record<string, unknown> {
  if (isPopbillApiError(error)) {
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
