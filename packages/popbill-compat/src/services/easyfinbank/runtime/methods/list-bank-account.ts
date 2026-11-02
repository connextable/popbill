import type { EasyFinBankAccountApiModel } from '@connextable/popbill-spec'
import { request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestListBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<EasyFinBankAccountApiModel[]> {
  return request(context, corpNum, '/EasyFin/Bank/ListBankAccount', userId)
}
