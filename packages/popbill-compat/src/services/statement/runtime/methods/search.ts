import { validateSearchDate } from '@/internal/validation'
import { request, requiredText } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import { parseSearchOptions } from '@/services/statement/runtime/parsers/search'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSearch(
  context: StatementRuntimeContext,
  corpNum: string,
  dType: string,
  sDate: string,
  eDate: string,
  state: string[] | undefined,
  itemCode: StatementItemCode[] | undefined,
  ...options: (string | number | undefined)[]
): Promise<Spec.StatementSearchApiResponse> {
  requiredText(dType, '검색일자 유형이 입력되지 않았습니다.')
  const dateError =
    validateSearchDate(sDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.') ??
    validateSearchDate(eDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (dateError) throw dateError
  const { qString, order, page, perPage, userId } = parseSearchOptions(options)
  const query = new URLSearchParams({ DType: dType, SDate: sDate, EDate: eDate })
  if (Array.isArray(state) && state.length) query.set('State', state.join(','))
  if (Array.isArray(itemCode) && itemCode.length) query.set('ItemCode', itemCode.join(','))
  if (order) query.set('Order', String(order))
  if (page) query.set('Page', String(page))
  if (perPage) query.set('PerPage', String(perPage))
  if (qString) query.set('QString', String(qString))
  return request(context, corpNum, `/Statement/Search?${query.toString()}`, typeof userId === 'string' ? userId : undefined)
}
