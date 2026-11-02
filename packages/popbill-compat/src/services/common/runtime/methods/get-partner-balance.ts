import { authToken } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetPartnerBalance = (context: CommonRuntimeContext) => async (corpNum: string) => {
  return context.authClient.getPartnerBalance(await authToken(context, corpNum))
}
