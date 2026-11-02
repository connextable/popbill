export interface CommonBusinessInput {
  businessNumber: string
}
export interface CommonPageInput extends CommonBusinessInput {
  /** @default 1 */
  pageNumber?: number
  /** @default 500 */
  pageSize?: number
}
export interface CommonCompanyInfo {
  companyName: string
  chiefExecutiveOfficerName: string
  address: string
  businessType: string
  businessClass: string
}
export interface CommonContactInput {
  userId: string
  personName: string
  phoneNumber: string
  emailAddress: string
  searchRole?: number
}
export interface RegisterMemberInput extends CommonBusinessInput {
  userId: string
  password: string
  company: CommonCompanyInfo
  contactName: string
  contactPhoneNumber: string
  contactEmailAddress: string
}
export interface QuitMemberInput extends CommonBusinessInput {
  reason: string
}
export interface UpdateCommonCompanyInput extends CommonBusinessInput {
  company: CommonCompanyInfo
}
export interface RegisterCommonContactInput extends CommonBusinessInput {
  contact: CommonContactInput & { password: string }
}
export interface CommonContactQueryInput extends CommonBusinessInput {
  contactUserId: string
}
export interface UpdateCommonContactInput extends CommonBusinessInput {
  contact: CommonContactInput
}
export interface CommonPaymentInput extends CommonBusinessInput {
  paymentName: string
  paymentAmount: string
  contactName?: string
  contactEmailAddress?: string
  notificationPhoneNumber?: string
}
export interface CommonSettlementQueryInput extends CommonBusinessInput {
  settlementCode: string
}
export interface CommonHistoryInput extends CommonBusinessInput {
  startDate: string
  endDate: string
  /** @default 1 */
  pageNumber?: number
  /** @default 500 */
  pageSize?: number
}
export interface CommonUseHistoryInput extends CommonBusinessInput {
  startDate: string
  endDate: string
  sortOrder?: 'A' | 'D'
  /** @default 1 */
  pageNumber?: number
  /** @default 500 */
  pageSize?: number
}
export interface CommonRefundInput extends CommonBusinessInput {
  bankName: string
  accountNumber: string
  accountHolderName: string
  requestedPoints: string
  contactName: string
  phoneNumber: string
  reason?: string
}
export interface CommonRefundQueryInput extends CommonBusinessInput {
  refundCode: string
}
