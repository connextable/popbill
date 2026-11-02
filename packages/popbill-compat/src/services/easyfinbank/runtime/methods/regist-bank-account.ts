import type { EasyFinBankApiResponseBase } from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import type { EasyFinBankAccountForm } from '../../types'
import { query, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestRegistBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  account: EasyFinBankAccountForm,
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  if (!account || typeof account !== 'object') throw createLegacyValidationError('계좌정보가 입력되지 않았습니다.')
  const { UsePeriod, ...body } = account
  // The provider expects the paid subscription period in the query, not the body.
  const suffix = query({ UsePeriod })
  return request(context, corpNum, `/EasyFin/Bank/BankAccount/Regist${suffix ? '?' + suffix : ''}`, userId, 'POST', body)
}
