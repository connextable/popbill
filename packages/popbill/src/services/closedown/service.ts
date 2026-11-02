import type { ClosedownPromiseService } from '@connextable/popbill-compat/factory'
import type { PopbillApiError } from '@/errors'
import { invokeClosedownMethod } from './adapters/error'
import { mapBusinessStatus, mapClosedownChargeInfo } from './mappers/response'
import type { ClosedownService } from './types'

interface CreateClosedownServiceInput {
  compatClosedownService: ClosedownPromiseService
  defaultUserId: string
  onError?: (error: PopbillApiError) => void
}

export function createClosedownService(input: CreateClosedownServiceInput): ClosedownService {
  const compat = input.compatClosedownService
  const invoke = <T>(method: keyof ClosedownService, handler: () => Promise<T>) => invokeClosedownMethod(input, `closedown.${method}`, handler)
  return {
    checkBusinessStatus(request) {
      return invoke('checkBusinessStatus', async () =>
        mapBusinessStatus(await compat.checkCorpNum(request.businessNumber, request.targetBusinessNumber, input.defaultUserId))
      )
    },
    checkBusinessStatuses(request) {
      return invoke('checkBusinessStatuses', async () =>
        (await compat.checkCorpNums(request.businessNumber, request.targetBusinessNumbers, input.defaultUserId)).map(mapBusinessStatus)
      )
    },
    getChargeInfo(request) {
      return invoke('getChargeInfo', async () => mapClosedownChargeInfo(await compat.getChargeInfo(request.businessNumber, input.defaultUserId)))
    },
    getUnitCost(request) {
      return invoke('getUnitCost', async () => ({ unitCost: await compat.getUnitCost(request.businessNumber) }))
    },
  }
}
