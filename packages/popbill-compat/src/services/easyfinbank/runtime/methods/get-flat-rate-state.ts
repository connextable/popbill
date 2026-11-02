import type { EasyFinBankFlatRateApiModel } from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import { accountPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestGetFlatRateState(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  userId?: string
): Promise<EasyFinBankFlatRateApiModel> {
  accountPath(bankCode, accountNumber)
  if (bankCode.length !== 4) throw createLegacyValidationError('기관코드가 올바르지 않습니다.')
  return request(context, corpNum, `/EasyFin/Bank/Contract/${encodeURIComponent(bankCode)}/${encodeURIComponent(accountNumber)}`, userId)
}
