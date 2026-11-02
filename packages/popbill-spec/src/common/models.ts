/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export interface CommonJoinFormApiModel {
  LinkID: string
  CorpNum: string
  ID: string
  Password: string
  CorpName: string
  CEOName: string
  Addr: string
  BizType: string
  BizClass: string
  ContactName: string
  ContactTEL: string
  ContactEmail: string
}
export interface CommonCorpInfoApiModel {
  corpName: string
  ceoname: string
  addr: string
  bizType: string
  bizClass: string
}
export interface CommonContactInputApiModel {
  id: string
  personName: string
  tel: string
  email: string
  searchRole?: number
}
export interface CommonRegisterContactApiModel extends CommonContactInputApiModel {
  password: string
}
export interface CommonContactApiModel extends CommonContactInputApiModel {
  mgrYN?: boolean
  state?: number
  regDT?: string
}
/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export interface CommonPaymentFormApiModel {
  paymentName: string
  settleCost: string
  settlerName?: string
  settlerEmail?: string
  notifyHP?: string
}
export interface CommonPaymentHistoryApiModel {
  productType?: string
  productName?: string
  settleType?: string
  settlerName?: string
  settlerEmail?: string
  settleCost?: string
  settlePoint?: string
  settleState?: number
  regDT?: string
  stateDT?: string
}
/** HTTP 응답의 itemCode와 txType은 숫자이며 금액·포인트는 문자열로 보존한다. */
export interface CommonUseHistoryApiModel {
  itemCode?: number
  /** HTTP 응답 예시에 포함된 서비스 이용자 식별자입니다. */
  serviceUserID?: string
  userID?: string
  userName?: string
  txPoint?: string
  balance?: string
  txType?: number
  txDT?: string
}
/** HTTP 필드명은 소문자입니다. 레거시 SDK는 PascalCase도 받습니다. */
export interface CommonRefundFormApiModel {
  accountbank: string
  accountnum: string
  accountname: string
  requestpoint: string
  contactname: string
  tel: string
  reason?: string
}
export interface CommonRefundHistoryApiModel {
  accountBank?: string
  accountNum?: string
  accountName?: string
  requestPoint?: string
  reason?: string
  state?: number
  reqDT?: string
}
