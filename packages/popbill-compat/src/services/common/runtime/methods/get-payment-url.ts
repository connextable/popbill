import { url } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetPaymentURL = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) => url(context, corpNum, 'PAYMENT', userId)
