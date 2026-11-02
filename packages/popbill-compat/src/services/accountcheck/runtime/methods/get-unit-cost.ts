import { createLegacyValidationError } from '@/internal/errors'
import { requestLookup, validateLookupCorpNum, type LookupRuntimeContext } from '@/internal/lookup-runtime'
import { costQuery } from '../common'

export async function requestGetUnitCost(context: LookupRuntimeContext, corpNum: string, serviceType?: string, userId?: string): Promise<string> {
  validateLookupCorpNum(corpNum)
  if (serviceType !== undefined && serviceType !== '' && serviceType !== '성명' && serviceType !== '실명')
    throw createLegacyValidationError('서비스 유형이 올바르지 않습니다..')
  return (await requestLookup<{ unitCost: string }>(context, corpNum, `/EasyFin/AccountCheck/UnitCost${costQuery(serviceType)}`, userId)).unitCost
}
