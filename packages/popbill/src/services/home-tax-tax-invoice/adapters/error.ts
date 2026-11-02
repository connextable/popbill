import { normalizePopbillError } from '@connextable/popbill-compat/errors'
import type { PopbillApiError } from '@/errors'

export async function invokeHomeTaxTaxInvoice<T>(
  context: { onError?: (error: PopbillApiError) => void },
  method: string,
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler()
  } catch (error) {
    const normalized = normalizePopbillError(error, { operation: `homeTaxTaxInvoice.${method}` })
    const throwable = Object.assign(new Error(normalized.message), normalized)
    try {
      void Promise.resolve(context.onError?.(throwable)).catch(() => undefined)
    } catch {
      /* Preserve the API error. */
    }
    throw throwable
  }
}
