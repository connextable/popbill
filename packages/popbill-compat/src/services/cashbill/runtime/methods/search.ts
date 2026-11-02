import { validateSearchDate } from '@/internal/validation'
import { request, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import { parseSearchOptions } from '../parsers/search'
import type * as Spec from '@connextable/popbill-spec'

export async function requestSearch(
  context: CashbillRuntimeContext,
  corpNum: string,
  dType: string,
  sDate: string,
  eDate: string,
  state: string[] | undefined,
  tradeType: string[] | undefined,
  tradeUsage: string[] | undefined,
  ...options: (string | number | string[] | undefined)[]
): Promise<Spec.CashbillSearchApiResponse> {
  requiredText(dType, '검색일자 유형이 입력되지 않았습니다.')
  const dateError =
    validateSearchDate(sDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.') ??
    validateSearchDate(eDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (dateError) throw dateError
  const parsed = parseSearchOptions(options)
  const query = new URLSearchParams({ DType: dType, SDate: sDate, EDate: eDate })
  for (const [name, value] of Object.entries({
    State: state,
    TradeType: tradeType,
    TradeUsage: tradeUsage,
    TradeOpt: parsed.tradeOpt,
    TaxationType: parsed.taxationType,
  })) {
    if (Array.isArray(value) && value.length > 0) query.set(name, value.join(','))
  }
  for (const [name, value] of Object.entries({
    QString: parsed.qString,
    Order: parsed.order,
    Page: parsed.page,
    PerPage: parsed.perPage,
    FranchiseTaxRegID: parsed.franchiseTaxRegID,
  })) {
    if (value !== undefined && value !== '') query.set(name, String(value))
  }
  return request(context, corpNum, `/Cashbill/Search?${query.toString()}`, parsed.userId)
}
