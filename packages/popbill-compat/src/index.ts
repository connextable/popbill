import { getConfiguration, setConfiguration, type CompatConfig } from './config'
import { MgtKeyType, MessageType, KakaoType } from './constants'
import type { CallbackService } from './adapters/callback-adapter'
import {
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

const serviceCache = new Map<string, CallbackService>()

export { MgtKeyType, MessageType, KakaoType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
  serviceCache.clear()
}

function getOrCreate(name: string, creator: (config: CompatConfig) => CallbackService): CallbackService {
  const cached = serviceCache.get(name)
  if (cached) {
    return cached
  }

  const created = creator(getConfiguration())
  serviceCache.set(name, created)
  return created
}

export function TaxinvoiceService(): CallbackService {
  return getOrCreate('TaxinvoiceService', createTaxinvoiceService)
}

export function StatementService(): CallbackService {
  return getOrCreate('StatementService', createStatementService)
}

export function CashbillService(): CallbackService {
  return getOrCreate('CashbillService', createCashbillService)
}

export function MessageService(): CallbackService {
  return getOrCreate('MessageService', createMessageService)
}

export function KakaoService(): CallbackService {
  return getOrCreate('KakaoService', createKakaoService)
}

export function FaxService(): CallbackService {
  return getOrCreate('FaxService', createFaxService)
}

export function HTTaxinvoiceService(): CallbackService {
  return getOrCreate('HTTaxinvoiceService', createHTTaxinvoiceService)
}

export function HTCashbillService(): CallbackService {
  return getOrCreate('HTCashbillService', createHTCashbillService)
}

export function ClosedownService(): CallbackService {
  return getOrCreate('ClosedownService', createClosedownService)
}

export function BizInfoCheckService(): CallbackService {
  return getOrCreate('BizInfoCheckService', createBizInfoCheckService)
}

export function EasyFinBankService(): CallbackService {
  return getOrCreate('EasyFinBankService', createEasyFinBankService)
}

export function AccountCheckService(): CallbackService {
  return getOrCreate('AccountCheckService', createAccountCheckService)
}
