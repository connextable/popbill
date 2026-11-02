import { createLegacyValidationError } from '@/internal/errors'
import { validateSearchDate } from '@/internal/validation'
import { request } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSearch(
  context: MessageRuntimeContext,
  corpNum: string,
  startDate: string,
  endDate: string,
  state: string[],
  item?: Spec.MessageType[],
  reserveYN?: boolean,
  senderYN?: boolean,
  order?: string,
  page?: number,
  perPage?: number,
  qString?: string,
  userId?: string
): Promise<Spec.MessageSearchApiResponse> {
  const dateError =
    validateSearchDate(startDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.') ??
    validateSearchDate(endDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (dateError) throw dateError
  if (!Array.isArray(state) || !state.length) throw createLegacyValidationError('전송상태가 입력되지 않았습니다.')
  const query = new URLSearchParams({ SDate: startDate, EDate: endDate, State: state.join(',') })
  if (item?.length) query.set('Item', item.join(','))
  if (reserveYN != null) query.set('ReserveYN', reserveYN ? '1' : '0')
  if (senderYN != null) query.set('SenderOnly', senderYN ? '1' : '0')
  if (order) query.set('Order', order)
  if (page) query.set('Page', String(page))
  if (perPage) query.set('PerPage', String(perPage))
  if (qString) query.set('QString', qString)
  return request(context, corpNum, '/Message/Search?' + query.toString(), userId)
}
