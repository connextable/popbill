import type { EasyFinBankService } from './types'

export const EASY_FIN_BANK_METHODS = [
  // 계좌관리
  'getBankAccountManagementURL',
  'registerBankAccount',
  'updateBankAccount',
  'getBankAccount',
  'listBankAccounts',
  'requestBankAccountClosure',
  'cancelBankAccountClosure',
  'deleteBankAccount',
  // 수집 요청/상태
  'requestCollection',
  'getCollectionStatus',
  'listCollectionStatuses',
  // 거래내역
  'searchTransactions',
  'summarizeTransactions',
  'saveTransactionMemo',
  // 정액제/과금
  'getSubscriptionRegistrationURL',
  'getSubscriptionStatus',
  'getChargeInfo',
] as const satisfies readonly (keyof EasyFinBankService)[]
