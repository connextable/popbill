import { request, validateDocument } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRegistIssue(
  context: CashbillRuntimeContext,
  corpNum: string,
  cashbill: Spec.CashbillApiModel,
  memo?: string,
  userId?: string,
  emailSubject?: string
): Promise<Spec.CashbillRegistIssueApiResponse> {
  validateDocument(cashbill)
  return request(context, corpNum, '/Cashbill', userId, 'ISSUE', { ...cashbill, memo, emailSubject })
}
