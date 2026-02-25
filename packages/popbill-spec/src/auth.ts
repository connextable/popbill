/**
 * Popbill Authentication Raw Types
 *
 * Source
 * - https://developers.popbill.com/api-reference/cashbill/getting-started/authorization
 */

/**
 * 팝빌 서비스 환경 식별자(raw).
 */
export interface PopbillServiceIdMap {
  /**
   * 테스트(Sandbox) 환경.
   */
  Test: 'POPBILL_TEST'

  /**
   * 운영(Production) 환경.
   */
  Production: 'POPBILL'
}

/**
 * 팝빌 서비스 환경 식별자(raw).
 */
export type PopbillServiceId = PopbillServiceIdMap[keyof PopbillServiceIdMap]

/**
 * LINKHUB 인증 서명 헤더(raw).
 *
 * HTTP 헤더 `Authorization: LINKHUB {LinkID} {Signature}` 형식으로 전달한다.
 */
export type PopbillAuthSignatureHeader = `LINKHUB ${string} ${string}`

/**
 * 토큰 발급용 LINKHUB 공통 헤더(raw).
 */
export interface PopbillLinkhubRequestHeaders {
  /**
   * 요청 본문 형식.
   */
  ContentType: 'application/json'

  /**
   * Linkhub API 버전.
   *
   * HTTP 헤더 `X-LH-Version`로 전달한다.
   */
  XLHVersion: '2.0'

  /**
   * 요청 일시(UTC).
   *
   * HTTP 헤더 `X-LH-Date`로 전달한다.
   */
  XLHDate: string

  /**
   * 토큰 사용 허용 IP.
   *
   * HTTP 헤더 `X-LH-Forwarded`로 전달한다.
   */
  XLHForwarded?: string
}

/**
 * 팝빌 인증 scope 코드 매핑(raw).
 *
 * 런타임 상수 없이 타입 레벨에서 의미(이름-코드)를 유지한다.
 */
export interface PopbillAuthScopeMap {
  /** 공통 (member) */
  Member: 'member'

  /** 전자세금계산서 (110) */
  TaxInvoice: '110'
  /** 현금영수증 (140) */
  Cashbill: '140'

  /** 전자명세서 > 거래명세서 (121) */
  StatementTrade: '121'
  /** 전자명세서 > 청구서 (122) */
  StatementInvoice: '122'
  /** 전자명세서 > 견적서 (123) */
  StatementEstimate: '123'
  /** 전자명세서 > 발주서 (124) */
  StatementPurchaseOrder: '124'
  /** 전자명세서 > 입금표 (125) */
  StatementDeposit: '125'
  /** 전자명세서 > 영수증 (126) */
  StatementReceipt: '126'

  /** 홈택스수집 > 전자세금계산서 (111) */
  HomeTaxTaxInvoice: '111'
  /** 홈택스수집 > 현금영수증 (141) */
  HomeTaxCashbill: '141'

  /** 사업자등록상태조회 (170) */
  BizStateCheck: '170'
  /** 기업정보조회 (171) */
  BizInfoCheck: '171'

  /** 예금주조회 > 성명조회 (182) */
  DepositorNameCheck: '182'
  /** 예금주조회 > 실명조회 (183) */
  DepositorRealNameCheck: '183'
  /** 계좌조회 (180) */
  AccountCheck: '180'

  /** 카카오톡 > 알림톡 (153) */
  KakaoAlimtalk: '153'
  /** 카카오톡 > 브랜드 메시지(I) (156) */
  KakaoBrandMessageI: '156'
  /** 카카오톡 > 브랜드 메시지(N) (157) */
  KakaoBrandMessageN: '157'
  /** 카카오톡 > 브랜드 메시지(M) (158) */
  KakaoBrandMessageM: '158'

  /** 문자 > SMS (150) */
  MessageSms: '150'
  /** 문자 > LMS (151) */
  MessageLms: '151'
  /** 문자 > MMS (152) */
  MessageMms: '152'

  /** 팩스 > 일반망 (160) */
  Fax: '160'
  /** 팩스 > 지능망 (161) */
  IntelligentFax: '161'
}

/**
 * 팝빌 인증 scope(raw).
 */
export type PopbillAuthScope = PopbillAuthScopeMap[keyof PopbillAuthScopeMap]

/**
 * 토큰 발급 API path 파라미터(raw).
 */
export interface PopbillIssueTokenApiRequestPath {
  /**
   * 테스트/운영 환경 구분 고유식별정보.
   */
  serviceId: PopbillServiceId
}

/**
 * 토큰 발급 API query 파라미터.
 */
export type PopbillIssueTokenApiRequestQuery = never

/**
 * 토큰 발급 API 헤더(raw).
 */
export interface PopbillIssueTokenApiRequestHeaders extends PopbillLinkhubRequestHeaders {
  /**
   * LinkID, Signature 조합의 LINKHUB 인증 헤더.
   *
   * HTTP 헤더 `Authorization: LINKHUB {LinkID} {Signature}` 형식으로 전달한다.
   */
  Authorization: PopbillAuthSignatureHeader
}

/**
 * 토큰 발급 API body(raw).
 */
export interface PopbillIssueTokenApiRequestBody {
  /**
   * 팝빌회원 사업자번호.
   */
  access_id: string

  /**
   * API 접근 권한 목록.
   */
  scope: PopbillAuthScope[]
}

/**
 * 토큰 발급 API 요청(raw).
 */
export interface PopbillIssueTokenApiRequest {
  /**
   * 토큰 발급 대상 서비스 식별자 path 파라미터.
   */
  path: PopbillIssueTokenApiRequestPath

  /**
   * 토큰 발급 API query 파라미터.
   *
   * 현재 문서 기준 사용하지 않는다.
   */
  query?: PopbillIssueTokenApiRequestQuery

  /**
   * LINKHUB 인증 및 X-LH-* 요청 헤더.
   */
  headers: PopbillIssueTokenApiRequestHeaders

  /**
   * 토큰 발급 요청 본문.
   */
  body: PopbillIssueTokenApiRequestBody
}

/**
 * 토큰 발급 API 응답(raw).
 */
export interface PopbillIssueTokenApiResponse {
  /**
   * 발급된 세션 토큰.
   *
   * 일반 API 호출 시 `Authorization: Bearer {session_token}`에 사용한다.
   */
  session_token: string

  /**
   * 테스트/운영 환경 구분 고유식별정보.
   */
  serviceID: PopbillServiceId

  /**
   * 파트너 LinkID.
   */
  linkID: string

  /**
   * 팝빌회원 사업자번호.
   */
  userID: string

  /**
   * 파트너 코드.
   */
  partnerCode: string

  /**
   * 팝빌회원 코드.
   */
  usercode: string

  /**
   * 발급된 토큰의 API 접근 권한 목록.
   */
  scope: PopbillAuthScope[]

  /**
   * 토큰 사용 허용 IP.
   */
  ipaddress: string

  /**
   * 토큰 만료일시(UTC).
   *
   * 형식: `yyyy-MM-ddTHH:mm:ssZ`
   */
  expiration: string
}
