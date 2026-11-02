import type * as Spec from '@connextable/popbill-spec'
import { requestLookup, requireLookupText, validateLookupCorpNum, type LookupRuntimeContext } from '@/internal/lookup-runtime'

export function requestCheckBizInfo(
  context: LookupRuntimeContext,
  corpNum: string,
  checkCorpNum: string,
  userId?: string
): Promise<Spec.BizInfoCheckCheckBizInfoApiResponse> {
  validateLookupCorpNum(corpNum)
  requireLookupText(checkCorpNum, '조회할 사업자번호가 입력되지 않았습니다.')
  return requestLookup(context, corpNum, `/BizInfo/Check?CN=${encodeURIComponent(checkCorpNum)}`, userId)
}
