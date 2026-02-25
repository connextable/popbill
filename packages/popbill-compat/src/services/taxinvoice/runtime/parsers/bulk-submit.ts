import type { TaxInvoiceBulkSubmitApiResponse } from '@connextable/popbill-spec'
import type {
  LegacyErrorCallback,
  LegacySuccessCallback,
} from '../../types'
import {
  asErrorCallback,
  asSuccessCallback,
} from '../common'

export interface ParsedBulkSubmitOptions {
  forceIssue: boolean
  userId: string
}

export interface ParsedBulkSubmitCallbackOptions extends ParsedBulkSubmitOptions {
  success?: LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>
  error?: LegacyErrorCallback
}

export function parseBulkSubmitCallbackArgs(args: unknown[]): ParsedBulkSubmitCallbackOptions {
  const parsed: ParsedBulkSubmitCallbackOptions = {
    forceIssue: false,
    userId: '',
  }

  const first = args[0]

  if (typeof first === 'function') {
    parsed.success = first as LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>
    parsed.error = asErrorCallback(args[1])
    return parsed
  }

  if (typeof first === 'string' && typeof args[1] === 'function') {
    parsed.userId = first
    parsed.success = args[1] as LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>
    parsed.error = asErrorCallback(args[2])
    return parsed
  }

  if (typeof first === 'boolean') {
    parsed.forceIssue = first

    if (typeof args[1] === 'string' && typeof args[2] === 'function') {
      parsed.userId = args[1]
      parsed.success = args[2] as LegacySuccessCallback<TaxInvoiceBulkSubmitApiResponse>
      parsed.error = asErrorCallback(args[3])
      return parsed
    }

    parsed.success = asSuccessCallback<TaxInvoiceBulkSubmitApiResponse>(args[1])
    parsed.error = asErrorCallback(args[2])
    return parsed
  }

  return parsed
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

  if (typeof args[0] === 'string') {
    parsed.userId = args[0]
  }

  return parsed
}
