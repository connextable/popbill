import type { HTTaxinvoicePromiseService } from './types'

export const HTTAXINVOICE_METHODS = [
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
  'getTaxinvoice',
  'getXML',
  // 보기/인쇄
  'getPopUpURL',
  'getPrintURL',
  // 정액제/과금
  'getFlatRatePopUpURL',
  'getFlatRateState',
  'getChargeInfo',
] as const satisfies readonly (keyof HTTaxinvoicePromiseService)[]
