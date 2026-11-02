import type { FaxRuntimeContext } from '../context'
import { url, numberPath } from '../common'

export async function requestGetPreviewURL(context: FaxRuntimeContext, corpNum: string, receiptNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, numberPath('/FAX/Preview/', receiptNum, '접수번호가 입력되지 않았습니다.'), userId)
}
