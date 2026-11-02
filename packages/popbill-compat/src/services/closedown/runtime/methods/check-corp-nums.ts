import type * as Spec from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { requestLookup, validateLookupCorpNum, type LookupRuntimeContext } from '@/internal/lookup-runtime'

export function requestCheckCorpNums(
  context: LookupRuntimeContext,
  corpNum: string,
  corpNumList: string[],
  userId?: string
): Promise<Spec.ClosedownCheckCorpNumsApiResponse> {
  validateLookupCorpNum(corpNum)
  if (!Array.isArray(corpNumList) || corpNumList.length === 0) throw createLegacyValidationError('조회할 사업자번호배열이 입력되지 않았습니다.')
  return requestLookup(context, corpNum, '/CloseDown', userId, 'POST', corpNumList)
}
