import type { EasyFinBankApiResponseBase } from '@connextable/popbill-spec'
import { query, request, requiredText } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestSaveMemo(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  transactionId: string,
  memo: string,
  userId?: string
): Promise<EasyFinBankApiResponseBase> {
  requiredText(transactionId, '거래내역 아이디가 입력되지 않았습니다.')
  requiredText(memo, '메모가 입력되지 않았습니다.')
  return request(context, corpNum, `/EasyFin/Bank/SaveMemo?${query({ TID: transactionId, Memo: memo })}`, userId, 'POST')
}
