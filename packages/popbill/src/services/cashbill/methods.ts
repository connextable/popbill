import type { CashbillService } from './types'

export const CASHBILL_METHODS = [
  // 발행/취소
  'issueCashbillImmediately',
  'revokeCashbill',
  'submitCashbills',
  'getCashbillBulkResult',
  'registerCashbill',
  'registerCashbillRevocation',
  'updateCashbill',
  'issueCashbill',
  'cancelIssuedCashbill',
  'deleteCashbill',
  // 정보확인
  'getCashbillInfo',
  'getCashbillsInfo',
  'getCashbillDetailInfo',
  'checkCashbillManagementKeyInUse',
  'searchCashbills',
  'getCashbillLogs',
  'getCashbillBoxURL',
  // 보기/인쇄
  'getCashbillPopupURL',
  'getCashbillViewURL',
  'getCashbillPrintURL',
  'getReceiverCashbillPrintURL',
  'getBulkCashbillPrintURL',
  'getCashbillMailURL',
  'getCashbillPDFURL',
  'downloadCashbillPDF',
  // 부가기능
  'resendCashbillEmail',
  'resendCashbillSMS',
  'resendCashbillFAX',
  'assignCashbillManagementKey',
  'getEmailSendSettings',
  'updateEmailSendSettings',
  // 과금정보
  'getChargeInfo',
  'getUnitCost',
] as const satisfies readonly (keyof CashbillService)[]
