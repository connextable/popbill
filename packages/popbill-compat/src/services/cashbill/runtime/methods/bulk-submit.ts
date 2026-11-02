import { createLegacyValidationError } from '@/internal/errors'
import { validateSubmitId } from '@/internal/validation'
import { request, validateDocument } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestBulkSubmit(
  context: CashbillRuntimeContext,
  corpNum: string,
  submitId: string,
  cashbillList: Spec.CashbillApiModel[],
  userId?: string
): Promise<Spec.CashbillBulkSubmitApiResponse> {
  const error = validateSubmitId(submitId)
  if (error) throw error
  if (!Array.isArray(cashbillList) || cashbillList.length < 1)
    throw createLegacyValidationError('초대량 발행에는 한 건 이상의 현금영수증 정보가 필요합니다.')
  for (const cashbill of cashbillList) validateDocument(cashbill)
  return request(context, corpNum, '/Cashbill', userId, 'BULKISSUE', { cashbills: cashbillList }, submitId)
}
