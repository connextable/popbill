/**
 * 기업정보 조회 결과(raw). 회사명 조회 실패도 result/resultMessage로 반환된다.
 * 대표자명은 HTTP 응답의 소문자 ceoname을 사용한다.
 * @see https://developers.popbill.com/api-reference/bizinfocheck/api/check
 */
export interface BizInfoCheckCompanyInfoApiModel {
  corpNum: string
  companyRegNum: string
  corpName: string
  ceoname: string
  corpCode: number
  corpScaleCode: number
  personCorpCode: number
  headOfficeCode: number
  establishCode: number
  workPlaceCode: number
  addrCode: number
  industryCode: string
  zipCode: string
  addr: string
  addrDetail: string
  enAddr: string
  bizType: string
  bizClass: string
  result: number
  resultMessage: string
  closeDownState: number
  closeDownTaxType: number | null
  establishDate: string
  closeDownStateDate: string | null
  closeDownTaxTypeDate: string | null
  checkDT: string
}
