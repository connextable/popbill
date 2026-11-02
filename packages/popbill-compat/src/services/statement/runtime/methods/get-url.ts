import { requiredText, url } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'

export async function requestGetUrl(context: StatementRuntimeContext, corpNum: string, togo: string, userId?: string): Promise<string> {
  requiredText(togo, '접근할 메뉴가 입력되지 않았습니다.')
  return url(context, corpNum, `/Statement?TG=${encodeURIComponent(togo)}`, userId)
}
