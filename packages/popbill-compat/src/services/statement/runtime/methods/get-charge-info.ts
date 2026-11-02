import { request, validateItemCode } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetChargeInfo(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  userId?: string
): Promise<Spec.StatementChargeInfoApiResponse> {
  validateItemCode(itemCode)
  return request(context, corpNum, `/Statement/ChargeInfo/${itemCode}`, userId)
}
