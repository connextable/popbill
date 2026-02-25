import type {
  TaxInvoiceSearchApiResponse,
} from '@connextable/popbill-spec'
import type {
  LegacyErrorCallback,
  LegacySuccessCallback,
} from '@/services/taxinvoice/types'
import {
  asErrorCallback,
  asSuccessCallback,
} from '@/services/taxinvoice/runtime/common'

export interface ParsedSearchOptions {
  taxRegIDType: string
  taxRegIDYN: string
  taxRegID: string
  qString: string
  interOPYN: string
  userId: string
  issueType?: string[]
  regType?: string[]
  closeDownState?: (0 | 1 | 2 | 3 | 4)[]
  mgtKey: string
}

export interface ParsedSearchCallbackOptions extends ParsedSearchOptions {
  success?: LegacySuccessCallback<TaxInvoiceSearchApiResponse>
  error?: LegacyErrorCallback
}

export function parseSearchCallbackArgs(args: unknown[]): ParsedSearchCallbackOptions {
  const parsed: ParsedSearchCallbackOptions = {
    taxRegIDType: '',
    taxRegIDYN: '',
    taxRegID: '',
    qString: '',
    interOPYN: '',
    userId: '',
    mgtKey: '',
  }

  const successIndex = args.findIndex(candidate => typeof candidate === 'function')
  const valueArgs = successIndex === -1 ? args : args.slice(0, successIndex)

  if (successIndex !== -1) {
    parsed.success = asSuccessCallback<TaxInvoiceSearchApiResponse>(args[successIndex])
    parsed.error = asErrorCallback(args[successIndex + 1])
  }

  if (valueArgs.length === 0) {
    return parsed
  }

  if (valueArgs.length === 1 && typeof valueArgs[0] === 'string') {
    parsed.userId = valueArgs[0]
    return parsed
  }

  if (valueArgs.length === 4) {
    parsed.taxRegIDType = asString(valueArgs[0])
    parsed.taxRegIDYN = asString(valueArgs[1])
    parsed.taxRegID = asString(valueArgs[2])
    parsed.userId = asString(valueArgs[3])
    return parsed
  }

  if (valueArgs.length === 5) {
    parsed.taxRegIDType = asString(valueArgs[0])
    parsed.taxRegIDYN = asString(valueArgs[1])
    parsed.taxRegID = asString(valueArgs[2])
    parsed.qString = asString(valueArgs[3])
    parsed.userId = asString(valueArgs[4])
    return parsed
  }

  parsed.taxRegIDType = asString(valueArgs[0])
  parsed.taxRegIDYN = asString(valueArgs[1])
  parsed.taxRegID = asString(valueArgs[2])
  parsed.qString = asString(valueArgs[3])
  parsed.interOPYN = asString(valueArgs[4])
  parsed.userId = asString(valueArgs[5])
  parsed.issueType = asStringArray(valueArgs[6])
  parsed.regType = asStringArray(valueArgs[7])
  parsed.closeDownState = asCloseDownStateArray(valueArgs[8])
  parsed.mgtKey = asString(valueArgs[9])

  return parsed
}

export function parseSearchPromiseArgs(args: unknown[]): ParsedSearchOptions {
  const parsed: ParsedSearchOptions = {
    taxRegIDType: '',
    taxRegIDYN: '',
    taxRegID: '',
    qString: '',
    interOPYN: '',
    userId: '',
    mgtKey: '',
  }

  if (args.length === 1 && typeof args[0] === 'string') {
    parsed.userId = args[0]
    return parsed
  }

  parsed.taxRegIDType = asString(args[0])
  parsed.taxRegIDYN = asString(args[1])
  parsed.taxRegID = asString(args[2])
  parsed.qString = asString(args[3])
  parsed.interOPYN = asString(args[4])
  parsed.userId = asString(args[5])
  parsed.issueType = asStringArray(args[6])
  parsed.regType = asStringArray(args[7])
  parsed.closeDownState = asCloseDownStateArray(args[8])
  parsed.mgtKey = asString(args[9])

  return parsed
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.filter((entry): entry is string => typeof entry === 'string')
}

function asCloseDownStateArray(value: unknown): (0 | 1 | 2 | 3 | 4)[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value
    .filter((entry): entry is number => typeof entry === 'number')
    .filter((entry): entry is 0 | 1 | 2 | 3 | 4 => entry === 0 || entry === 1 || entry === 2 || entry === 3 || entry === 4)
}
