import { getConfiguration, registerConfigurationChangeListener, setConfiguration, type CompatConfig } from '@/config'
import { MgtKeyType, KakaoType, MessageType } from '@/constants'
import { createSingleton } from '@/internal/singleton'
import {
  createTaxinvoicePromiseService,
  createCashbillPromiseService,
  createStatementPromiseService,
  createHTTaxinvoicePromiseService,
  createHTCashbillPromiseService,
  createClosedownPromiseService,
  createBizInfoCheckPromiseService,
  createEasyFinBankPromiseService,
  createAccountCheckPromiseService,
  createKakaoPromiseService,
  createMessagePromiseService,
  createFaxPromiseService,
} from '@/factory'

interface PromiseServices {
  TaxinvoiceService: ReturnType<typeof createTaxinvoicePromiseService>
  CashbillService: ReturnType<typeof createCashbillPromiseService>
  StatementService: ReturnType<typeof createStatementPromiseService>
  HTTaxinvoiceService: ReturnType<typeof createHTTaxinvoicePromiseService>
  HTCashbillService: ReturnType<typeof createHTCashbillPromiseService>
  ClosedownService: ReturnType<typeof createClosedownPromiseService>
  BizInfoCheckService: ReturnType<typeof createBizInfoCheckPromiseService>
  EasyFinBankService: ReturnType<typeof createEasyFinBankPromiseService>
  AccountCheckService: ReturnType<typeof createAccountCheckPromiseService>
  KakaoService: ReturnType<typeof createKakaoPromiseService>
  MessageService: ReturnType<typeof createMessagePromiseService>
  FaxService: ReturnType<typeof createFaxPromiseService>
}

const promiseServiceCreators = {
  TaxinvoiceService: createTaxinvoicePromiseService,
  CashbillService: createCashbillPromiseService,
  StatementService: createStatementPromiseService,
  HTTaxinvoiceService: createHTTaxinvoicePromiseService,
  HTCashbillService: createHTCashbillPromiseService,
  ClosedownService: createClosedownPromiseService,
  BizInfoCheckService: createBizInfoCheckPromiseService,
  EasyFinBankService: createEasyFinBankPromiseService,
  AccountCheckService: createAccountCheckPromiseService,
  KakaoService: createKakaoPromiseService,
  MessageService: createMessagePromiseService,
  FaxService: createFaxPromiseService,
} as const satisfies { [K in keyof PromiseServices]: (config: CompatConfig) => PromiseServices[K] }

const singleton = createSingleton<PromiseServices>()
registerConfigurationChangeListener(() => {
  singleton.clear()
})

export { MgtKeyType, KakaoType, MessageType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
}

function getService<TServiceKey extends keyof PromiseServices>(service: TServiceKey): PromiseServices[TServiceKey] {
  const creator = promiseServiceCreators[service] as (config: CompatConfig) => PromiseServices[TServiceKey]
  return singleton.get(service, () => creator(getConfiguration()))
}

export function TaxinvoiceService(): PromiseServices['TaxinvoiceService'] {
  return getService('TaxinvoiceService')
}

export function CashbillService(): PromiseServices['CashbillService'] {
  return getService('CashbillService')
}

export function StatementService(): PromiseServices['StatementService'] {
  return getService('StatementService')
}

export function HTTaxinvoiceService(): PromiseServices['HTTaxinvoiceService'] {
  return getService('HTTaxinvoiceService')
}

export function HTCashbillService(): PromiseServices['HTCashbillService'] {
  return getService('HTCashbillService')
}

export function ClosedownService(): PromiseServices['ClosedownService'] {
  return getService('ClosedownService')
}

export function BizInfoCheckService(): PromiseServices['BizInfoCheckService'] {
  return getService('BizInfoCheckService')
}

export function EasyFinBankService(): PromiseServices['EasyFinBankService'] {
  return getService('EasyFinBankService')
}

export function AccountCheckService(): PromiseServices['AccountCheckService'] {
  return getService('AccountCheckService')
}

export function KakaoService(): PromiseServices['KakaoService'] {
  return getService('KakaoService')
}

export function MessageService(): PromiseServices['MessageService'] {
  return getService('MessageService')
}

export function FaxService(): PromiseServices['FaxService'] {
  return getService('FaxService')
}
