import type { CompatConfig } from '@/config'
import { invokeUserCallback as notify } from '@/internal/callback'
import { asThrowableCompatError, toCompatRuntimeError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import { HTTAXINVOICE_METHODS } from '../methods'
import type { HTTaxinvoiceCallbackService, HTTaxinvoicePromiseService } from '../types'
import { createHTTaxinvoiceRuntimeContext } from './context'
import * as methods from './methods'
import { parseCallbackArguments } from './parsers'

export function createHTTaxinvoiceRuntimeMethods(config: CompatConfig): {
  callback: HTTaxinvoiceCallbackService
  promise: HTTaxinvoicePromiseService
} {
  const context = createHTTaxinvoiceRuntimeContext(config)
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
    getTaxinvoice: methods.requestGetTaxinvoice.bind(null, context),
    getXML: methods.requestGetXML.bind(null, context),
    getPopUpURL: methods.requestGetPopUpURL.bind(null, context),
    getPrintURL: methods.requestGetPrintURL.bind(null, context),
    getFlatRatePopUpURL: methods.requestGetFlatRatePopUpURL.bind(null, context),
    getFlatRateState: methods.requestGetFlatRateState.bind(null, context),
    getChargeInfo: methods.requestGetChargeInfo.bind(null, context),
  } satisfies HTTaxinvoicePromiseService
  async function execute(method: keyof HTTaxinvoicePromiseService, args: unknown[]): Promise<unknown> {
    const businessError = validateCorpNum(args[0] as string)
    if (businessError) throw businessError
    const invoke = requests[method] as (...args: unknown[]) => Promise<unknown>
    return invoke(...args)
  }
  const callback = Object.fromEntries(
    HTTAXINVOICE_METHODS.map((method) => [
      method,
      (...args: unknown[]) => {
        const parsed = parseCallbackArguments(args)
        void Promise.resolve()
          .then(() => execute(method, parsed.requestArgs))
          .then(
            (response) => notify(parsed.success, response),
            (error: unknown) => {
              const normalized = toCompatRuntimeError(error, `HTTaxinvoiceService.${method}`)
              notify(parsed.error ?? context.defaultErrorHandler, normalized)
            }
          )
      },
    ])
  )
  const promise = Object.fromEntries(
    HTTAXINVOICE_METHODS.map((method) => [
      method,
      async (...args: unknown[]) => {
        try {
          return await execute(method, args)
        } catch (error) {
          const normalized = asThrowableCompatError(toCompatRuntimeError(error, `HTTaxinvoiceService.${method}`))
          notify(context.defaultErrorHandler, normalized)
          throw normalized
        }
      },
    ])
  )
  return { callback: callback as unknown as HTTaxinvoiceCallbackService, promise: promise as unknown as HTTaxinvoicePromiseService }
}
