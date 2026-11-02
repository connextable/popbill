import type { EasyFinBankAccountApiModel } from '@connextable/popbill-spec'
import { accountPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestGetBankAccountInfo(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  userId?: string
): Promise<EasyFinBankAccountApiModel> {
  return request(context, corpNum, accountPath(bankCode, accountNumber), userId)
}
