import { getConfiguration, registerConfigurationChangeListener, setConfiguration, type CompatConfig } from './config'
import { MgtKeyType, MessageType, KakaoType } from './constants'
import type { CallbackService } from './adapters/callback-adapter'
import { createSingleton } from './internal/singleton'
import * as services from './services'

interface CallbackServices {
  TaxinvoiceService: services.TaxinvoiceCallbackService
  StatementService: CallbackService
  CashbillService: CallbackService
  MessageService: CallbackService
  KakaoService: CallbackService
  FaxService: CallbackService
  HTTaxinvoiceService: CallbackService
  HTCashbillService: CallbackService
  ClosedownService: CallbackService
  BizInfoCheckService: CallbackService
  EasyFinBankService: CallbackService
  AccountCheckService: CallbackService
}

const callbackServiceCreators = {
  TaxinvoiceService: services.createTaxinvoiceService,
  StatementService: services.createStatementService,
  CashbillService: services.createCashbillService,
  MessageService: services.createMessageService,
  KakaoService: services.createKakaoService,
  FaxService: services.createFaxService,
  HTTaxinvoiceService: services.createHTTaxinvoiceService,
  HTCashbillService: services.createHTCashbillService,
  ClosedownService: services.createClosedownService,
  BizInfoCheckService: services.createBizInfoCheckService,
  EasyFinBankService: services.createEasyFinBankService,
  AccountCheckService: services.createAccountCheckService,
} as const satisfies { [K in keyof CallbackServices]: (config: CompatConfig) => CallbackServices[K] }

const singleton = createSingleton<CallbackServices>()
registerConfigurationChangeListener(() => {
  singleton.clear()
})

export { MgtKeyType, MessageType, KakaoType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
}

function getService<TServiceKey extends keyof CallbackServices>(service: TServiceKey): CallbackServices[TServiceKey] {
  const creator = callbackServiceCreators[service] as (config: CompatConfig) => CallbackServices[TServiceKey]
  return singleton.get(service, () => creator(getConfiguration()))
}

export function TaxinvoiceService(): services.TaxinvoiceCallbackService {
  return getService('TaxinvoiceService')
}

export function StatementService(): CallbackService {
  return getService('StatementService')
}

export function CashbillService(): CallbackService {
  return getService('CashbillService')
}

export function MessageService(): CallbackService {
  return getService('MessageService')
}

export function KakaoService(): CallbackService {
  return getService('KakaoService')
}

export function FaxService(): CallbackService {
  return getService('FaxService')
}

export function HTTaxinvoiceService(): CallbackService {
  return getService('HTTaxinvoiceService')
}

export function HTCashbillService(): CallbackService {
  return getService('HTCashbillService')
}

export function ClosedownService(): CallbackService {
  return getService('ClosedownService')
}

export function BizInfoCheckService(): CallbackService {
  return getService('BizInfoCheckService')
}

export function EasyFinBankService(): CallbackService {
  return getService('EasyFinBankService')
}

export function AccountCheckService(): CallbackService {
  return getService('AccountCheckService')
}
