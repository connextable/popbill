import type { EasyFinBankApiResponseBase, EasyFinBankUpdateAccountFormApiModel } from '@connextable/popbill-spec'
import { createLegacyValidationError } from '@/internal/errors'
import type { EasyFinBankUpdateAccountForm } from '../../types'
import { accountPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestUpdateBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  account: EasyFinBankUpdateAccountForm,
  userId?: string
): Promise<EasyFinBankApiResponseBase>
export async function requestUpdateBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  account: EasyFinBankUpdateAccountFormApiModel,
  userId?: string
): Promise<EasyFinBankApiResponseBase>
export async function requestUpdateBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  accountOrCode: string | EasyFinBankUpdateAccountForm,
  numberOrUserId?: string,
  account?: EasyFinBankUpdateAccountFormApiModel,
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  const form = typeof accountOrCode === 'string' ? { ...account, BankCode: accountOrCode, AccountNumber: numberOrUserId ?? '' } : accountOrCode
  if (!form || typeof form !== 'object') throw createLegacyValidationError('계좌정보가 입력되지 않았습니다.')
  return request(
    context,
    corpNum,
    `${accountPath(form.BankCode, form.AccountNumber)}/Update`,
    typeof accountOrCode === 'string' ? userId : numberOrUserId,
    'POST',
    form
  )
}
