import type { FaxRuntimeContext } from '../context'
import { url, requiredText } from '../common'

export async function requestGetURL(context: FaxRuntimeContext, corpNum: string, togo: string, userId?: string): Promise<string> {
  requiredText(togo, '접근 메뉴가 입력되지 않았습니다.')
  return url(context, corpNum, '/FAX/?TG=' + encodeURIComponent(togo), userId)
}
