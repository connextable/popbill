/**
 * 팝빌 전자명세서 상태코드.
 * @see https://developers.popbill.com/api-reference/statement/response-code
 */
export const StatementStateCodes = {
  TemporarySaved: 100,
  Issued: 300,
  IssueCanceled: 500,
} as const

export type StatementStateCode = (typeof StatementStateCodes)[keyof typeof StatementStateCodes]

export const STATEMENT_STATE_CODES = {
  TEMPORARY_SAVED: { code: StatementStateCodes.TemporarySaved, message: '임시저장' },
  ISSUED: { code: StatementStateCodes.Issued, message: '발행완료' },
  ISSUE_CANCELED: { code: StatementStateCodes.IssueCanceled, message: '발행취소' },
} as const
