import { request, validateDocument } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegister(
  context: CashbillRuntimeContext,
  corpNum: string,
  cashbill: Spec.CashbillApiModel,
  userId?: string
): Promise<Spec.CashbillApiResponseBase> {
  validateDocument(cashbill)
  return request(context, corpNum, '/Cashbill', userId, 'POST', cashbill)
}
