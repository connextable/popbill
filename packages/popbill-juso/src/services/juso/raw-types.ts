/**
 * 주소검색 응답의 주소 항목(raw)입니다.
 */
export interface JusoLinkAddressSearchItemApiResponse {
  /**
   * 도로명주소 기본주소입니다.
   */
  roadAddr1: string

  /**
   * 도로명주소 부가정보입니다.
   */
  roadAddr2?: string

  /**
   * 지번주소입니다.
   */
  jibunAddr: string

  /**
   * 구우편번호입니다.
   */
  zipcode: string

  /**
   * 신우편번호(기초구역번호)입니다.
   */
  sectionNum: string

  /**
   * 상세건물명 목록입니다.
   */
  detailBuildingName?: string[]

  /**
   * 관련지번 목록입니다.
   */
  relatedJibun?: string[]

  /**
   * 법정동 코드입니다.
   */
  dongCode: string

  /**
   * 도로명 코드입니다.
   */
  streetCode: string
}

/**
 * 주소검색 응답(raw)입니다.
 */
export interface JusoLinkAddressSearchApiResponse {
  /**
   * 검색어입니다.
   */
  searches: string

  /**
   * 차등검색으로 제외된 단어 목록입니다.
   */
  deletedWord?: string[]

  /**
   * 수정 제시어입니다.
   */
  suggest?: string

  /**
   * 시도별 검색결과 수입니다.
   */
  sidoCount?: Record<string, number>

  /**
   * 총 검색결과 수입니다.
   */
  numFound: number

  /**
   * 현재 페이지 목록 수입니다.
   */
  listSize: number

  /**
   * 총 페이지 수입니다.
   */
  totalPage: number

  /**
   * 현재 페이지 번호입니다.
   */
  page: number

  /**
   * 주소 목록입니다.
   */
  juso?: JusoLinkAddressSearchItemApiResponse[]
}
