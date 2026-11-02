import { documentPath, request, requiredText } from '../common'
import type { CashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestRevokeRegister(
  context: CashbillRuntimeContext,
  corpNum: string,
  mgtKey: string,
  orgConfirmNum: string,
  orgTradeDate: string,
  smsSendYN = false,
  userId?: string,
  isPartCancel = false,
  cancelType?: Spec.CashbillCancelType | `${Spec.CashbillCancelType}` | null,
  supplyCost?: string,
  tax?: string,
  serviceFee?: string,
  totalAmount?: string
): Promise<Spec.CashbillApiResponseBase> {
  documentPath(mgtKey)
  requiredText(orgConfirmNum, '국세청 승인번호가 입력되지 않았습니다.')
  requiredText(orgTradeDate, '거래일자가 입력되지 않았습니다.')
  return request(context, corpNum, '/Cashbill', userId, 'REVOKE', {
    mgtKey,
    orgConfirmNum,
    orgTradeDate,
    smssendYN: smsSendYN,
    isPartCancel,
    cancelType,
    supplyCost,
    tax,
    serviceFee,
    totalAmount,
  })
}
