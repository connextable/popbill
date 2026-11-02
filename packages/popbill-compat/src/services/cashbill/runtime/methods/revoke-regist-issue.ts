import { request, requiredText, documentPath } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

type CancelType = Spec.CashbillCancelType | `${Spec.CashbillCancelType}` | null | undefined
type Option = string | number | boolean | null | undefined

export async function requestRevokeRegistIssue(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKey: string,
  orgConfirmNum: string,
  orgTradeDate: string,
  ...options: Option[]
): Promise<Spec.CashbillRevokeRegistIssueApiResponse> {
  documentPath(mgtKey)
  requiredText(orgConfirmNum, '국세청 승인번호가 입력되지 않았습니다.')
  requiredText(orgTradeDate, '거래일자가 입력되지 않았습니다.')
  // The legacy partial-revocation overload has no UserID argument.
  const full = options.length === 8 ? [...options.slice(0, 2), undefined, ...options.slice(2)] : options
  const [smsSendYN = false, memo, userId, isPartCancel = false, cancelType, supplyCost, tax, serviceFee, totalAmount, emailSubject, tradeDT] = full
  return request(context, corpNum, '/Cashbill', typeof userId === 'string' ? userId : undefined, 'REVOKEISSUE', {
    mgtKey,
    orgConfirmNum,
    orgTradeDate,
    smssendYN: smsSendYN as boolean,
    memo: memo as string | undefined,
    isPartCancel: isPartCancel as boolean,
    cancelType: cancelType as CancelType,
    supplyCost: supplyCost as string | undefined,
    tax: tax as string | undefined,
    serviceFee: serviceFee as string | undefined,
    totalAmount: totalAmount as string | undefined,
    emailSubject: emailSubject as string | undefined,
    tradeDT: tradeDT as string | undefined,
  } satisfies Spec.CashbillRevokeApiRequestBody)
}
