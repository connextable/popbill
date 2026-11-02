import { url, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestGetUrl(context: CashbillRuntimeContext, corpNum: string, togo: string, userId?: string): Promise<string> {
  requiredText(togo, '접근 메뉴가 입력되지 않았습니다.')
  return url(context, corpNum, `/Cashbill?TG=${encodeURIComponent(togo)}`, userId)
}
