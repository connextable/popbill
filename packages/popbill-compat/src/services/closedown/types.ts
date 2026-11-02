import type * as Spec from '@connextable/popbill-spec'
import type { LookupCallback, LookupCallbackWithUserId } from '@/internal/lookup-types'

export interface ClosedownCallbackService {
  checkCorpNum: LookupCallbackWithUserId<[corpNum: string, checkCorpNum: string], Spec.ClosedownCheckCorpNumApiResponse>
  checkCorpNums: LookupCallbackWithUserId<[corpNum: string, corpNumList: string[]], Spec.ClosedownCheckCorpNumsApiResponse>
  getChargeInfo: LookupCallbackWithUserId<[corpNum: string], Spec.ClosedownChargeInfoApiResponse>
  getUnitCost: LookupCallback<[corpNum: string], string>
}

export interface ClosedownPromiseService {
  checkCorpNum(corpNum: string, checkCorpNum: string, userId?: string): Promise<Spec.ClosedownCheckCorpNumApiResponse>
  checkCorpNums(corpNum: string, corpNumList: string[], userId?: string): Promise<Spec.ClosedownCheckCorpNumsApiResponse>
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.ClosedownChargeInfoApiResponse>
  getUnitCost(corpNum: string): Promise<string>
}
