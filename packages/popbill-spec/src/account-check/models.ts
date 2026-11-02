/**
 * 예금주 성명조회 결과(raw). 조회 결과 코드는 API 오류와 구별한다.
 * Node SDK 표의 string 표기와 달리 HTTP 응답의 result는 number이다.
 * @see https://developers.popbill.com/api-reference/accountcheck/api/checkAccount
 */
export interface AccountCheckAccountInfoApiModel {
  bankCode: string
  accountNumber: string
  accountName: string
  result: number
  resultMessage: string
  checkDT: string
}

/** @see https://developers.popbill.com/api-reference/accountcheck/api/checkDepositor */
export interface AccountCheckDepositorInfoApiModel {
  bankCode: string
  accountNumber: string
  identityNumType: 'P' | 'B'
  identityNum: string
  accountName: string
  result: number
  resultMessage: string
  checkDT: string
}
