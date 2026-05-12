import type { LegacyErrorCallback, LegacySuccessCallback } from '@/services/taxinvoice/types'
import { parseLegacyUserIdAndCallbacks, type ParsedLegacyUserIdCallbacks } from '@/services/taxinvoice/runtime/common'
import type * as Spec from '@connextable/popbill-spec'

export type TaxinvoiceUrlTarget = 'POPUP' | 'VIEW' | 'PRINT' | 'PDF' | 'EPRINT' | 'MAIL'

export interface ParsedGetUrlCallbackOptions {
  togo: Spec.TaxInvoiceGetUrlTogo
  userId: string
  success?: LegacySuccessCallback<string>
  error?: LegacyErrorCallback
}

export function parseGetUrlCallbackArgs(togo: Spec.TaxInvoiceGetUrlTogo, args: unknown[]): ParsedGetUrlCallbackOptions {
  const parsed = parseLegacyUserIdAndCallbacks<string>(args)
  return {
    togo,
    userId: parsed.userId,
    success: parsed.success,
    error: parsed.error,
  }
}

export function parseUrlMethodCallbackArgs(args: unknown[]): ParsedLegacyUserIdCallbacks<string> {
  return parseLegacyUserIdAndCallbacks<string>(args)
}
