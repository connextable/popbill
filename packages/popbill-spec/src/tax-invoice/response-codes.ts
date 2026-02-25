/**
 * Tax Invoice Response / Status Codes
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/response-code
 */

/**
 * 세금계산서 상태코드 정의.
 */
export interface TaxInvoiceStateCodeDefinition {
  code: number
  message: string
  description: string
}

/**
 * 국세청 결과코드 정의.
 */
export interface TaxInvoiceNtsResultCodeDefinition {
  code: string
  description: string
}

/**
 * 세금계산서 상태코드(`stateCode`) 상수.
 *
 * 문서 분류(정발행/역발행/위수탁) 기준으로 구분한다.
 */
export const TAX_INVOICE_STATE_CODES = {
  /**
   * 정발행 상태코드.
   */
  REGULAR: {
    TEMPORARY_SAVED: {
      code: 100,
      message: '임시저장',
      description: '공급자가 작성한 세금계산서가 임시저장된 상태',
    },
    ISSUED: {
      code: 300,
      message: '발행완료',
      description: '전자세금계산서 발행이 완료된 상태',
    },
    BEFORE_NTS_TRANSMISSION: {
      code: 301,
      message: '전송전',
      description: '팝빌에서 국세청 전송을 준비중인 상태',
    },
    PENDING_NTS_TRANSMISSION: {
      code: 302,
      message: '전송대기',
      description: '팝빌에서 국세청 전송을 대기중인 상태',
    },
    TRANSMITTING_TO_NTS: {
      code: 303,
      message: '전송중',
      description: '팝빌에서 국세청 전송을 진행중인 상태',
    },
    NTS_TRANSMISSION_SUCCESS: {
      code: 304,
      message: '전송성공',
      description: '전자세금계산서 국세청 신고가 정상적으로 완료된 상태',
    },
    NTS_TRANSMISSION_FAILED: {
      code: 305,
      message: '전송실패',
      description: '국세청이 특정사유로 전자세금계산서 신고를 반려한 상태',
    },
    ISSUE_CANCELED: {
      code: 600,
      message: '발행취소',
      description: '공급자가 발행완료된 전자세금계산서를 취소한 상태 (국세청 전송 대상에서 제외)',
    },
  },

  /**
   * 역발행 상태코드.
   */
  REVERSE: {
    TEMPORARY_SAVED: {
      code: 100,
      message: '임시저장',
      description: '공급받는자가 작성한 세금계산서가 임시저장된 상태',
    },
    REVERSE_ISSUE_PENDING: {
      code: 200,
      message: '(역)발행대기',
      description: '공급자에게 전자세금계산서 (역)발행을 요청한 상태',
    },
    ISSUED: {
      code: 300,
      message: '발행완료',
      description: '전자세금계산서 발행이 완료된 상태',
    },
    BEFORE_NTS_TRANSMISSION: {
      code: 301,
      message: '전송전',
      description: '팝빌에서 국세청 전송을 준비중인 상태',
    },
    PENDING_NTS_TRANSMISSION: {
      code: 302,
      message: '전송대기',
      description: '팝빌에서 국세청 전송을 대기중인 상태',
    },
    TRANSMITTING_TO_NTS: {
      code: 303,
      message: '전송중',
      description: '팝빌에서 국세청 전송을 진행중인 상태',
    },
    NTS_TRANSMISSION_SUCCESS: {
      code: 304,
      message: '전송성공',
      description: '전자세금계산서 국세청 신고가 정상적으로 완료된 상태',
    },
    NTS_TRANSMISSION_FAILED: {
      code: 305,
      message: '전송실패',
      description: '국세청이 특정사유로 전자세금계산서 신고를 반려한 상태',
    },
    REVERSE_ISSUE_REJECTED: {
      code: 400,
      message: '(역)발행거부',
      description: '공급자가 (역)발행대기 세금계산서를 거부한 상태',
    },
    REVERSE_ISSUE_CANCELED: {
      code: 500,
      message: '(역)발행취소',
      description: '공급받는자가 (역)발행대기 세금계산서를 취소한 상태',
    },
    ISSUE_CANCELED: {
      code: 600,
      message: '발행취소',
      description: '공급자가 발행완료된 전자세금계산서를 취소한 상태 (국세청 전송 대상에서 제외)',
    },
  },

  /**
   * 위수탁 상태코드.
   */
  TRUSTEE: {
    TEMPORARY_SAVED: {
      code: 100,
      message: '임시저장',
      description: '수탁자가 작성한 세금계산서가 임시저장된 상태',
    },
    ISSUED: {
      code: 300,
      message: '발행완료',
      description: '전자세금계산서 발행이 완료된 상태',
    },
    BEFORE_NTS_TRANSMISSION: {
      code: 301,
      message: '전송전',
      description: '팝빌에서 국세청 전송을 준비중인 상태',
    },
    PENDING_NTS_TRANSMISSION: {
      code: 302,
      message: '전송대기',
      description: '팝빌에서 국세청 전송을 대기중인 상태',
    },
    TRANSMITTING_TO_NTS: {
      code: 303,
      message: '전송중',
      description: '팝빌에서 국세청 전송을 진행중인 상태',
    },
    NTS_TRANSMISSION_SUCCESS: {
      code: 304,
      message: '전송성공',
      description: '전자세금계산서 국세청 신고가 정상적으로 완료된 상태',
    },
    NTS_TRANSMISSION_FAILED: {
      code: 305,
      message: '전송실패',
      description: '국세청이 특정사유로 전자세금계산서 신고를 반려한 상태',
    },
    ISSUE_CANCELED: {
      code: 600,
      message: '발행취소',
      description: '수탁자가 발행완료된 전자세금계산서를 취소한 상태 (국세청 전송 대상에서 제외)',
    },
  },
} as const satisfies Record<string, Record<string, TaxInvoiceStateCodeDefinition>>

/**
 * 국세청 결과코드(`ntssendErrCode`) 상수.
 *
 * - `SUCCESS`: 팝빌 상태코드 `304`(전송성공)에 해당
 * - `FAILURE`: 팝빌 상태코드 `305`(전송실패)에 해당
 */
export const TAX_INVOICE_NTS_RESULT_CODES = {
  SUCCESS: {
    SUC001: {
      code: 'SUC001',
      description: '국세청의 검증 과정을 통과하여 전자세금계산서 신고가 정상적으로 완료된 경우',
    },
  },

  FAILURE: {
    SYN002: {
      code: 'SYN002',
      description: '전자세금계산서의 전자서명이 유효하지 않은 경우',
    },
    SYN003: {
      code: 'SYN003',
      description: '국세청에 중복된 국세청승인번호가 존재하는 경우',
    },
    SYN004: {
      code: 'SYN004',
      description: '전자세금계산서의 국세청 신고 형식이 유효하지 않은 경우',
    },
    ERR001: {
      code: 'ERR001',
      description: '공급자의 사업자번호가 국세청에 등록되지 않은 경우',
    },
    ERR002: {
      code: 'ERR002',
      description: '공급받는자의 사업자번호 또는 주민등록번호가 국세청에 등록되지 않은 경우',
    },
    ERR003: {
      code: 'ERR003',
      description: '수탁자의 사업자번호가 국세청에 등록되지 않은 경우',
    },
    ERR005: {
      code: 'ERR005',
      description: '발행일시가 유효하지 않는 경우',
    },
    ERR006: {
      code: 'ERR006',
      description: '작성일자가 유효하지 않는 경우',
    },
    ERR007: {
      code: 'ERR007',
      description: '공급가액 또는 세액이 유효하지 않은 경우',
    },
    ERR008: {
      code: 'ERR008',
      description: '수정세금계산서의 수정 사유코드가 유효하지 않은 경우',
    },
    ERR009: {
      code: 'ERR009',
      description: '폐업된 사업자번호로 폐업신고일자 이후 전자세금계산서를 발행한 경우',
    },
    ERR010: {
      code: 'ERR010',
      description: '시스템사업자의 등록번호가 국세청승인번호와 동일하지 않은 경우',
    },
    ERR011: {
      code: 'ERR011',
      description: '수정세금계산서의 당초 국세청승인번호가 존재하지 않는 경우',
    },
    ERR099: {
      code: 'ERR099',
      description: '사전에 정의되지 않은 기타오류가 발생한 경우',
    },
  },
} as const satisfies Record<string, Record<string, TaxInvoiceNtsResultCodeDefinition>>

/**
 * 하위 호환용 응답코드 네임스페이스.
 *
 * `stateCode`와 `ntssendErrCode`를 함께 노출한다.
 */
export const TAX_INVOICE_RESPONSE_CODES = {
  state: TAX_INVOICE_STATE_CODES,
  ntsResult: TAX_INVOICE_NTS_RESULT_CODES,
} as const

export type TaxInvoiceResponseCodeGroups = keyof typeof TAX_INVOICE_RESPONSE_CODES

type ValueOf<T> = T[keyof T]

export type TaxInvoiceStateCodeDefinitionValue = ValueOf<ValueOf<typeof TAX_INVOICE_STATE_CODES>>

export type TaxInvoiceStateCode = TaxInvoiceStateCodeDefinitionValue['code']

export type TaxInvoiceNtsResultCodeDefinitionValue = ValueOf<ValueOf<typeof TAX_INVOICE_NTS_RESULT_CODES>>

export type TaxInvoiceNtsResultCode = TaxInvoiceNtsResultCodeDefinitionValue['code']
