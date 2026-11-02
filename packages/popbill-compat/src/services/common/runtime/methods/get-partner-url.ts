import { createLegacyValidationError } from '@/internal/errors'
import { authToken, required, validateBusiness } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetPartnerURL = (context: CommonRuntimeContext) => async (corpNum: string, toGo: string) => {
  validateBusiness(corpNum)
  required(toGo, '접근메뉴가 입력되지 않았습니다.')
  if (toGo !== 'CHRG') throw createLegacyValidationError('접근메뉴가 올바르지 않습니다.')
  return context.authClient.getPartnerURL(await authToken(context, corpNum), toGo)
}
