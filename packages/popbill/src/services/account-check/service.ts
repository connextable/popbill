import type { AccountCheckPromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { invokeAccountCheckMethod } from './adapters/error'
import { mapAccountHolderInfo, mapAccountHolderIdentityInfo, mapAccountCheckChargeInfo } from './mappers/response'
import type { AccountCheckService } from './types'

interface CreateAccountCheckServiceInput {
  compatAccountCheckService: AccountCheckPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createAccountCheckService(input: CreateAccountCheckServiceInput): AccountCheckService {
  const compat = input.compatAccountCheckService
  const invoke = <T>(method: keyof AccountCheckService, handler: () => Promise<T>) =>
    invokeAccountCheckMethod(input, `accountCheck.${method}`, handler)
  return {
    checkAccountHolderName(request) {
      return invoke('checkAccountHolderName', async () =>
        mapAccountHolderInfo(await compat.checkAccountInfo(request.businessNumber, request.bankCode, request.accountNumber, input.defaultUserId))
      )
    },
    verifyAccountHolderIdentity(request) {
      return invoke('verifyAccountHolderIdentity', async () =>
        mapAccountHolderIdentityInfo(
          await compat.checkDepositorInfo(
            request.businessNumber,
            request.bankCode,
            request.accountNumber,
            request.identityNumberType,
            request.identityNumber,
            input.defaultUserId
          )
        )
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () =>
        mapAccountCheckChargeInfo(await compat.getChargeInfo(request.businessNumber, request.serviceType, input.defaultUserId))
      )
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({
        unitCost: await compat.getUnitCost(request.businessNumber, request.serviceType, input.defaultUserId),
      }))
    },
  }
}
