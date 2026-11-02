import type { LegacyErrorCallback, LegacySuccessCallback } from '@/services/taxinvoice/types'
import { splitLegacyCallbackArguments } from '@/services/taxinvoice/runtime/common'
import type * as Spec from '@connextable/popbill-spec'

export interface ParsedIssueOptions {
  memo: string
  emailSubject: string
  forceIssue: boolean
  userId: string
}

export interface ParsedIssueCallbackOptions extends ParsedIssueOptions {
  success?: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>
  error?: LegacyErrorCallback
}

export function parseIssueCallbackArgs(args: unknown[]): ParsedIssueCallbackOptions {
  const callbacks = splitLegacyCallbackArguments<Spec.TaxInvoiceIssueApiResponse>(args)
  return { ...parseIssuePromiseArgs(callbacks.values), success: callbacks.success, error: callbacks.error }
}

export function parseIssuePromiseArgs(args: unknown[]): ParsedIssueOptions {
  const parsed: ParsedIssueOptions = {
    memo: '',
    emailSubject: '',
    forceIssue: false,
    userId: '',
  }

  const first = args[0]
  if (typeof first === 'string') {
    parsed.memo = first
  }

  const rest = typeof first === 'string' || first == null ? args.slice(1) : args
  const option1 = rest[0]
  const option2 = rest[1]
  const option3 = rest[2]

  if (typeof option1 === 'boolean') {
    parsed.forceIssue = option1

    if (typeof option2 === 'string') {
      parsed.userId = option2
    }

    return parsed
  }

  if (typeof option1 === 'string' && rest.length === 1) {
    parsed.userId = option1
    return parsed
  }

  if (typeof option1 === 'string') {
    parsed.emailSubject = option1
  }

  if (typeof option2 === 'boolean') {
    parsed.forceIssue = option2

    if (typeof option3 === 'string') {
      parsed.userId = option3
    }

    return parsed
  }

  if (typeof option2 === 'string') {
    parsed.userId = option2
  }

  if (typeof option3 === 'string') {
    parsed.userId = option3
  }

  return parsed
}
