import { url } from '../common'
import type { MessageRuntimeContext } from '../context'

export async function requestGetSenderNumberMgtURL(context: MessageRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, '/Message/?TG=SENDER', userId)
}
