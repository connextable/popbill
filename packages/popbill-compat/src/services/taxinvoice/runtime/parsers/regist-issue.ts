import type { TaxInvoiceRegistIssueApiResponse } from '@connextable/popbill-spec'
import type { LegacyErrorCallback, LegacySuccessCallback } from '@/services/taxinvoice/types'
import { asErrorCallback, asSuccessCallback } from '@/services/taxinvoice/runtime/common'

export interface ParsedRegistIssueOptions {
  writeSpecification: boolean
  forceIssue: boolean
  memo: string
  emailSubject: string
  dealInvoiceMgtKey: string
  userId: string
}

export interface ParsedRegistIssueCallbackOptions extends ParsedRegistIssueOptions {
  success?: LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>
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
    parsed.success = first as LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>
    parsed.error = asErrorCallback(args[1])
    return parsed
  }

  if (typeof first === 'string' && typeof args[1] === 'function') {
    parsed.userId = first
    parsed.success = args[1] as LegacySuccessCallback<TaxInvoiceRegistIssueApiResponse>
    parsed.error = asErrorCallback(args[2])
    return parsed
  }

  let index = 0

  if (typeof args[index] === 'boolean') {
    parsed.writeSpecification = args[index] as boolean
    index += 1
  }

  if (typeof args[index] === 'boolean') {
    parsed.forceIssue = args[index] as boolean
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.memo = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.emailSubject = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.dealInvoiceMgtKey = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string' && typeof args[index + 1] === 'function') {
    parsed.userId = args[index] as string
    index += 1
  }

  parsed.success = asSuccessCallback<TaxInvoiceRegistIssueApiResponse>(args[index])
  parsed.error = asErrorCallback(args[index + 1])

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

  let index = 0

  if (typeof args[index] === 'boolean') {
    parsed.writeSpecification = args[index] as boolean
    index += 1
  }

  if (typeof args[index] === 'boolean') {
    parsed.forceIssue = args[index] as boolean
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.memo = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.emailSubject = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.dealInvoiceMgtKey = args[index] as string
    index += 1
  }

  if (typeof args[index] === 'string') {
    parsed.userId = args[index] as string
  }

  return parsed
}
