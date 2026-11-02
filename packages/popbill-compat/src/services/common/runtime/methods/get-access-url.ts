import { url } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetAccessURL = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) => url(context, corpNum, 'LOGIN', userId)
