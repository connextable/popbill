import { getConfiguration, setConfiguration, type CompatConfig } from '@/config'
import { MgtKeyType, MessageType, KakaoType } from '@/constants'
import type { PromiseService } from '@/adapters/promise-adapter'
import { createSingleton } from '@/internal/singleton'
import {
  type TaxinvoicePromiseService,
  createAccountCheckPromiseService,
  createBizInfoCheckPromiseService,
  createCashbillPromiseService,
  createClosedownPromiseService,
  createEasyFinBankPromiseService,
  createFaxPromiseService,
  createHTCashbillPromiseService,
  createHTTaxinvoicePromiseService,
  createKakaoPromiseService,
  createMessagePromiseService,
  createStatementPromiseService,
  createTaxinvoicePromiseService,
} from '@/services'

interface PromiseServices {
  TaxinvoiceService: TaxinvoicePromiseService
  StatementService: PromiseService
  CashbillService: PromiseService
  MessageService: PromiseService
  KakaoService: PromiseService
  FaxService: PromiseService
  HTTaxinvoiceService: PromiseService
  HTCashbillService: PromiseService
  ClosedownService: PromiseService
  BizInfoCheckService: PromiseService
  EasyFinBankService: PromiseService
  AccountCheckService: PromiseService
}

const promiseServiceCreators = {
  TaxinvoiceService: createTaxinvoicePromiseService,
  StatementService: createStatementPromiseService,
  CashbillService: createCashbillPromiseService,
  MessageService: createMessagePromiseService,
  KakaoService: createKakaoPromiseService,
  FaxService: createFaxPromiseService,
  HTTaxinvoiceService: createHTTaxinvoicePromiseService,
  HTCashbillService: createHTCashbillPromiseService,
  ClosedownService: createClosedownPromiseService,
  BizInfoCheckService: createBizInfoCheckPromiseService,
  EasyFinBankService: createEasyFinBankPromiseService,
  AccountCheckService: createAccountCheckPromiseService,
} as const satisfies { [K in keyof PromiseServices]: (config: CompatConfig) => PromiseServices[K] }

const singleton = createSingleton<PromiseServices>()

export { MgtKeyType, MessageType, KakaoType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
  singleton.clear()
}

function getService<TServiceKey extends keyof PromiseServices>(service: TServiceKey): PromiseServices[TServiceKey] {
  const creator = promiseServiceCreators[service] as (config: CompatConfig) => PromiseServices[TServiceKey]
  return singleton.get(service, () => creator(getConfiguration()))
}

export function TaxinvoiceService(): TaxinvoicePromiseService {
  return getService('TaxinvoiceService')
}

export function StatementService(): PromiseService {
  return getService('StatementService')
}

export function CashbillService(): PromiseService {
  return getService('CashbillService')
}

export function MessageService(): PromiseService {
  return getService('MessageService')
}

export function KakaoService(): PromiseService {
  return getService('KakaoService')
}

export function FaxService(): PromiseService {
  return getService('FaxService')
}

export function HTTaxinvoiceService(): PromiseService {
  return getService('HTTaxinvoiceService')
}

export function HTCashbillService(): PromiseService {
  return getService('HTCashbillService')
}

export function ClosedownService(): PromiseService {
  return getService('ClosedownService')
}

export function BizInfoCheckService(): PromiseService {
  return getService('BizInfoCheckService')
}

export function EasyFinBankService(): PromiseService {
  return getService('EasyFinBankService')
}

export function AccountCheckService(): PromiseService {
  return getService('AccountCheckService')
}
