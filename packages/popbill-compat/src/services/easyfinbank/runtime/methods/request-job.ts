import { isValidDate8 } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { accountPath, query, request, requiredText } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

/** JobID expires one hour after the collection request. */
export async function requestRequestJob(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  startDate: string,
  endDate: string,
  userId?: string
): Promise<string> {
  accountPath(bankCode, accountNumber)
  requiredText(startDate, '시작일자가 입력되지 않았습니다.')
  requiredText(endDate, '종료일자가 입력되지 않았습니다.')
  if (!isValidDate8(startDate)) throw createLegacyValidationError('시작일자가 유형이 올바르지 않습니다.')
  if (!isValidDate8(endDate)) throw createLegacyValidationError('종료일자가 유형이 올바르지 않습니다.')
  return (
    await request<{ jobID: string }>(
      context,
      corpNum,
      `/EasyFin/Bank/BankAccount?${query({ BankCode: bankCode, AccountNumber: accountNumber, SDate: startDate, EDate: endDate })}`,
      userId,
      'POST'
    )
  ).jobID
}
