import type { TaxInvoiceGetUrlTogo } from '@connextable/popbill-spec'
import type {
  LegacyErrorCallback,
  LegacySuccessCallback,
} from '@/services/taxinvoice/types'
import {
  parseLegacyUserIdAndCallbacks,
  type ParsedLegacyUserIdCallbacks,
} from '@/services/taxinvoice/runtime/common'

export type TaxinvoiceUrlTarget = 'POPUP' | 'VIEW' | 'PRINT' | 'PDF' | 'EPRINT' | 'MAIL'

export interface ParsedGetUrlCallbackOptions {
  togo: TaxInvoiceGetUrlTogo
  userId: string
  success?: LegacySuccessCallback<string>
  error?: LegacyErrorCallback
}

export function parseGetUrlCallbackArgs(
  togo: TaxInvoiceGetUrlTogo,
  args: unknown[],
): ParsedGetUrlCallbackOptions {
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
