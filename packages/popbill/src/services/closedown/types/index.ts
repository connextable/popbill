export interface BusinessStatusInput {
  businessNumber: string
  targetBusinessNumber: string
}
export interface BusinessStatusesInput {
  businessNumber: string
  targetBusinessNumbers: string[]
}
export interface ClosedownChargeInput {
  businessNumber: string
}

/** 날짜와 상태코드는 공급자가 반환한 표현을 보존한다. */
export interface BusinessStatus {
  businessNumber: string
  businessStateCode: string | null
  taxTypeCode: string | null
  businessStateChangedDate: string | null
  taxTypeChangedDate: string | null
  checkedDate: string
}

export interface ClosedownChargeInfo {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface ClosedownUnitCost {
  unitCost: string
}

export interface ClosedownService {
  /** 사업자등록상태 단건 조회. Compat: `checkCorpNum` */
  checkBusinessStatus(request: BusinessStatusInput): Promise<BusinessStatus>
  /** 사업자등록상태 대량 조회. Compat: `checkCorpNums` */
  checkBusinessStatuses(request: BusinessStatusesInput): Promise<BusinessStatus[]>
  /** 과금정보 조회. Compat: `getChargeInfo` */
  getChargeInfo(request: ClosedownChargeInput): Promise<ClosedownChargeInfo>
  /** 단가 조회. Compat: `getUnitCost` */
  getUnitCost(request: ClosedownChargeInput): Promise<ClosedownUnitCost>
}
