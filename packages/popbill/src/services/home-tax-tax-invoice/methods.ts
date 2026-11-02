import type { HomeTaxTaxInvoiceService } from './types'
export const HOME_TAX_TAX_INVOICE_METHODS = [
  // 인증관리
  'getAuthenticationRegistrationUrl',
  'getCertificateExpiration',
  'validateCertificate',
  'registerDepartmentUser',
  'checkDepartmentUserRegistration',
  'validateDepartmentUserLogin',
  'deleteDepartmentUser',
  // 수집 요청/상태
  'requestCollection',
  'getCollectionState',
  'listActiveCollections',
  // 정보확인
  'searchTaxInvoices',
  'getTaxInvoiceTotals',
  'getTaxInvoice',
  'getTaxInvoiceXml',
  // 보기/인쇄
  'getTaxInvoicePopupUrl',
  'getTaxInvoicePrintUrl',
  // 정액제/과금
  'getFlatRateApplicationUrl',
  'getFlatRateState',
  'getChargeInfo',
] as const satisfies readonly (keyof HomeTaxTaxInvoiceService)[]
