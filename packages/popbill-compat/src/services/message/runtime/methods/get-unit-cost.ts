import { createLegacyValidationError } from '@/internal/errors'
import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetUnitCost(context: MessageRuntimeContext, corpNum: string, messageType: Spec.MessageType): Promise<string> {
  required(messageType, '메시지 유형이 입력되지 않았습니다.')
  if (!['SMS', 'LMS', 'MMS'].includes(messageType)) throw createLegacyValidationError('메시지 유형이 올바르지 않습니다.')
  return (await request<{ unitCost: string }>(context, corpNum, '/Message/UnitCost?Type=' + messageType)).unitCost
}
