import type * as Input from './document'
import type * as Output from './response'
export type * from './document'
export type * from './response'

/** 회원·담당자·포인트 API입니다. 사용자 ID는 client 설정을 사용합니다. */
export interface CommonService {
  /** Compat: `checkIsMember` */
  checkMemberRegistration(input: Input.CommonBusinessInput): Promise<Output.CommonMembershipStatus>
  /** Compat: `checkID` */
  checkUserIdUsage(input: { userId: string }): Promise<Output.CommonUserIdUsage>
  /** Compat: `joinMember` */
  registerMember(input: Input.RegisterMemberInput): Promise<Output.CommonOperationResult>
  /** Compat: `quitMember` */
  quitMember(input: Input.QuitMemberInput): Promise<Output.CommonOperationResult>
  /** Compat: `getCorpInfo` */
  getCompanyInfo(input: Input.CommonBusinessInput): Promise<Output.CommonCompany>
  /** Compat: `updateCorpInfo` */
  updateCompanyInfo(input: Input.UpdateCommonCompanyInput): Promise<Output.CommonOperationResult>
  /** Compat: `registContact` */
  registerContact(input: Input.RegisterCommonContactInput): Promise<Output.CommonOperationResult>
  /** Compat: `getContactInfo` */
  getContactInfo(input: Input.CommonContactQueryInput): Promise<Output.CommonContact>
  /** Compat: `listContact` */
  listContacts(input: Input.CommonBusinessInput): Promise<Output.CommonContact[]>
  /** Compat: `updateContact` */
  updateContact(input: Input.UpdateCommonContactInput): Promise<Output.CommonOperationResult>
  /** Compat: `deleteContact` */
  deleteContact(input: Input.CommonContactQueryInput): Promise<Output.CommonOperationResult>
  /** Compat: `getAccessURL` */
  getLoginURL(input: Input.CommonBusinessInput): Promise<Output.CommonAccessURL>
  /** Compat: `getBalance` */
  getMemberPointBalance(input: Input.CommonBusinessInput): Promise<Output.CommonPointBalance>
  /** Compat: `getPartnerBalance` */
  getPartnerPointBalance(input: Input.CommonBusinessInput): Promise<Output.CommonPointBalance>
  /** Compat: `getChargeURL` */
  getMemberPointChargeURL(input: Input.CommonBusinessInput): Promise<Output.CommonAccessURL>
  /** Compat: `getPartnerURL` */
  getPartnerPointChargeURL(input: Input.CommonBusinessInput): Promise<Output.CommonAccessURL>
  /** Compat: `paymentRequest` */
  requestPointPayment(input: Input.CommonPaymentInput): Promise<Output.CommonPaymentReceipt>
  /** Compat: `getSettleResult` */
  getPointPaymentInfo(input: Input.CommonSettlementQueryInput): Promise<Output.CommonPaymentHistory>
  /** Compat: `getPaymentHistory` */
  getPointPaymentHistory(input: Input.CommonHistoryInput): Promise<Output.CommonHistoryResult<Output.CommonPaymentHistory>>
  /** Compat: `getPaymentURL` */
  getPointPaymentHistoryURL(input: Input.CommonBusinessInput): Promise<Output.CommonAccessURL>
  /** Compat: `getUseHistory` */
  getPointUseHistory(input: Input.CommonUseHistoryInput): Promise<Output.CommonHistoryResult<Output.CommonPointUseHistory>>
  /** Compat: `getUseHistoryURL` */
  getPointUseHistoryURL(input: Input.CommonBusinessInput): Promise<Output.CommonAccessURL>
  /** Compat: `getRefundableBalance` */
  getRefundablePointBalance(input: Input.CommonBusinessInput): Promise<Output.CommonRefundableBalance>
  /** Compat: `refund` */
  requestPointRefund(input: Input.CommonRefundInput): Promise<Output.CommonRefundReceipt>
  /** Compat: `getRefundInfo` */
  getPointRefundInfo(input: Input.CommonRefundQueryInput): Promise<Output.CommonRefundHistory>
  /** Compat: `getRefundHistory` */
  getPointRefundHistory(input: Input.CommonPageInput): Promise<Output.CommonHistoryResult<Output.CommonRefundHistory>>
}
