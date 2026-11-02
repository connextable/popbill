import type { EasyFinBankChargeInfoApiModel } from '@connextable/popbill-spec'
import { request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestGetChargeInfo(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<EasyFinBankChargeInfoApiModel> {
  return request(context, corpNum, '/EasyFin/Bank/ChargeInfo', userId)
}
