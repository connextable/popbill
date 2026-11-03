import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import { invokeUserCallback } from '@connextable/popbill-utils'
import type { PopbillApiError } from '@/errors'

export async function invokeLookupMethod<T>(
  context: { onError?: (error: PopbillApiError) => void },
  operation: string,
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler()
  } catch (error) {
    const normalized = normalizePopbillError(error, { operation })
    const throwable = Object.assign(new Error(normalized.message), normalized)
    invokeUserCallback(() => context.onError?.(throwable), undefined)
    throw throwable
  }
}
