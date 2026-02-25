import type { TaxInvoiceGetUrlTogo, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import {
  dispatchCallbackError,
  toCompatRuntimeError,
  type CompatRuntimeError,
} from '../../../internal/errors'
import {
  validateCorpNum,
  validateMgtKey,
  validateTaxInvoiceKeyType,
  validateTaxinvoiceTogo,
} from '../../../internal/validation'
import type {
  LegacyErrorCallback,
  LegacySuccessCallback,
} from '../types'
import type { TaxinvoiceRuntimeContext } from './context'

export const SERVICE_NAME = 'TaxinvoiceService'

export type TaxinvoiceRuntimeMethodName = 'issue' | 'cancelIssue' | 'getURL' | 'getPopUpURL' | 'getViewURL' | 'getPrintURL' | 'getPDFURL' | 'getMassPrintURL' | 'getEPrintURL' | 'getMailURL'

export interface ParsedLegacyUserIdCallbacks<T> {
  userId: string
  success?: LegacySuccessCallback<T>
  error?: LegacyErrorCallback
}

export function parseLegacyUserIdAndCallbacks<T>(args: unknown[]): ParsedLegacyUserIdCallbacks<T> {
  const first = args[0]
  const second = args[1]
  const third = args[2]

  if (typeof first === 'function') {
    return {
      userId: '',
      success: first as LegacySuccessCallback<T>,
      error: asErrorCallback(second),
    }
  }

  if (typeof first === 'string') {
    return {
      userId: first,
      success: asSuccessCallback<T>(second),
      error: asErrorCallback(third),
    }
  }

  return {
    userId: '',
    success: asSuccessCallback<T>(second),
    error: asErrorCallback(third),
  }
}

export function asSuccessCallback<T>(candidate: unknown): LegacySuccessCallback<T> | undefined {
  return typeof candidate === 'function'
    ? candidate as LegacySuccessCallback<T>
    : undefined
}

export function asErrorCallback(candidate: unknown): LegacyErrorCallback | undefined {
  return typeof candidate === 'function'
    ? candidate as LegacyErrorCallback
    : undefined
}

export function handleCallbackError(
  context: TaxinvoiceRuntimeContext,
  methodName: TaxinvoiceRuntimeMethodName,
  error: unknown,
  errorCallback: LegacyErrorCallback | undefined,
): void {
  const runtimeError = toCompatRuntimeError(error, `${SERVICE_NAME}.${methodName}`)
  dispatchCallbackError(runtimeError, errorCallback, context.defaultErrorHandler)
}

export function throwPromiseError(
  context: TaxinvoiceRuntimeContext,
  methodName: TaxinvoiceRuntimeMethodName,
  error: unknown,
): never {
  const runtimeError = toCompatRuntimeError(error, `${SERVICE_NAME}.${methodName}`)
  context.defaultErrorHandler?.(runtimeError)
  throw runtimeError
}

export function validateRequiredTaxinvoiceInputs(corpNum: string, keyType: TaxInvoiceMgtKeyType, mgtKey?: string): void {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const keyTypeError = validateTaxInvoiceKeyType(keyType)
  if (keyTypeError) {
    throw keyTypeError
  }

  if (typeof mgtKey === 'string') {
    const mgtKeyError = validateMgtKey(mgtKey)
    if (mgtKeyError) {
      throw mgtKeyError
    }
  }
}

export function validateGetUrlInputs(corpNum: string, togo: TaxInvoiceGetUrlTogo): void {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const togoError = validateTaxinvoiceTogo(togo)
  if (togoError) {
    throw togoError
  }
}

export type TaxinvoiceRuntimeErrorHandler = (error: CompatRuntimeError) => void
