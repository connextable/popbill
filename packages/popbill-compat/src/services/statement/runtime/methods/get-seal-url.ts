import { url } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'

export async function requestGetSealUrl(context: StatementRuntimeContext, corpNum: string, userId?: string): Promise<string> {
  return url(context, corpNum, '/Member?TG=SEAL', userId)
}
