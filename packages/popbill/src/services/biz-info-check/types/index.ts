import type { WithPopbillCallOptions } from '@/client/call-options'
export interface CompanyInfoInput {
  businessNumber: string
  targetBusinessNumber: string
}
export interface BizInfoCheckChargeInput {
  businessNumber: string
}

export interface CompanyInfo {
  businessNumber: string
  corporateRegistrationNumber: string
  companyName: string
  chiefExecutiveOfficerName: string
  corporateTypeCode: number
  companyScaleCode: number
  personOrCorporationCode: number
  headOfficeCode: number
  establishmentTypeCode: number
  workplaceTypeCode: number
  addressTypeCode: number
  industryCode: string
  postalCode: string
  address: string
  addressDetail: string
  englishAddress: string
  businessType: string
  businessClass: string
  resultCode: number
  resultMessage: string
  businessStateCode: number
  taxTypeCode: number | null
  establishedDate: string
  businessStateChangedDate: string | null
  taxTypeChangedDate: string | null
  checkedAt: string
}

export interface BizInfoCheckChargeInfo {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface BizInfoCheckUnitCost {
  unitCost: string
}

export interface BizInfoCheckService extends WithPopbillCallOptions<BizInfoCheckServiceOperations> {}

interface BizInfoCheckServiceOperations {
  /** 기업정보 조회. Compat: `checkBizInfo` */
  getCompanyInfo(request: CompanyInfoInput): Promise<CompanyInfo>
  /** 과금정보 조회. Compat: `getChargeInfo` */
  getChargeInfo(request: BizInfoCheckChargeInput): Promise<BizInfoCheckChargeInfo>
  /** 단가 조회. Compat: `getUnitCost` */
  getUnitCost(request: BizInfoCheckChargeInput): Promise<BizInfoCheckUnitCost>
}
