import type { EasyFinBankApiResponseBase } from '@connextable/popbill-spec'
import { accountPath, query, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestRevokeCloseBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  accountPath(bankCode, accountNumber)
  return request(
    context,
    corpNum,
    `/EasyFin/Bank/BankAccount/RevokeClose?${query({ BankCode: bankCode, AccountNumber: accountNumber })}`,
    userId,
    'POST'
  )
}
