import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import type { PopbillApiError } from '@/errors'
export async function invokeMessageMethod<T>(
  context: { onError?: (error: PopbillApiError) => void },
  operation: string,
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler()
  } catch (error) {
    const normalized = normalizePopbillError(error, { operation })
    const throwable = Object.assign(new Error(normalized.message), normalized)
    try {
      void Promise.resolve(context.onError?.(throwable)).catch(() => undefined)
    } catch {
      /* Keep the original API error. */
    }
    throw throwable
  }
}
