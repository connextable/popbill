import {
  asThrowableCompatError,
  dispatchCallbackError,
  createLegacyValidationError,
  toCompatRuntimeError,
  type CompatRuntimeError,
} from '@/internal/errors'
import { validateCorpNum, validateMgtKey, validateTaxInvoiceKeyType, validateTaxinvoiceTogo } from '@/internal/validation'
import { invokeUserCallback } from '@/internal/callback'
import type { LegacyErrorCallback, LegacySuccessCallback, TaxinvoicePromiseService } from '@/services/taxinvoice/types'
import type { TaxinvoiceRuntimeContext } from './context'
import type * as Spec from '@connextable/popbill-spec'

export const SERVICE_NAME = 'TaxinvoiceService'

export type TaxinvoiceRuntimeMethods = keyof TaxinvoicePromiseService

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
    // With two slots, undefined is the omitted success callback in the short form.
    // An explicit undefined UserID therefore requires both callback slots.
    success: asSuccessCallback<T>(args.length >= 3 ? second : first),
    error: asErrorCallback(args.length >= 3 ? third : second),
  }
}

export function asSuccessCallback<T>(candidate: unknown): LegacySuccessCallback<T> | undefined {
  return typeof candidate === 'function' ? (candidate as LegacySuccessCallback<T>) : undefined
}

export function asErrorCallback(candidate: unknown): LegacyErrorCallback | undefined {
  return typeof candidate === 'function' ? (candidate as LegacyErrorCallback) : undefined
}

/** Resolve omitted success callbacks before interpreting optional argument values. */
export function splitLegacyCallbackArguments<T>(args: unknown[], callbackPositions?: readonly number[]) {
  const firstCallback = args.findIndex((value) => typeof value === 'function')
  if (firstCallback === -1) return { values: args, success: undefined, error: undefined }
  const omittedSuccessPosition = firstCallback - 1
  const isErrorOnly =
    firstCallback === args.length - 1 &&
    omittedSuccessPosition >= 0 &&
    args[omittedSuccessPosition] == null &&
    (callbackPositions === undefined || callbackPositions.includes(omittedSuccessPosition))
  const callbackPosition = isErrorOnly ? omittedSuccessPosition : firstCallback
  return {
    values: args.slice(0, callbackPosition),
    success: asSuccessCallback<T>(args[callbackPosition]),
    error: asErrorCallback(args[callbackPosition + 1]),
  }
}

export function handleCallbackError(
  context: TaxinvoiceRuntimeContext,
  methods: TaxinvoiceRuntimeMethods,
  error: unknown,
  errorCallback: LegacyErrorCallback | undefined
): void {
  const runtimeError = toCompatRuntimeError(error, `${SERVICE_NAME}.${methods}`)
  dispatchCallbackError(runtimeError, errorCallback, context.defaultErrorHandler)
}

export function throwPromiseError(context: TaxinvoiceRuntimeContext, methods: TaxinvoiceRuntimeMethods, error: unknown): never {
  const runtimeError = toCompatRuntimeError(error, `${SERVICE_NAME}.${methods}`)
  const throwableError = asThrowableCompatError(runtimeError)
  invokeUserCallback(context.defaultErrorHandler, throwableError)
  throw throwableError
}

export function validateRequiredTaxinvoiceInputs(corpNum: string, keyType: Spec.TaxInvoiceMgtKeyType, mgtKey?: unknown): void {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const keyTypeError = validateTaxInvoiceKeyType(keyType)
  if (keyTypeError) {
    throw keyTypeError
  }

  if (arguments.length >= 3) {
    const mgtKeyError = validateMgtKey(mgtKey)
    if (mgtKeyError) {
      throw mgtKeyError
    }
  }
}

export function validateTaxinvoiceKeyTypeAllowed(
  keyType: Spec.TaxInvoiceMgtKeyType,
  allowed: readonly Spec.TaxInvoiceMgtKeyType[],
  message = '문서번호유형이 올바르지 않습니다.'
): void {
  if (allowed.includes(keyType)) {
    return
  }

  throw createLegacyValidationError(message)
}

export function encodePathSegment(value: string): string {
  return encodeURIComponent(value)
}

export function validateGetUrlInputs(corpNum: string, togo: Spec.TaxInvoiceGetUrlTogo): void {
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
