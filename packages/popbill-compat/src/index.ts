import { getConfiguration, setConfiguration, type CompatConfig } from './config'
import { MgtKeyType, MessageType, KakaoType } from './constants'
import type { CallbackService } from './adapters/callback-adapter'
import { createSingleton } from './internal/singleton'
import {
  type TaxinvoiceCallbackService,
  createAccountCheckService,
  createBizInfoCheckService,
  createCashbillService,
  createClosedownService,
  createEasyFinBankService,
  createFaxService,
  createHTCashbillService,
  createHTTaxinvoiceService,
  createKakaoService,
  createMessageService,
  createStatementService,
  createTaxinvoiceService,
} from './services'

interface CallbackServices {
  TaxinvoiceService: TaxinvoiceCallbackService
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
  TaxinvoiceService: createTaxinvoiceService,
  StatementService: createStatementService,
  CashbillService: createCashbillService,
  MessageService: createMessageService,
  KakaoService: createKakaoService,
  FaxService: createFaxService,
  HTTaxinvoiceService: createHTTaxinvoiceService,
  HTCashbillService: createHTCashbillService,
  ClosedownService: createClosedownService,
  BizInfoCheckService: createBizInfoCheckService,
  EasyFinBankService: createEasyFinBankService,
  AccountCheckService: createAccountCheckService,
} as const satisfies { [K in keyof CallbackServices]: (config: CompatConfig) => CallbackServices[K] }

const singleton = createSingleton<CallbackServices>()

export { MgtKeyType, MessageType, KakaoType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
  singleton.clear()
}

function getService<TServiceKey extends keyof CallbackServices>(service: TServiceKey): CallbackServices[TServiceKey] {
  const creator = callbackServiceCreators[service] as (config: CompatConfig) => CallbackServices[TServiceKey]
  return singleton.get(service, () => creator(getConfiguration()))
}

export function TaxinvoiceService(): TaxinvoiceCallbackService {
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
