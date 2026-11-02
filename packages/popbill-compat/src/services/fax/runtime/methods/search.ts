import type * as Spec from '@connextable/popbill-spec'
import { validateSearchDate } from '@/internal/validation'
import { request } from '../common'
import type { FaxRuntimeContext } from '../context'

export async function requestSearch(
  context: FaxRuntimeContext,
  corpNum: string,
  sDate: string,
  eDate: string,
  state?: string[],
  reserveYN?: boolean,
  senderOnly?: boolean,
  order?: string,
  page?: number,
  perPage?: number,
  qString?: string,
  userId?: string
): Promise<Spec.FaxSearchResultApiModel> {
  const error =
    validateSearchDate(sDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.') ??
    validateSearchDate(eDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (error) throw error
  const query = new URLSearchParams({ SDate: sDate, EDate: eDate })
  if (state?.length) query.set('State', state.join(','))
  if (reserveYN != null) query.set('ReserveYN', reserveYN ? '1' : '0')
  if (senderOnly != null) query.set('SenderOnly', senderOnly ? '1' : '0')
  if (order) query.set('Order', order)
  if (page) query.set('Page', String(page))
  if (perPage) query.set('PerPage', String(perPage))
  if (qString) query.set('QString', qString)
  return request(context, corpNum, '/FAX/Search?' + query.toString(), userId)
}
