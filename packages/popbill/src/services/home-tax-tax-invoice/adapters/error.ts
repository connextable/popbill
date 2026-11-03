import { invokeLookupMethod } from '@/internal/lookup-service'
import type { PopbillApiError } from '@/errors'

export async function invokeHomeTaxTaxInvoice<T>(
  context: { onError?: (error: PopbillApiError) => void },
  method: string,
  handler: () => Promise<T>
): Promise<T> {
  return invokeLookupMethod(context, `homeTaxTaxInvoice.${method}`, handler)
}
