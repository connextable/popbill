import { url } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetChargeURL = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) => url(context, corpNum, 'CHRG', userId)
