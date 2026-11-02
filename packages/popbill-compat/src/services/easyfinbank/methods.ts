import type { EasyFinBankPromiseService } from './types'

export const EASY_FIN_BANK_METHODS = [
  // 계좌관리
  'getBankAccountMgtURL',
  'registBankAccount',
  'updateBankAccount',
  'getBankAccountInfo',
  'listBankAccount',
  'closeBankAccount',
  'revokeCloseBankAccount',
  'deleteBankAccount',
  // 수집 요청/상태
  'requestJob',
  'getJobState',
  'listActiveJob',
  // 거래내역
  'search',
  'summary',
  'saveMemo',
  // 정액제/과금
  'getFlatRatePopUpURL',
  'getFlatRateState',
  'getChargeInfo',
] as const satisfies readonly (keyof EasyFinBankPromiseService)[]

export const EASY_FIN_BANK_REQUIRED_METHODS = EASY_FIN_BANK_METHODS
