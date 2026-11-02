import type { StatementService } from './types'

export const STATEMENT_METHODS = [
  // 발행/취소
  'issueStatementImmediately',
  'registerStatement',
  'updateStatement',
  'issueStatement',
  'cancelIssuedStatement',
  'deleteStatement',
  // 정보확인
  'getStatementInfo',
  'getStatementsInfo',
  'getStatementDetailInfo',
  'checkStatementManagementKeyInUse',
  'searchStatements',
  'getStatementLogs',
  'getStatementBoxURL',
  // 보기/인쇄
  'getStatementPopupURL',
  'getStatementViewURL',
  'getSenderStatementPrintURL',
  'getReceiverStatementPrintURL',
  'getBulkStatementPrintURL',
  'getStatementMailURL',
  // 부가기능
  'getSealAndAttachmentRegistrationURL',
  'attachFileFromPath',
  'attachFileFromBinary',
  'deleteAttachedFile',
  'getAttachedFiles',
  'resendStatementEmail',
  'resendStatementSMS',
  'resendStatementFAX',
  'sendStatementFAX',
  'attachStatement',
  'detachStatement',
  'getEmailSendSettings',
  'updateEmailSendSettings',
  // 과금정보
  'getChargeInfo',
  'getUnitCost',
] as const satisfies readonly (keyof StatementService)[]
