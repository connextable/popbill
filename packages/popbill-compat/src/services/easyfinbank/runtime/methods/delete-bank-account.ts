import type { EasyFinBankApiResponseBase } from '@connextable/popbill-spec'
import { accountPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestDeleteBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  accountPath(bankCode, accountNumber)
  return request(context, corpNum, '/EasyFin/Bank/BankAccount/Delete', userId, 'POST', { BankCode: bankCode, AccountNumber: accountNumber })
}
