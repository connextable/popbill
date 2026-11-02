import { validateCorpNum } from '@/internal/validation'
import { documentPath, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAssignMgtKey(
  context: CashbillRuntimeContext,
  corpNum: string,
  itemKey: string,
  mgtKey: string,
  userId?: string
): Promise<Spec.CashbillApiResponseBase> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  requiredText(itemKey, '팝빌 식별번호가 입력되지 않았습니다.')
  documentPath(mgtKey)
  return context.requestClient.requestJson({
    corpNum,
    uri: `/Cashbill/${encodeURIComponent(itemKey)}`,
    userId,
    method: 'POST',
    body: new URLSearchParams({ MgtKey: mgtKey }).toString(),
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  })
}
