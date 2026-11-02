import { request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'

export async function requestGetFlatRatePopUpURL(context: HTCashbillRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  const response = await request<{ url: string }>(context, corpNum, '/HomeTax/Cashbill?TG=CHRG', userId)
  return response.url
}
