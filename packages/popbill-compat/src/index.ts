import { getConfiguration, registerConfigurationChangeListener, setConfiguration, type CompatConfig } from './config'
import { MgtKeyType, KakaoType, MessageType } from './constants'
import { createSingleton } from './internal/singleton'
import * as services from './factory'

interface CallbackServices {
  TaxinvoiceService: ReturnType<typeof services.createTaxinvoiceService>
  CashbillService: ReturnType<typeof services.createCashbillService>
  StatementService: ReturnType<typeof services.createStatementService>
  HTTaxinvoiceService: ReturnType<typeof services.createHTTaxinvoiceService>
  HTCashbillService: ReturnType<typeof services.createHTCashbillService>
  ClosedownService: ReturnType<typeof services.createClosedownService>
  BizInfoCheckService: ReturnType<typeof services.createBizInfoCheckService>
  EasyFinBankService: ReturnType<typeof services.createEasyFinBankService>
  AccountCheckService: ReturnType<typeof services.createAccountCheckService>
  KakaoService: ReturnType<typeof services.createKakaoService>
  MessageService: ReturnType<typeof services.createMessageService>
  FaxService: ReturnType<typeof services.createFaxService>
}

const callbackServiceCreators = {
  TaxinvoiceService: services.createTaxinvoiceService,
  CashbillService: services.createCashbillService,
  StatementService: services.createStatementService,
  HTTaxinvoiceService: services.createHTTaxinvoiceService,
  HTCashbillService: services.createHTCashbillService,
  ClosedownService: services.createClosedownService,
  BizInfoCheckService: services.createBizInfoCheckService,
  EasyFinBankService: services.createEasyFinBankService,
  AccountCheckService: services.createAccountCheckService,
  KakaoService: services.createKakaoService,
  MessageService: services.createMessageService,
  FaxService: services.createFaxService,
} as const satisfies { [K in keyof CallbackServices]: (config: CompatConfig) => CallbackServices[K] }

const singleton = createSingleton<CallbackServices>()
registerConfigurationChangeListener(() => {
  singleton.clear()
})

export { MgtKeyType, KakaoType, MessageType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
}

function getService<TServiceKey extends keyof CallbackServices>(service: TServiceKey): CallbackServices[TServiceKey] {
  const creator = callbackServiceCreators[service] as (config: CompatConfig) => CallbackServices[TServiceKey]
  return singleton.get(service, () => creator(getConfiguration()))
}

export function TaxinvoiceService(): CallbackServices['TaxinvoiceService'] {
  return getService('TaxinvoiceService')
}

export function CashbillService(): CallbackServices['CashbillService'] {
  return getService('CashbillService')
}

export function StatementService(): CallbackServices['StatementService'] {
  return getService('StatementService')
}

export function HTTaxinvoiceService(): CallbackServices['HTTaxinvoiceService'] {
  return getService('HTTaxinvoiceService')
}

export function HTCashbillService(): CallbackServices['HTCashbillService'] {
  return getService('HTCashbillService')
}

export function ClosedownService(): CallbackServices['ClosedownService'] {
  return getService('ClosedownService')
}

export function BizInfoCheckService(): CallbackServices['BizInfoCheckService'] {
  return getService('BizInfoCheckService')
}

export function EasyFinBankService(): CallbackServices['EasyFinBankService'] {
  return getService('EasyFinBankService')
}

export function AccountCheckService(): CallbackServices['AccountCheckService'] {
  return getService('AccountCheckService')
}

export function KakaoService(): CallbackServices['KakaoService'] {
  return getService('KakaoService')
}

export function MessageService(): CallbackServices['MessageService'] {
  return getService('MessageService')
}

export function FaxService(): CallbackServices['FaxService'] {
  return getService('FaxService')
}
