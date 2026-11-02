import type { CompatConfig } from '@/config'
import { invokeUserCallback as invokeCallback } from '@/internal/callback'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { EASY_FIN_BANK_METHODS } from '../methods'
import type { EasyFinBankCallbackService, EasyFinBankPromiseService } from '../types'
import { createEasyFinBankRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

export function createEasyFinBankRuntimeMethods(config: CompatConfig): { callback: EasyFinBankCallbackService; promise: EasyFinBankPromiseService } {
  const context = createEasyFinBankRuntimeContext(config)
  const requests = {
    getBankAccountMgtURL: methods.requestGetBankAccountMgtURL.bind(null, context),
    registBankAccount: methods.requestRegistBankAccount.bind(null, context),
    updateBankAccount: methods.requestUpdateBankAccount.bind(null, context) as EasyFinBankPromiseService['updateBankAccount'],
    getBankAccountInfo: methods.requestGetBankAccountInfo.bind(null, context),
    listBankAccount: methods.requestListBankAccount.bind(null, context),
    closeBankAccount: methods.requestCloseBankAccount.bind(null, context),
    revokeCloseBankAccount: methods.requestRevokeCloseBankAccount.bind(null, context),
    deleteBankAccount: methods.requestDeleteBankAccount.bind(null, context),
    requestJob: methods.requestRequestJob.bind(null, context),
    getJobState: methods.requestGetJobState.bind(null, context),
    listActiveJob: methods.requestListActiveJob.bind(null, context),
    search: methods.requestSearch.bind(null, context),
    summary: methods.requestSummary.bind(null, context),
    saveMemo: methods.requestSaveMemo.bind(null, context),
    getFlatRatePopUpURL: methods.requestGetFlatRatePopUpURL.bind(null, context),
    getFlatRateState: methods.requestGetFlatRateState.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  } satisfies EasyFinBankPromiseService
  type RequestMethod = (...args: unknown[]) => Promise<unknown>
  return {
    callback: Object.fromEntries(
      EASY_FIN_BANK_METHODS.map((method) => [
        method,
        (...args: unknown[]) => {
          const parsed = parseCallbackArguments(args)
          void (requests[method] as RequestMethod)(...parsed.requestArgs).then(
            (result) => invokeCallback(parsed.success, result),
            (error) => invokeCallback(parsed.error ?? config.defaultErrorHandler, toCompatRuntimeError(error, `EasyFinBankService.${method}`))
          )
        },
      ])
    ) as unknown as EasyFinBankCallbackService,
    promise: Object.fromEntries(
      EASY_FIN_BANK_METHODS.map((method) => [
        method,
        async (...args: unknown[]) => {
          try {
            return await (requests[method] as RequestMethod)(...args)
          } catch (error) {
            const throwable = asThrowableCompatError(toCompatRuntimeError(error, `EasyFinBankService.${method}`))
            invokeCallback(config.defaultErrorHandler, throwable)
            throw throwable
          }
        },
      ])
    ) as unknown as EasyFinBankPromiseService,
  }
}
