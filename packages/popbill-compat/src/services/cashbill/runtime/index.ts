import type { CompatConfig } from '@/config'
import { invokeUserCallback as invokeCallback } from '@/internal/callback'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { CASHBILL_METHODS } from '../methods'
import type { CashbillCallbackService, CashbillPromiseService } from '../types'
import { createCashbillRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

type RequestMethod = (...args: unknown[]) => Promise<unknown>

export function createCashbillRuntimeMethods(config: CompatConfig): { callback: CashbillCallbackService; promise: CashbillPromiseService } {
  const context = createCashbillRuntimeContext(config)
  const requests = {
    registIssue: methods.requestRegistIssue.bind(null, context),
    revokeRegistIssue: methods.requestRevokeRegistIssue.bind(null, context),
    bulkSubmit: methods.requestBulkSubmit.bind(null, context),
    getBulkResult: methods.requestGetBulkResult.bind(null, context),
    register: methods.requestRegister.bind(null, context),
    revokeRegister: methods.requestRevokeRegister.bind(null, context),
    update: methods.requestUpdate.bind(null, context),
    issue: methods.requestIssue.bind(null, context),
    cancelIssue: methods.requestCancelIssue.bind(null, context),
    delete: methods.requestDelete.bind(null, context),
    getInfo: methods.requestGetInfo.bind(null, context),
    getInfos: methods.requestGetInfos.bind(null, context),
    getDetailInfo: methods.requestGetDetailInfo.bind(null, context),
    checkMgtKeyInUse: methods.requestCheckMgtKeyInUse.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    getLogs: methods.requestGetLogs.bind(null, context),
    getURL: methods.requestGetUrl.bind(null, context),
    getPopUpURL: methods.requestGetPopUpUrl.bind(null, context),
    getViewURL: methods.requestGetViewUrl.bind(null, context),
    getPrintURL: methods.requestGetPrintUrl.bind(null, context),
    getEPrintURL: methods.requestGetEPrintUrl.bind(null, context),
    getMassPrintURL: methods.requestGetMassPrintUrl.bind(null, context),
    getMailURL: methods.requestGetMailUrl.bind(null, context),
    getPDFURL: methods.requestGetPdfUrl.bind(null, context),
    getPDF: methods.requestGetPdf.bind(null, context),
    sendEmail: methods.requestSendEmail.bind(null, context),
    sendSMS: methods.requestSendSms.bind(null, context),
    sendFAX: methods.requestSendFax.bind(null, context),
    assignMgtKey: methods.requestAssignMgtKey.bind(null, context),
    listEmailConfig: methods.requestListEmailConfig.bind(null, context),
    updateEmailConfig: methods.requestUpdateEmailConfig.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
  } satisfies CashbillPromiseService

  const callback = CASHBILL_METHODS.map((method) => [
    method,
    (...args: unknown[]) => {
      const parsed = parseCallbackArguments(args)
      const invoke = requests[method] as RequestMethod
      void invoke(...parsed.requestArgs).then(
        (result) => invokeCallback(parsed.success, result),
        (error: unknown) => {
          const normalized = toCompatRuntimeError(error, `CashbillService.${method}`)
          invokeCallback(parsed.error ?? context.defaultErrorHandler, normalized)
        }
      )
    },
  ])
  const promise = CASHBILL_METHODS.map((method) => [
    method,
    async (...args: unknown[]) => {
      try {
        return await (requests[method] as RequestMethod)(...args)
      } catch (error) {
        const normalized = asThrowableCompatError(toCompatRuntimeError(error, `CashbillService.${method}`))
        invokeCallback(context.defaultErrorHandler, normalized)
        throw normalized
      }
    },
  ])
  return {
    callback: Object.fromEntries(callback) as unknown as CashbillCallbackService,
    promise: Object.fromEntries(promise) as unknown as CashbillPromiseService,
  }
}
