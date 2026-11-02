import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import type { PopbillApiError } from '@/errors'

/** 에러 훅의 동기·비동기 실패와 관계없이 원래 API 에러를 보존합니다. */
export async function invokeStatementMethod<T>(
  context: { onError?: (error: PopbillApiError) => void },
  operation: string,
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler()
  } catch (error) {
    const normalizedError = normalizePopbillError(error, { operation })
    const throwableError = Object.assign(new Error(normalizedError.message), normalizedError)
    try {
      void Promise.resolve(context.onError?.(throwableError)).catch(() => undefined)
    } catch {
      // 에러 훅의 실패는 API 오류를 덮어쓰지 않습니다.
    }
    throw throwableError
  }
}
