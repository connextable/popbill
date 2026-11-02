import type * as Spec from '@connextable/popbill-spec'
import type { LookupCallback, LookupCallbackWithUserId } from '@/internal/lookup-types'

export interface BizInfoCheckCallbackService {
  checkBizInfo: LookupCallbackWithUserId<[corpNum: string, checkCorpNum: string], Spec.BizInfoCheckCheckBizInfoApiResponse>
  getChargeInfo: LookupCallbackWithUserId<[corpNum: string], Spec.BizInfoCheckChargeInfoApiResponse>
  getUnitCost: LookupCallback<[corpNum: string], string>
}

export interface BizInfoCheckPromiseService {
  checkBizInfo(corpNum: string, checkCorpNum: string, userId?: string): Promise<Spec.BizInfoCheckCheckBizInfoApiResponse>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.BizInfoCheckChargeInfoApiResponse>
  getUnitCost(corpNum: string): Promise<string>
}
