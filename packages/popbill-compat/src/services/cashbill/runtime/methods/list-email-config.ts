import { request } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestListEmailConfig(
  context: CashbillRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.CashbillEmailConfigApiModel[]> {
  return request(context, corpNum, '/Cashbill/EmailSendConfig', userId)
}
