import type { CompatConfig } from '@/config'
import { invokeUserCallback } from '@/internal/callback'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import { HTCASHBILL_METHODS } from '../methods'
import type { HTCashbillCallbackService, HTCashbillPromiseService } from '../types'
import { createHTCashbillRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

type RequestMethod = (...args: unknown[]) => Promise<unknown>

export function createHTCashbillRuntimeMethods(config: CompatConfig): { callback: HTCashbillCallbackService; promise: HTCashbillPromiseService } {
  const context = createHTCashbillRuntimeContext(config)
  const requests = {
    getCertificatePopUpURL: methods.requestGetCertificatePopUpURL.bind(null, context),
    getCertificateExpireDate: methods.requestGetCertificateExpireDate.bind(null, context),
    checkCertValidation: methods.requestCheckCertValidation.bind(null, context),
    registDeptUser: methods.requestRegistDeptUser.bind(null, context),
    checkDeptUser: methods.requestCheckDeptUser.bind(null, context),
    checkLoginDeptUser: methods.requestCheckLoginDeptUser.bind(null, context),
    deleteDeptUser: methods.requestDeleteDeptUser.bind(null, context),
    requestJob: methods.requestRequestJob.bind(null, context),
    getJobState: methods.requestGetJobState.bind(null, context),
    listActiveJob: methods.requestListActiveJob.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    summary: methods.requestSummary.bind(null, context),
    getFlatRatePopUpURL: methods.requestGetFlatRatePopUpURL.bind(null, context),
    getFlatRateState: methods.requestGetFlatRateState.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  }
  const callback = HTCASHBILL_METHODS.map((method) => [
    method,
    (...args: unknown[]) => {
      const parsed = parseCallbackArguments(args)
      const invoke = requests[method] as RequestMethod
      void Promise.resolve()
        .then(() => {
          const validationError = validateCorpNum(parsed.requestArgs[0] as string)
          if (validationError) throw validationError
          return invoke(...parsed.requestArgs)
        })
        .then(
          (response) => invokeUserCallback(parsed.success, response),
          (error: unknown) =>
            invokeUserCallback(parsed.error ?? context.defaultErrorHandler, toCompatRuntimeError(error, `HTCashbillService.${method}`))
        )
    },
  ])
  const promise = HTCASHBILL_METHODS.map((method) => [
    method,
    async (...args: unknown[]) => {
      try {
        const validationError = validateCorpNum(args[0] as string)
        if (validationError) throw validationError
        return await (requests[method] as RequestMethod)(...args)
      } catch (error) {
        const runtimeError = asThrowableCompatError(toCompatRuntimeError(error, `HTCashbillService.${method}`))
        invokeUserCallback(context.defaultErrorHandler, runtimeError)
        throw runtimeError
      }
    },
  ])
  return {
    callback: Object.fromEntries(callback) as unknown as HTCashbillCallbackService,
    promise: Object.fromEntries(promise) as unknown as HTCashbillPromiseService,
  }
}
