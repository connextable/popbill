import { required, url } from '../common'
import type { MessageRuntimeContext } from '../context'

export async function requestGetURL(context: MessageRuntimeContext, corpNum: string, togo: string, userId?: string): Promise<string> {
  required(togo, '접근 메뉴가 입력되지 않았습니다.')
  return url(context, corpNum, '/Message/?TG=' + encodeURIComponent(togo), userId)
}
