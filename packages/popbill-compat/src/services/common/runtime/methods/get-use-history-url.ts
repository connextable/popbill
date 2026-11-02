import { url } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetUseHistoryURL = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) =>
  url(context, corpNum, 'USEHISTORY', userId)
