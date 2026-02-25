import type {
  TaxInvoiceMgtKeyType,
  TaxInvoiceSearchApiResponse,
} from '@connextable/popbill-spec'
import {
  validateCorpNum,
  validateSearchDate,
  validateSearchDateType,
  validateTaxInvoiceKeyType,
} from '../../../../internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'
import type { ParsedSearchOptions } from '../parsers/search'

export interface TaxinvoiceSearchBaseParams {
  dType: string
  startDate: string
  endDate: string
  state: string[]
  type: string[]
  taxType: string[]
  lateOnly: boolean | null
  order: string
  page: number
  perPage: number
}

export async function requestSearch(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  base: TaxinvoiceSearchBaseParams,
  options: ParsedSearchOptions,
): Promise<TaxInvoiceSearchApiResponse> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const keyTypeError = validateTaxInvoiceKeyType(keyType)
  if (keyTypeError) {
    throw keyTypeError
  }

  const dTypeError = validateSearchDateType(base.dType)
  if (dTypeError) {
    throw dTypeError
  }

  const startDateError = validateSearchDate(base.startDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.')
  if (startDateError) {
    throw startDateError
  }

  const endDateError = validateSearchDate(base.endDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (endDateError) {
    throw endDateError
  }

  const searchParams = new URLSearchParams({
    DType: base.dType,
    SDate: base.startDate,
    EDate: base.endDate,
  })

  if (base.state.length > 0) {
    searchParams.set('State', base.state.toString())
  }

  if (base.type.length > 0) {
    searchParams.set('Type', base.type.toString())
  }

  if (base.taxType.length > 0) {
    searchParams.set('TaxType', base.taxType.toString())
  }

  if (options.issueType && options.issueType.length > 0) {
    searchParams.set('IssueType', options.issueType.toString())
  }

  if (options.regType && options.regType.length > 0) {
    searchParams.set('RegType', options.regType.toString())
  }

  if (options.closeDownState && options.closeDownState.length > 0) {
    searchParams.set('CloseDownState', options.closeDownState.toString())
  }

  if (base.lateOnly !== null) {
    searchParams.set('LateOnly', base.lateOnly ? '1' : '0')
  }

  if (options.qString) {
    searchParams.set('QString', options.qString)
  }

  if (options.mgtKey) {
    searchParams.set('MgtKey', options.mgtKey)
  }

  if (base.order) {
    searchParams.set('Order', base.order)
  }

  searchParams.set('Page', String(base.page))
  searchParams.set('PerPage', String(base.perPage))

  if (options.taxRegIDType) {
    searchParams.set('TaxRegIDType', options.taxRegIDType)
  }

  if (options.taxRegIDYN) {
    searchParams.set('TaxRegIDYN', options.taxRegIDYN)
  }

  if (options.taxRegID) {
    searchParams.set('TaxRegID', options.taxRegID)
  }

  if (options.interOPYN) {
    searchParams.set('InterOPYN', options.interOPYN)
  }

  return context.requestClient.requestJson<TaxInvoiceSearchApiResponse>({
    uri: `/Taxinvoice/${keyType}?${searchParams.toString()}`,
    corpNum,
    userId: options.userId,
    method: 'GET',
  })
}
