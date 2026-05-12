/**
 * 주소검색 시도 코드 상수입니다.
 */
export const JusoLinkProvinceCodes = {
  Gangwon: 'GANGWON',
  Gyeonggi: 'GYEONGGI',
  Gyeongsangnam: 'GYEONGSANGNAM',
  Gyeongsangbuk: 'GYEONGSANGBUK',
  Gwangju: 'GWANGJU',
  Daegu: 'DAEGU',
  Daejeon: 'DAEJEON',
  Busan: 'BUSAN',
  Seoul: 'SEOUL',
  Sejong: 'SEJONG',
  Ulsan: 'ULSAN',
  Incheon: 'INCHEON',
  Jeollanam: 'JEOLLANAM',
  Jeollabuk: 'JEOLLABUK',
  Jeju: 'JEJU',
  Chungcheongnam: 'CHUNGCHEONGNAM',
  Chungcheongbuk: 'CHUNGCHEONGBUK',
} as const

/**
 * 주소검색 시도 코드 타입입니다.
 */
export type JusoLinkProvinceCode = (typeof JusoLinkProvinceCodes)[keyof typeof JusoLinkProvinceCodes]

/**
 * 주소검색 입력 모델입니다.
 */
export interface SearchAddressesInput {
  /**
   * 검색어입니다.
   */
  searchKeyword: string

  /**
   * 페이지 번호입니다.
   *
   * @default 1
   */
  pageNumber?: number

  /**
   * 페이지 크기입니다.
   *
   * 허용 범위는 1 이상 100 이하입니다.
   * @default 20
   */
  pageSize?: number

  /**
   * 차등검색 비활성화 여부입니다.
   *
   * `true` 이면 차등검색을 비활성화합니다.
   * @default false
   */
  disableDifferentialSearch?: boolean

  /**
   * 수정 제시어 비활성화 여부입니다.
   *
   * `true` 이면 수정 제시어를 비활성화합니다.
   * @default false
   */
  disableSuggestion?: boolean
}

/**
 * 주소 항목 모델입니다.
 */
export interface AddressSearchItem {
  /**
   * 도로명 기본주소입니다.
   */
  roadNameAddress: string

  /**
   * 도로명 부가정보입니다.
   */
  roadNameAddressAdditionalInfo?: string

  /**
   * 지번주소입니다.
   */
  lotNumberAddress: string

  /**
   * 구우편번호입니다.
   */
  oldPostalCode: string

  /**
   * 신우편번호(기초구역번호)입니다.
   */
  newPostalCode: string

  /**
   * 상세건물명 목록입니다.
   */
  detailedBuildingNames: readonly string[]

  /**
   * 관련지번 목록입니다.
   */
  relatedLotNumbers: readonly string[]

  /**
   * 법정동 코드입니다.
   */
  legalDistrictCode: string

  /**
   * 도로명 코드입니다.
   */
  roadNameCode: string
}

/**
 * 주소검색 결과 모델입니다.
 */
export interface SearchAddressesResult {
  /**
   * 적용된 검색어입니다.
   */
  searchKeyword: string

  /**
   * 차등검색에서 제외된 단어 목록입니다.
   */
  excludedKeywords: readonly string[]

  /**
   * 수정 제시어입니다.
   */
  suggestedKeyword?: string

  /**
   * 시도별 검색 결과 수입니다.
   */
  provinceResultCountMap: Readonly<Partial<Record<JusoLinkProvinceCode, number>>>

  /**
   * 총 검색 건수입니다.
   */
  totalResultCount: number

  /**
   * 현재 페이지 주소 건수입니다.
   */
  pageResultCount: number

  /**
   * 총 페이지 수입니다.
   */
  totalPageCount: number

  /**
   * 현재 페이지 번호입니다.
   */
  pageNumber: number

  /**
   * 현재 페이지 주소 목록입니다.
   */
  addresses: readonly AddressSearchItem[]
}

/**
 * 주소링크 주소검색 서비스 인터페이스입니다.
 */
export interface JusoService {
  /**
   * 주소를 검색합니다.
   */
  searchAddresses(input: SearchAddressesInput): Promise<SearchAddressesResult>
}
