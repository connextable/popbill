import type { TaxInvoiceIssueApiResponse } from '@connextable/popbill-spec'
import type {
  LegacyErrorCallback,
  LegacySuccessCallback,
} from '../../types'
import {
  asErrorCallback,
  asSuccessCallback,
} from '../common'

export interface ParsedIssueOptions {
  memo: string
  emailSubject: string
  forceIssue: boolean
  userId: string
}

export interface ParsedIssueCallbackOptions extends ParsedIssueOptions {
  success?: LegacySuccessCallback<TaxInvoiceIssueApiResponse>
  error?: LegacyErrorCallback
}

export function parseIssueCallbackArgs(args: unknown[]): ParsedIssueCallbackOptions {
  const parsed: ParsedIssueCallbackOptions = {
    memo: '',
    emailSubject: '',
    forceIssue: false,
    userId: '',
  }

  const first = args[0]
  if (typeof first === 'function') {
    parsed.success = first as LegacySuccessCallback<TaxInvoiceIssueApiResponse>
    parsed.error = asErrorCallback(args[1])
    return parsed
  }

  if (typeof first === 'string') {
    parsed.memo = first
  }

  const rest = args.slice(1)
  const option1 = rest[0]
  const option2 = rest[1]
  const option3 = rest[2]
  const option4 = rest[3]
  const option5 = rest[4]

  if (typeof option1 === 'function') {
    parsed.success = option1 as LegacySuccessCallback<TaxInvoiceIssueApiResponse>
    parsed.error = asErrorCallback(option2)
    return parsed
  }

  if (typeof option1 === 'string' && typeof option2 === 'function') {
    parsed.userId = option1
    parsed.success = option2 as LegacySuccessCallback<TaxInvoiceIssueApiResponse>
    parsed.error = asErrorCallback(option3)
    return parsed
  }

  if (typeof option1 === 'boolean') {
    parsed.forceIssue = option1

    if (typeof option2 === 'string') {
      parsed.userId = option2
      parsed.success = asSuccessCallback<TaxInvoiceIssueApiResponse>(option3)
      parsed.error = asErrorCallback(option4)
      return parsed
    }

    parsed.success = asSuccessCallback<TaxInvoiceIssueApiResponse>(option2)
    parsed.error = asErrorCallback(option3)
    return parsed
  }

  if (typeof option1 === 'string') {
    parsed.emailSubject = option1

    if (typeof option2 === 'boolean') {
      parsed.forceIssue = option2

      if (typeof option3 === 'string') {
        parsed.userId = option3
        parsed.success = asSuccessCallback<TaxInvoiceIssueApiResponse>(option4)
        parsed.error = asErrorCallback(option5)
        return parsed
      }

      parsed.success = asSuccessCallback<TaxInvoiceIssueApiResponse>(option3)
      parsed.error = asErrorCallback(option4)
      return parsed
    }

    if (typeof option2 === 'string') {
      parsed.userId = option2
      parsed.success = asSuccessCallback<TaxInvoiceIssueApiResponse>(option3)
      parsed.error = asErrorCallback(option4)
      return parsed
    }
  }

  return parsed
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

  const rest = typeof first === 'string' ? args.slice(1) : args
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

  if (typeof option1 === 'string' && option2 === undefined) {
    parsed.userId = option1
    return parsed
  }

  if (typeof option1 === 'string') {
    parsed.emailSubject = option1

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
  }

  return parsed
}
