import type { LegacyErrorCallback, LegacySuccessCallback } from '@/services/taxinvoice/types'
import { splitLegacyCallbackArguments } from '@/services/taxinvoice/runtime/common'
import type * as Spec from '@connextable/popbill-spec'

export interface ParsedBulkSubmitOptions {
  forceIssue: boolean
  userId: string
}

export interface ParsedBulkSubmitCallbackOptions extends ParsedBulkSubmitOptions {
  success?: LegacySuccessCallback<Spec.TaxInvoiceBulkSubmitApiResponse>
  error?: LegacyErrorCallback
}

export function parseBulkSubmitCallbackArgs(args: unknown[]): ParsedBulkSubmitCallbackOptions {
  const callbacks = splitLegacyCallbackArguments<Spec.TaxInvoiceBulkSubmitApiResponse>(args)
  return { ...parseBulkSubmitPromiseArgs(callbacks.values), success: callbacks.success, error: callbacks.error }
}

export function parseBulkSubmitPromiseArgs(args: unknown[]): ParsedBulkSubmitOptions {
  const parsed: ParsedBulkSubmitOptions = {
    forceIssue: false,
    userId: '',
  }

  if (typeof args[0] === 'boolean') {
    parsed.forceIssue = args[0]
    if (typeof args[1] === 'string') {
      parsed.userId = args[1]
    }
    return parsed
  }

  if (args[0] === undefined && typeof args[1] === 'string') {
    parsed.userId = args[1]
    return parsed
  }

  if (typeof args[0] === 'string') {
    parsed.userId = args[0]
  }

  return parsed
}
