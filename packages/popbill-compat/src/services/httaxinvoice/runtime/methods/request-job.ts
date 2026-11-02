import type * as Spec from '@connextable/popbill-spec'
import { validateSearchDate } from '@/internal/validation'
import { BASE_PATH, request, required } from '../common'
import type { HTTaxinvoiceRuntimeContext } from '../context'
export async function requestRequestJob(
  context: HTTaxinvoiceRuntimeContext,
  corpNum: string,
  queryType: Spec.HomeTaxTaxInvoiceQueryType,
  dateType: Spec.HomeTaxTaxInvoiceDateType,
  startDate: string,
  endDate: string,
  userId?: string
): Promise<string> {
  required(queryType, '세금계산서 유형이 입력되지 않았습니다.')
  required(dateType, '조회할 일자 유형이 입력되지 않았습니다.')
  const startError = validateSearchDate(startDate, '조회 시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.')
  if (startError) throw startError
  const endError = validateSearchDate(endDate, '조회 종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (endError) throw endError
  const response = await request<{ jobID: string }>(
    context,
    corpNum,
    `${BASE_PATH}/${encodeURIComponent(queryType)}?DType=${encodeURIComponent(dateType)}&SDate=${startDate}&EDate=${endDate}`,
    userId,
    'POST'
  )
  return response.jobID
}
