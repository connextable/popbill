import { invokeUserCallback as invokeCallback } from '@/internal/callback'
import type { CompatConfig } from '@/config'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { FAX_METHODS } from '../methods'
import type { FaxCallbackService, FaxPromiseService } from '../types'
import { createFaxRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

type RequestMethod = (...args: unknown[]) => Promise<unknown>

export function createFaxRuntimeMethods(config: CompatConfig): { callback: FaxCallbackService; promise: FaxPromiseService } {
  const context = createFaxRuntimeContext(config)
  const requests = {
    getSenderNumberMgtURL: methods.requestGetSenderNumberMgtURL.bind(null, context),
    getSenderNumberList: methods.requestGetSenderNumberList.bind(null, context),
    checkSenderNumber: methods.requestCheckSenderNumber.bind(null, context),
    sendFax: methods.requestSendFax.bind(null, context),
    sendFaxBinary: methods.requestSendFaxBinary.bind(null, context),
    resendFax: methods.requestResendFax.bind(null, context),
    resendFaxRN: methods.requestResendFaxRN.bind(null, context),
    cancelReserve: methods.requestCancelReserve.bind(null, context),
    cancelReserveRN: methods.requestCancelReserveRN.bind(null, context),
    getFaxResult: methods.requestGetFaxResult.bind(null, context),
    getFaxResultRN: methods.requestGetFaxResultRN.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    getURL: methods.requestGetURL.bind(null, context),
    getSentListURL: methods.requestGetSentListURL.bind(null, context),
    getPreviewURL: methods.requestGetPreviewURL.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  } satisfies FaxPromiseService
  const callback = FAX_METHODS.map((method) => [
    method,
    (...args: unknown[]) => {
      const parsed = parseCallbackArguments(args)
      const invoke = requests[method] as RequestMethod
      void invoke(...parsed.requestArgs).then(
        (result) => invokeCallback(parsed.success, result),
        (error: unknown) => invokeCallback(parsed.error ?? context.defaultErrorHandler, toCompatRuntimeError(error, `FaxService.${method}`))
      )
    },
  ])
  const promise = FAX_METHODS.map((method) => [
    method,
    async (...args: unknown[]) => {
      try {
        return await (requests[method] as RequestMethod)(...args)
      } catch (error) {
        const normalized = asThrowableCompatError(toCompatRuntimeError(error, `FaxService.${method}`))
        invokeCallback(context.defaultErrorHandler, normalized)
        throw normalized
      }
    },
  ])
  return {
    callback: Object.fromEntries(callback) as unknown as FaxCallbackService,
    promise: Object.fromEntries(promise) as unknown as FaxPromiseService,
  }
}
