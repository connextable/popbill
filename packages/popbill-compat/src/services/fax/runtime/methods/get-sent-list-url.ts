import type { FaxRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetSentListURL(context: FaxRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, '/FAX/?TG=BOX', userId)
}
