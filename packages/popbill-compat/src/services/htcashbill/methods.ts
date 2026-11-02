import type { HTCashbillPromiseService } from './types'

export const HTCASHBILL_METHODS = [
  // 인증관리
  'getCertificatePopUpURL',
  'getCertificateExpireDate',
  'checkCertValidation',
  'registDeptUser',
  'checkDeptUser',
  'checkLoginDeptUser',
  'deleteDeptUser',
  // 수집 요청/상태
  'requestJob',
  'getJobState',
  'listActiveJob',
  // 정보확인
  'search',
  'summary',
  // 정액제/과금
  'getFlatRatePopUpURL',
  'getFlatRateState',
  'getChargeInfo',
] as const satisfies readonly (keyof HTCashbillPromiseService)[]
export const HTCASHBILL_REQUIRED_METHODS = HTCASHBILL_METHODS
