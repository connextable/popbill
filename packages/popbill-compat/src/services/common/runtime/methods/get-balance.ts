import { authToken } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetBalance = (context: CommonRuntimeContext) => async (corpNum: string) => {
  return context.authClient.getBalance(await authToken(context, corpNum))
}
