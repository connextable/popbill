import type { HomeTaxCashbillService } from './types'

export const HOME_TAX_CASHBILL_METHODS = [
  // 인증관리
  'getAuthenticationRegistrationUrl',
  'getCertificateExpiration',
  'validateCertificate',
  'registerDepartmentUser',
  'checkDepartmentUserRegistration',
  'validateDepartmentUser',
  'deleteDepartmentUser',
  // 수집 요청/상태
  'requestCollection',
  'getCollectionJobState',
  'listActiveCollectionJobs',
  // 정보확인
  'searchCashbills',
  'getCashbillSummary',
  // 정액제/과금
  'getFlatRateRegistrationUrl',
  'getFlatRateState',
  'getChargeInfo',
] as const satisfies readonly (keyof HomeTaxCashbillService)[]
