import type { ClosedownBusinessStatusApiModel, ClosedownChargeInfoApiResponse } from '@connextable/popbill-spec'
import type { BusinessStatus, ClosedownChargeInfo } from '../types'

export function mapBusinessStatus(response: ClosedownBusinessStatusApiModel): BusinessStatus {
  return {
    businessNumber: response.corpNum,
    businessStateCode: response.state,
    taxTypeCode: response.taxType,
    businessStateChangedDate: response.stateDate,
    taxTypeChangedDate: response.typeDate,
    checkedDate: response.checkDate,
  }
}

export function mapClosedownChargeInfo(response: ClosedownChargeInfoApiResponse): ClosedownChargeInfo {
  return { unitCost: response.unitCost, chargeMethod: response.chargeMethod, rateSystem: response.rateSystem }
}
