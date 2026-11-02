import type { BizInfoCheckCompanyInfoApiModel, BizInfoCheckChargeInfoApiResponse } from '@connextable/popbill-spec'
import type { CompanyInfo, BizInfoCheckChargeInfo } from '../types'

export function mapCompanyInfo(response: BizInfoCheckCompanyInfoApiModel): CompanyInfo {
  return {
    businessNumber: response.corpNum,
    corporateRegistrationNumber: response.companyRegNum,
    companyName: response.corpName,
    chiefExecutiveOfficerName: response.ceoname,
    corporateTypeCode: response.corpCode,
    companyScaleCode: response.corpScaleCode,
    personOrCorporationCode: response.personCorpCode,
    headOfficeCode: response.headOfficeCode,
    establishmentTypeCode: response.establishCode,
    workplaceTypeCode: response.workPlaceCode,
    addressTypeCode: response.addrCode,
    industryCode: response.industryCode,
    postalCode: response.zipCode,
    address: response.addr,
    addressDetail: response.addrDetail,
    englishAddress: response.enAddr,
    businessType: response.bizType,
    businessClass: response.bizClass,
    resultCode: response.result,
    resultMessage: response.resultMessage,
    businessStateCode: response.closeDownState,
    taxTypeCode: response.closeDownTaxType,
    establishedDate: response.establishDate,
    businessStateChangedDate: response.closeDownStateDate,
    taxTypeChangedDate: response.closeDownTaxTypeDate,
    checkedAt: response.checkDT,
  }
}

export function mapBizInfoCheckChargeInfo(response: BizInfoCheckChargeInfoApiResponse): BizInfoCheckChargeInfo {
  return { unitCost: response.unitCost, chargeMethod: response.chargeMethod, rateSystem: response.rateSystem }
}
