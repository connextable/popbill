import type { LegacyErrorCallback, LegacySuccessCallback } from '@/services/taxinvoice/types'
import { asErrorCallback } from '@/services/taxinvoice/runtime/common'
import type * as Spec from '@connextable/popbill-spec'

export interface ParsedRegistIssueOptions {
  writeSpecification: boolean
  forceIssue: boolean
  memo: string
  emailSubject: string
  dealInvoiceMgtKey: string
  userId: string
}

export interface ParsedRegistIssueCallbackOptions extends ParsedRegistIssueOptions {
  success?: LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>
  error?: LegacyErrorCallback
}

export function parseRegistIssueCallbackArgs(args: unknown[]): ParsedRegistIssueCallbackOptions {
  const parsed: ParsedRegistIssueCallbackOptions = {
    writeSpecification: false,
    forceIssue: false,
    memo: '',
    emailSubject: '',
    dealInvoiceMgtKey: '',
    userId: '',
  }

  const first = args[0]
  if (typeof first === 'function') {
    parsed.success = first as LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>
    parsed.error = asErrorCallback(args[1])
    return parsed
  }

  if (typeof first === 'string' && typeof args[1] === 'function') {
    parsed.userId = first
    parsed.success = args[1] as LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>
    parsed.error = asErrorCallback(args[2])
    return parsed
  }

  applyRegistIssueFixedOptions(parsed, args)

  const callbackIndex = args.findIndex((arg) => typeof arg === 'function')
  if (callbackIndex >= 0) {
    parsed.success = args[callbackIndex] as LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>
    parsed.error = asErrorCallback(args[callbackIndex + 1])
  }

  return parsed
}

export function parseRegistIssuePromiseArgs(args: unknown[]): ParsedRegistIssueOptions {
  const parsed: ParsedRegistIssueOptions = {
    writeSpecification: false,
    forceIssue: false,
    memo: '',
    emailSubject: '',
    dealInvoiceMgtKey: '',
    userId: '',
  }

  applyRegistIssueFixedOptions(parsed, args)

  return parsed
}

function applyRegistIssueFixedOptions(parsed: ParsedRegistIssueOptions, args: unknown[]): void {
  if (typeof args[0] === 'boolean') {
    parsed.writeSpecification = args[0]
  }

  if (typeof args[1] === 'boolean') {
    parsed.forceIssue = args[1]
  }

  if (typeof args[2] === 'string') {
    parsed.memo = args[2]
  }

  if (typeof args[3] === 'string') {
    parsed.emailSubject = args[3]
  }

  if (typeof args[4] === 'string') {
    parsed.dealInvoiceMgtKey = args[4]
  }

  if (typeof args[5] === 'string') {
    parsed.userId = args[5]
  }
}
