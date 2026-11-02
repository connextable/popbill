import type { CompatConfig } from '@/config'
import { invokeUserCallback } from '@/internal/callback'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { STATEMENT_METHODS } from '@/services/statement/methods'
import type { StatementCallbackService, StatementPromiseService } from '@/services/statement/types'
import { createStatementRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

type RequestMethod = (...args: unknown[]) => Promise<unknown>

export function createStatementRuntimeMethods(config: CompatConfig): {
  callback: StatementCallbackService
  promise: StatementPromiseService
} {
  const context = createStatementRuntimeContext(config)
  const { defaultErrorHandler } = context
  const requests = {
    registIssue: methods.requestRegistIssue.bind(null, context),
    register: methods.requestRegister.bind(null, context),
    update: methods.requestUpdate.bind(null, context),
    issue: methods.requestIssue.bind(null, context),
    cancel: methods.requestCancel.bind(null, context),
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
    getSealURL: methods.requestGetSealUrl.bind(null, context),
    attachFile: methods.requestAttachFile.bind(null, context),
    attachFileBinary: methods.requestAttachFileBinary.bind(null, context),
    deleteFile: methods.requestDeleteFile.bind(null, context),
    getFiles: methods.requestGetFiles.bind(null, context),
    sendEmail: methods.requestSendEmail.bind(null, context),
    sendSMS: methods.requestSendSms.bind(null, context),
    sendFAX: methods.requestSendFax.bind(null, context),
    FAXSend: methods.requestFaxSend.bind(null, context),
    attachStatement: methods.requestAttachStatement.bind(null, context),
    detachStatement: methods.requestDetachStatement.bind(null, context),
    listEmailConfig: methods.requestListEmailConfig.bind(null, context),
    updateEmailConfig: methods.requestUpdateEmailConfig.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
    getUnitCost: methods.requestGetUnitCost.bind(null, context),
  } satisfies StatementPromiseService

  const callback = STATEMENT_METHODS.map((method) => [
    method,
    (...args: unknown[]) => {
      const parsed = parseCallbackArguments(args)
      const requestArgs = normalizeCallbackOptions(method, parsed.requestArgs)
      const invoke = requests[method] as RequestMethod
      void invoke(...requestArgs).then(
        (response) => invokeUserCallback(parsed.success, response),
        (error: unknown) => {
          const runtimeError = toCompatRuntimeError(error, `StatementService.${method}`)
          if (parsed.error) invokeUserCallback(parsed.error, runtimeError)
          else invokeUserCallback(defaultErrorHandler, runtimeError)
        }
      )
    },
  ])
  const promise = STATEMENT_METHODS.map((method) => [
    method,
    async (...args: unknown[]) => {
      try {
        const invoke = requests[method] as RequestMethod
        return await invoke(...args)
      } catch (error) {
        const runtimeError = asThrowableCompatError(toCompatRuntimeError(error, `StatementService.${method}`))
        invokeUserCallback(defaultErrorHandler, runtimeError)
        throw runtimeError
      }
    },
  ])

  return {
    callback: Object.fromEntries(callback) as unknown as StatementCallbackService,
    promise: Object.fromEntries(promise) as unknown as StatementPromiseService,
  }
}

function normalizeCallbackOptions(method: keyof StatementPromiseService, args: unknown[]): unknown[] {
  // Legacy issue's shorter overload places UserID directly after Memo.
  if (method === 'issue' && args.length === 5) return [...args.slice(0, 4), '', args[4]]
  return args
}
