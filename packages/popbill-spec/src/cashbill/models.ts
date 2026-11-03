import type {
  CashbillApiResponseBase,
  CashbillCancelType,
  CashbillEmailType,
  CashbillTaxationType,
  CashbillTradeOption,
  CashbillTradeType,
  CashbillTradeUsage,
} from './common'
import type { PopbillWebhookDocumentStateBody, PopbillWebhookBulkResultBody, PopbillWebhookCode } from '../webhook/common'

/** @see https://developers.popbill.com/api-reference/cashbill/webhook/webhook-event */
export interface CashbillStateWebhookBody extends PopbillWebhookDocumentStateBody {
  franchiseCorpNum?: string
  tradeDate?: string
  confirmNum?: string
  ntsresultCode?: string
  mgtKey?: string
}

export interface CashbillBulkWebhookBody extends PopbillWebhookBulkResultBody<{
  code?: PopbillWebhookCode
  message?: string
  confirmNum?: string
  tradeDate?: string
  issueDT?: string
  mgtKey?: string
}> {
  franchiseCorpNum?: string
}

/** 현금영수증 원본 문서. 금액과 식별번호는 문자열을 유지합니다.
 * @see https://developers.popbill.com/api-reference/cashbill/api/issue
 */
export interface CashbillApiModel {
  mgtKey?: string
  tradeDT?: string
  tradeDate?: string
  tradeType?: CashbillTradeType
  tradeUsage?: CashbillTradeUsage
  tradeOpt?: CashbillTradeOption
  taxationType?: CashbillTaxationType
  totalAmount?: string
  supplyCost?: string
  tax?: string
  serviceFee?: string
  franchiseCorpNum?: string
  franchiseTaxRegID?: string
  franchiseCorpName?: string
  franchiseCEOName?: string
  franchiseAddr?: string
  franchiseTEL?: string
  identityNum?: string
  customerName?: string
  itemName?: string
  orderNumber?: string
  email?: string
  hp?: string
  smssendYN?: boolean
  orgConfirmNum?: string
  orgTradeDate?: string
  confirmNum?: string
  cancelType?: CashbillCancelType | `${CashbillCancelType}`
  memo?: string
  emailSubject?: string
}

/** 현재 승인 즉시발행·초대량 발행에서 필수인 원본 필드입니다. */
export type CashbillApprovalApiModel = CashbillApiModel &
  Required<
    Pick<
      CashbillApiModel,
      'mgtKey' | 'tradeUsage' | 'taxationType' | 'totalAmount' | 'supplyCost' | 'tax' | 'serviceFee' | 'franchiseCorpNum' | 'identityNum'
    >
  > & {
    tradeType: '승인거래'
  }

/** 서버에서 반환한 현금영수증 상태·국세청 전송결과. */
export interface CashbillInfoApiModel extends CashbillApiModel {
  itemKey?: string
  issueDT?: string
  regDT?: string
  stateMemo?: string
  stateCode?: number
  stateDT?: string
  ntssendDT?: string
  ntsresultDT?: string
  ntsresultCode?: string
  ntsresultMessage?: string
  printYN?: boolean
  interOPYN?: boolean
}

export interface CashbillIssueResultApiModel extends CashbillApiResponseBase {
  confirmNum?: string
  tradeDate?: string
  tradeDT?: string
  issueDT?: string
}

export interface CashbillRevokeApiRequestBody {
  mgtKey: string
  orgConfirmNum: string
  orgTradeDate: string
  smssendYN?: boolean
  memo?: string
  isPartCancel?: boolean
  cancelType?: CashbillCancelType | `${CashbillCancelType}` | null
  supplyCost?: string
  tax?: string
  serviceFee?: string
  totalAmount?: string
  emailSubject?: string
  tradeDT?: string
}

export interface CashbillBulkIssueResultApiModel extends CashbillIssueResultApiModel {
  mgtKey?: string
}

export interface CashbillLogApiModel {
  docLogType?: number
  log?: string
  procType?: string
  procCorpName?: string
  procContactName?: string
  procMemo?: string
  regDT?: string
  ip?: string
}

export interface CashbillChargeInfoApiResponse {
  unitCost?: string
  chargeMethod?: '연동' | '파트너'
  rateSystem?: '종량제'
}

export interface CashbillEmailConfigApiModel {
  emailType?: CashbillEmailType
  sendYN?: boolean
}

/** PDF 다운로드 응답은 JSON이 아닌 PDF 바이너리입니다. */
export type CashbillPdfApiResponse = Uint8Array
