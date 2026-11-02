import { validateSearchDate } from '@/internal/validation'
import { request, requiredText } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRequestJob(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  type: Spec.HomeTaxCashbillType,
  startDate: string,
  endDate: string,
  userId?: string
): Promise<string> {
  requiredText(type, '현금영수증 유형이 입력되지 않았습니다.')
  const dateError =
    validateSearchDate(startDate, '시작일자가 입력되지 않았습니다.', '시작일자 유형이 올바르지 않습니다.') ??
    validateSearchDate(endDate, '종료일자가 입력되지 않았습니다.', '종료일자 유형이 올바르지 않습니다.')
  if (dateError) throw dateError
  const query = new URLSearchParams({ SDate: startDate, EDate: endDate })
  const response = await request<Spec.HomeTaxCashbillRequestJobApiResponse>(
    context,
    corpNum,
    `/HomeTax/Cashbill/${encodeURIComponent(type)}?${query.toString()}`,
    userId,
    'POST'
  )
  return response.jobID
}
