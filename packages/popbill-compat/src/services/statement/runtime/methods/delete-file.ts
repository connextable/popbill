import { documentPath, request, requiredText } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestDeleteFile(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  fileId: string,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  requiredText(fileId, '파일아이디가 입력되지 않았습니다.')
  return request(context, corpNum, `${documentPath(itemCode, mgtKey)}/Files/${encodeURIComponent(fileId)}`, userId, 'DELETE')
}
