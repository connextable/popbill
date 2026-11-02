import { documentPath, request, requiredText, validateItemCode } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestDetachStatement(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  subItemCode: StatementItemCode,
  subMgtKey: string,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  validateItemCode(subItemCode)
  requiredText(subMgtKey, '첨부해제할 명세서 문서번호가 입력되지 않았습니다.')
  return request(context, corpNum, `${documentPath(itemCode, mgtKey)}/DetachStmt`, userId, 'POST', {
    ItemCode: Number(subItemCode),
    MgtKey: subMgtKey,
  })
}
