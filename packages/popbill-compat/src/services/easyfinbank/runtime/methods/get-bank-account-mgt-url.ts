import { request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestGetBankAccountMgtURL(context: EasyFinBankRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return (await request<{ url: string }>(context, corpNum, '/EasyFin/Bank?TG=BankAccount', userId)).url
}
