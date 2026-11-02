import type * as Spec from '@connextable/popbill-spec'
import type { CommonCompanyInfo, CommonContactInput } from '../types'
export function mapCompany(input: CommonCompanyInfo): Spec.CommonCorpInfoApiModel {
  return {
    corpName: input.companyName,
    ceoname: input.chiefExecutiveOfficerName,
    addr: input.address,
    bizType: input.businessType,
    bizClass: input.businessClass,
  }
}
export function mapContact(input: CommonContactInput): Spec.CommonContactInputApiModel {
  return { id: input.userId, personName: input.personName, tel: input.phoneNumber, email: input.emailAddress, searchRole: input.searchRole }
}
