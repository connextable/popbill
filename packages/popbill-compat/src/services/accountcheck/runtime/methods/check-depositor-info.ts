import type * as Spec from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { requestLookup, requireLookupText, validateLookupCorpNum, type LookupRuntimeContext } from '@/internal/lookup-runtime'
import { accountQuery } from '../common'

export function requestCheckDepositorInfo(
  context: LookupRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  identityNumType: string,
  identityNum: string,
  userId?: string
): Promise<Spec.AccountCheckCheckDepositorInfoApiResponse> {
  validateLookupCorpNum(corpNum)
  const query = accountQuery(bankCode, accountNumber)
  requireLookupText(identityNumType, '등록번호 유형이 입력되지 않았습니다.')
  if (!/^[PB]$/.test(identityNumType)) throw createLegacyValidationError('올바른 등록번호 유형이 아닙니다.')
  requireLookupText(identityNum, '등록번호가 입력되지 않았습니다.')
  if (!/^\d+$/.test(identityNum)) throw createLegacyValidationError('등록번호는 숫자만 입력 가능합니다.')
  return requestLookup(
    context,
    corpNum,
    `/EasyFin/DepositorCheck?${query}&t=${encodeURIComponent(identityNumType)}&p=${encodeURIComponent(identityNum)}`,
    userId,
    'POST'
  )
}
