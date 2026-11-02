import { request, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetBulkResult(
  context: CashbillRuntimeContext,
  corpNum: string,
  submitId: string,
  userId?: string
): Promise<Spec.CashbillGetBulkResultApiResponse> {
  requiredText(submitId, '제출아이디가 입력되지 않았습니다.')
  return request(context, corpNum, `/Cashbill/BULK/${encodeURIComponent(submitId)}/State`, userId)
}
