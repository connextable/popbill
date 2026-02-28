import type * as common from '../common'
import type * as models from '../models'

/**
 * TaxInvoice Search Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */

/**
 * Search 상태코드(raw).
 *
 * 2~3번째 자리에 와일드카드(`*`)를 사용할 수 있다.
 * 예: `3**`, `60*`.
 */
export type TaxInvoiceSearchStateCode = string

/**
 * Search 문서유형(raw).
 *
 * - `N`: 세금계산서
 * - `M`: 수정세금계산서
 */
export interface TaxInvoiceSearchDocumentTypeMap {
  /**
   * 세금계산서.
   */
  Normal: 'N'

  /**
   * 수정세금계산서.
   */
  Modified: 'M'
}

/**
 * Search 문서유형(raw).
 */
export type TaxInvoiceSearchDocumentType = TaxInvoiceSearchDocumentTypeMap[keyof TaxInvoiceSearchDocumentTypeMap]

/**
 * Search 과세형태(raw).
 *
 * - `T`: 과세
 * - `N`: 면세
 * - `Z`: 영세
 */
export interface TaxInvoiceSearchTaxTypeMap {
  /**
   * 과세.
   */
  Taxable: 'T'

  /**
   * 면세.
   */
  Exempt: 'N'

  /**
   * 영세.
   */
  ZeroRated: 'Z'
}

/**
 * Search 과세형태(raw).
 */
export type TaxInvoiceSearchTaxType = TaxInvoiceSearchTaxTypeMap[keyof TaxInvoiceSearchTaxTypeMap]

/**
 * Search 발행형태(raw).
 *
 * - `N`: 정발행
 * - `R`: 역발행
 * - `T`: 위수탁
 */
export interface TaxInvoiceSearchIssueTypeMap {
  /**
   * 정발행.
   */
  Normal: 'N'

  /**
   * 역발행.
   */
  Reverse: 'R'

  /**
   * 위수탁.
   */
  Trustee: 'T'
}

/**
 * Search 발행형태(raw).
 */
export type TaxInvoiceSearchIssueType = TaxInvoiceSearchIssueTypeMap[keyof TaxInvoiceSearchIssueTypeMap]

/**
 * Search 종사업장번호 주체(raw).
 *
 * - `S`: 공급자
 * - `B`: 공급받는자
 * - `T`: 수탁자
 */
export interface TaxInvoiceSearchTaxRegIDTypeMap {
  /**
   * 공급자.
   */
  Supplier: 'S'

  /**
   * 공급받는자.
   */
  Buyer: 'B'

  /**
   * 수탁자.
   */
  Trustee: 'T'
}

/**
 * Search 종사업장번호 주체(raw).
 */
export type TaxInvoiceSearchTaxRegIDType = TaxInvoiceSearchTaxRegIDTypeMap[keyof TaxInvoiceSearchTaxRegIDTypeMap]

/**
 * Search 종사업장번호 유무(raw).
 *
 * - `0`: 없음
 * - `1`: 있음
 */
export interface TaxInvoiceSearchTaxRegIDYNMap {
  /**
   * 없음.
   */
  No: '0'

  /**
   * 있음.
   */
  Yes: '1'
}

/**
 * Search 종사업장번호 유무(raw).
 */
export type TaxInvoiceSearchTaxRegIDYN = TaxInvoiceSearchTaxRegIDYNMap[keyof TaxInvoiceSearchTaxRegIDYNMap]

/**
 * Search 등록유형(raw).
 *
 * - `P`: 팝빌 등록(발행)
 * - `H`: 홈택스/ASP 등록(발행)
 */
export interface TaxInvoiceSearchRegTypeMap {
  /**
   * 팝빌 등록(발행).
   */
  Popbill: 'P'

  /**
   * 홈택스/ASP 등록(발행).
   */
  HomeTax: 'H'
}

/**
 * Search 등록유형(raw).
 */
export type TaxInvoiceSearchRegType = TaxInvoiceSearchRegTypeMap[keyof TaxInvoiceSearchRegTypeMap]

/**
 * Search 세금계산서 작성유형(raw).
 *
 * - `0`: 팝빌 사이트 작성
 * - `1`: API 작성
 */
export interface TaxInvoiceSearchInterOPYNMap {
  /**
   * 팝빌 사이트 작성.
   */
  PopbillWeb: '0'

  /**
   * API 작성.
   */
  Api: '1'
}

/**
 * Search 세금계산서 작성유형(raw).
 */
export type TaxInvoiceSearchInterOPYN = TaxInvoiceSearchInterOPYNMap[keyof TaxInvoiceSearchInterOPYNMap]

/**
 * Search API path 파라미터(raw).
 */
export interface TaxInvoiceSearchApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `BUY`: 매입
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: common.TaxInvoiceMgtKeyType
}

/**
 * Search API query 파라미터(raw).
 */
export interface TaxInvoiceSearchApiRequestQuery {
  /**
   * 검색일자 유형.
   *
   * - `R`: 등록일자
   * - `W`: 작성일자
   * - `I`: 발행일자
   */
  DType: common.TaxInvoiceDateType

  /**
   * 검색 시작일자.
   *
   * `yyyyMMdd` 형식.
   */
  SDate: string

  /**
   * 검색 종료일자.
   *
   * `yyyyMMdd` 형식.
   */
  EDate: string

  /**
   * 세금계산서 상태코드 목록.
   *
   * 기본값은 전체조회다.
   */
  State?: TaxInvoiceSearchStateCode[]

  /**
   * 세금계산서 문서유형 목록.
   *
   * 기본값은 전체조회다.
   */
  Type?: TaxInvoiceSearchDocumentType[]

  /**
   * 과세형태 목록.
   *
   * 기본값은 전체조회다.
   */
  TaxType?: TaxInvoiceSearchTaxType[]

  /**
   * 발행형태 목록.
   *
   * 기본값은 전체조회다.
   */
  IssueType?: TaxInvoiceSearchIssueType[]

  /**
   * 지연발행 여부.
   *
   * - `true`: 지연발행
   * - `false`: 정상발행
   *
   * 기본값은 전체조회다.
   */
  LateOnly?: boolean

  /**
   * 종사업장번호 주체.
   *
   * 기본값은 전체조회다.
   */
  TaxRegIDType?: TaxInvoiceSearchTaxRegIDType

  /**
   * 종사업장번호(다중 조회는 `,` 구분).
   *
   * 기본값은 전체조회다.
   */
  TaxRegID?: string

  /**
   * 종사업장번호 유무.
   *
   * 기본값은 전체조회다.
   */
  TaxRegIDYN?: TaxInvoiceSearchTaxRegIDYN

  /**
   * 조회 검색어.
   *
   * `-` 없이 입력한다.
   * 기본값은 전체조회다.
   */
  QString?: string

  /**
   * 목록 페이지번호.
   *
   * 기본값은 `1`.
   */
  Page?: number

  /**
   * 페이지당 표시할 목록 건수.
   *
   * 최대 `1,000`, 기본값 `500`.
   */
  PerPage?: number

  /**
   * 정렬 방향.
   *
   * - `D`: 내림차순 (기본값)
   * - `A`: 오름차순
   */
  Order?: common.TaxInvoiceSortOrder

  /**
   * 세금계산서 작성유형.
   *
   * 기본값은 전체조회다.
   */
  InterOPYN?: TaxInvoiceSearchInterOPYN

  /**
   * 전자세금계산서 등록유형 목록.
   *
   * 기본값은 전체조회다.
   */
  RegType?: TaxInvoiceSearchRegType[]

  /**
   * 휴폐업상태 배열.
   *
   * 기본값은 전체조회다.
   */
  CloseDownState?: common.TaxInvoiceSearchCloseDownState[]

  /**
   * 문서번호 또는 국세청승인번호.
   *
   * 기본값은 전체조회다.
   */
  MgtKey?: string
}

/**
 * Search API request body.
 *
 * Search는 GET query 기반이며 body를 사용하지 않는다.
 */
export type TaxInvoiceSearchApiRequestBody = never

/**
 * Search API 요청(raw).
 *
 * `path/query/body`를 분리하여 전송 위치를 명확히 구분한다.
 */
export type TaxInvoiceSearchApiRequest = common.TaxInvoiceRequireRequestFields<
  common.TaxInvoiceApiRequest<TaxInvoiceSearchApiRequestPath, TaxInvoiceSearchApiRequestQuery, TaxInvoiceSearchApiRequestBody>,
  'path' | 'query'
>

/**
 * Search API 응답(raw).
 */
export type TaxInvoiceSearchApiResponse = models.TaxInvoiceSearchResultApiModel
