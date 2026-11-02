import type { FaxRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetSenderNumberMgtURL(context: FaxRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, '/FAX/?TG=SENDER', userId)
}
