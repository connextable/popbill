import type { CompatConfig } from '@/config'
import * as services from '@/services'

export type * from '@/services'
export type { CompatConfig } from '@/config'
export { createCommonService, createCommonPromiseService } from '@/services/common'

// Common legacy methods are inherited by every published service factory.
function withCommonCallback<T extends object>(create: (config: CompatConfig) => T) {
  return (config: CompatConfig): T & services.CommonCallbackService => Object.assign(create(config), services.createCommonService(config))
}

function withCommonPromise<T extends object>(create: (config: CompatConfig) => T) {
  return (config: CompatConfig): T & services.CommonPromiseService => Object.assign(create(config), services.createCommonPromiseService(config))
}

export const createTaxinvoiceService = withCommonCallback(services.createTaxinvoiceService)
export const createTaxinvoicePromiseService = withCommonPromise(services.createTaxinvoicePromiseService)
export const createCashbillService = withCommonCallback(services.createCashbillService)
export const createCashbillPromiseService = withCommonPromise(services.createCashbillPromiseService)
export const createStatementService = withCommonCallback(services.createStatementService)
export const createStatementPromiseService = withCommonPromise(services.createStatementPromiseService)
export const createHTTaxinvoiceService = withCommonCallback(services.createHTTaxinvoiceService)
export const createHTTaxinvoicePromiseService = withCommonPromise(services.createHTTaxinvoicePromiseService)
export const createHTCashbillService = withCommonCallback(services.createHTCashbillService)
export const createHTCashbillPromiseService = withCommonPromise(services.createHTCashbillPromiseService)
export const createClosedownService = withCommonCallback(services.createClosedownService)
export const createClosedownPromiseService = withCommonPromise(services.createClosedownPromiseService)
export const createBizInfoCheckService = withCommonCallback(services.createBizInfoCheckService)
export const createBizInfoCheckPromiseService = withCommonPromise(services.createBizInfoCheckPromiseService)
export const createEasyFinBankService = withCommonCallback(services.createEasyFinBankService)
export const createEasyFinBankPromiseService = withCommonPromise(services.createEasyFinBankPromiseService)
export const createAccountCheckService = withCommonCallback(services.createAccountCheckService)
export const createAccountCheckPromiseService = withCommonPromise(services.createAccountCheckPromiseService)
export const createKakaoService = withCommonCallback(services.createKakaoService)
export const createKakaoPromiseService = withCommonPromise(services.createKakaoPromiseService)
export const createMessageService = withCommonCallback(services.createMessageService)
export const createMessagePromiseService = withCommonPromise(services.createMessagePromiseService)
export const createFaxService = withCommonCallback(services.createFaxService)
export const createFaxPromiseService = withCommonPromise(services.createFaxPromiseService)
