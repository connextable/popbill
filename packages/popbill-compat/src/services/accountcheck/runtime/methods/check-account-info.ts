import type * as Spec from '@connextable/popbill-spec'
import { requestLookup, validateLookupCorpNum, type LookupRuntimeContext } from '@/internal/lookup-runtime'
import { accountQuery } from '../common'

export function requestCheckAccountInfo(
  context: LookupRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  userId?: string
): Promise<Spec.AccountCheckCheckAccountInfoApiResponse> {
  validateLookupCorpNum(corpNum)
  return requestLookup(context, corpNum, `/EasyFin/AccountCheck?${accountQuery(bankCode, accountNumber)}`, userId, 'POST')
}
