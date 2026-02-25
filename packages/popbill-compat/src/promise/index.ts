import { getConfiguration, setConfiguration, type CompatConfig } from '../config'
import { MgtKeyType, MessageType, KakaoType } from '../constants'
import type { PromiseService } from '../adapters/promise-adapter'
import {
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
} from '../services'

const serviceCache = new Map<string, PromiseService>()

export { MgtKeyType, MessageType, KakaoType }
export type { CompatConfig }

export function config(nextConfig: CompatConfig): void {
  setConfiguration(nextConfig)
  serviceCache.clear()
}

function getOrCreate(name: string, creator: (config: CompatConfig) => PromiseService): PromiseService {
  const cached = serviceCache.get(name)
  if (cached) {
    return cached
  }

  const created = creator(getConfiguration())
  serviceCache.set(name, created)
  return created
}

export function TaxinvoiceService(): PromiseService {
  return getOrCreate('TaxinvoiceService', createTaxinvoicePromiseService)
}

export function StatementService(): PromiseService {
  return getOrCreate('StatementService', createStatementPromiseService)
}

export function CashbillService(): PromiseService {
  return getOrCreate('CashbillService', createCashbillPromiseService)
}

export function MessageService(): PromiseService {
  return getOrCreate('MessageService', createMessagePromiseService)
}

export function KakaoService(): PromiseService {
  return getOrCreate('KakaoService', createKakaoPromiseService)
}

export function FaxService(): PromiseService {
  return getOrCreate('FaxService', createFaxPromiseService)
}

export function HTTaxinvoiceService(): PromiseService {
  return getOrCreate('HTTaxinvoiceService', createHTTaxinvoicePromiseService)
}

export function HTCashbillService(): PromiseService {
  return getOrCreate('HTCashbillService', createHTCashbillPromiseService)
}

export function ClosedownService(): PromiseService {
  return getOrCreate('ClosedownService', createClosedownPromiseService)
}

export function BizInfoCheckService(): PromiseService {
  return getOrCreate('BizInfoCheckService', createBizInfoCheckPromiseService)
}

export function EasyFinBankService(): PromiseService {
  return getOrCreate('EasyFinBankService', createEasyFinBankPromiseService)
}

export function AccountCheckService(): PromiseService {
  return getOrCreate('AccountCheckService', createAccountCheckPromiseService)
}
