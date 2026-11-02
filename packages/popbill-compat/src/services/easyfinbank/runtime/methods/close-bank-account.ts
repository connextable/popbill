import type { EasyFinBankApiResponseBase } from '@connextable/popbill-spec'
import { accountPath, query, request, requiredText } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestCloseBankAccount(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  bankCode: string,
  accountNumber: string,
  closeType: '중도' | '일반' | (string & {}),
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  accountPath(bankCode, accountNumber)
  requiredText(closeType, '계좌 정액제 해지유형이 입력되지 않았습니다.')
  return request(
    context,
    corpNum,
    `/EasyFin/Bank/BankAccount/Close?${query({ BankCode: bankCode, AccountNumber: accountNumber, CloseType: closeType })}`,
    userId,
    'POST'
  )
}
