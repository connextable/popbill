/** 사업자등록상태 조회 결과(raw). 코드와 nullable 날짜를 원문 그대로 보존한다. */
export interface ClosedownBusinessStatusApiModel {
  corpNum: string
  state: string | null
  taxType: string | null
  stateDate: string | null
  typeDate: string | null
  checkDate: string
}
