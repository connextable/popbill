export type AccountCheckServiceType = '성명' | '실명'
export type AccountIdentityNumberType = 'P' | 'B'
export interface AccountHolderNameInput {
  businessNumber: string
  bankCode: string
  accountNumber: string
}
export interface AccountHolderIdentityInput extends AccountHolderNameInput {
  identityNumberType: AccountIdentityNumberType
  identityNumber: string
}
export interface AccountCheckChargeInput {
  businessNumber: string
  serviceType?: AccountCheckServiceType
}

export interface AccountHolderInfo {
  bankCode: string
  accountNumber: string
  accountHolderName: string
  resultCode: number
  resultMessage: string
  checkedAt: string
}

export interface AccountHolderIdentityInfo {
  bankCode: string
  accountNumber: string
  identityNumberType: AccountIdentityNumberType
  identityNumber: string
  accountHolderName: string
  resultCode: number
  resultMessage: string
  checkedAt: string
}
export interface AccountCheckChargeInfo {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface AccountCheckUnitCost {
  unitCost: string
}

export interface AccountCheckService {
  /** 예금주 성명 조회. Compat: `checkAccountInfo` */
  checkAccountHolderName(request: AccountHolderNameInput): Promise<AccountHolderInfo>
  /** 실명번호를 이용한 예금주 조회. Compat: `checkDepositorInfo` */
  verifyAccountHolderIdentity(request: AccountHolderIdentityInput): Promise<AccountHolderIdentityInfo>
  /** 과금정보 조회. Compat: `getChargeInfo` */
  getChargeInfo(request: AccountCheckChargeInput): Promise<AccountCheckChargeInfo>
  /** 단가 조회. Compat: `getUnitCost` */
  getUnitCost(request: AccountCheckChargeInput): Promise<AccountCheckUnitCost>
}
