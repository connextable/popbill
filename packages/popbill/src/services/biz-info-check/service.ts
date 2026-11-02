import type { BizInfoCheckPromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { invokeBizInfoCheckMethod } from './adapters/error'
import { mapCompanyInfo, mapBizInfoCheckChargeInfo } from './mappers/response'
import type { BizInfoCheckService } from './types'

interface CreateBizInfoCheckServiceInput {
  compatBizInfoCheckService: BizInfoCheckPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createBizInfoCheckService(input: CreateBizInfoCheckServiceInput): BizInfoCheckService {
  const compat = input.compatBizInfoCheckService
  const invoke = <T>(method: keyof BizInfoCheckService, handler: () => Promise<T>) =>
    invokeBizInfoCheckMethod(input, `bizInfoCheck.${method}`, handler)
  return {
    getCompanyInfo(request) {
      return invoke('getCompanyInfo', async () =>
        mapCompanyInfo(await compat.checkBizInfo(request.businessNumber, request.targetBusinessNumber, input.defaultUserId))
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () => mapBizInfoCheckChargeInfo(await compat.getChargeInfo(request.businessNumber, input.defaultUserId)))
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber) }))
    },
  }
}
