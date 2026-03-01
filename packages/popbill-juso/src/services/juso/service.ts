import {
  JusoLinkProvinceCodes,
  type AddressSearchItem,
  type JusoService,
  type JusoLinkProvinceCode,
  type SearchAddressesInput,
  type SearchAddressesResult,
} from './types'
import type { JusoLinkAddressSearchApiResponse, JusoLinkAddressSearchItemApiResponse } from './raw-types'
import { JusoLinkSearchDefaults } from '@/constants'
import type { LinkhubRequestClient } from '@connextable/popbill-runtime'
import type { JusoApiError } from '@/errors'
import { dispatchJusoApiErrorSafely, normalizeJusoApiError } from '@/errors'
import { normalizeOptionalString, normalizeRequiredString } from '@connextable/popbill-utils'

const SEARCH_ADDRESSES_OPERATION = 'juso.searchAddresses'

interface CreateJusoServiceInput {
  /**
   * 링크허브 공용 요청 클라이언트입니다.
   */
  requestClient: LinkhubRequestClient

  /**
   * SDK 에러 콜백입니다.
   */
  onError?: (error: JusoApiError) => void
}

/**
 * 주소검색 서비스를 생성합니다.
 */
export function createJusoService(input: CreateJusoServiceInput): JusoService {
  return {
    async searchAddresses(searchInput: SearchAddressesInput): Promise<SearchAddressesResult> {
      try {
        const normalizedSearchInput = normalizeSearchInput(searchInput)
        const queryParameters = new URLSearchParams({
          Searches: normalizedSearchInput.searchKeyword,
          PageNum: String(normalizedSearchInput.pageNumber),
          PerPage: String(normalizedSearchInput.pageSize),
          noDifferential: String(normalizedSearchInput.disableDifferentialSearch),
          noSuggest: String(normalizedSearchInput.disableSuggestion),
        })

        const apiResponse = await input.requestClient.requestJson<JusoLinkAddressSearchApiResponse>({
          uri: `/Search?${queryParameters.toString()}`,
          method: 'GET',
        })

        return mapSearchResult(apiResponse)
      } catch (error) {
        const normalizedError = normalizeJusoApiError(error, {
          operationName: SEARCH_ADDRESSES_OPERATION,
        })
        dispatchJusoApiErrorSafely(input.onError, normalizedError)
        throw normalizedError
      }
    },
  }
}

interface NormalizedSearchInput {
  /**
   * 정규화된 검색어입니다.
   */
  searchKeyword: string

  /**
   * 정규화된 페이지 번호입니다.
   */
  pageNumber: number

  /**
   * 정규화된 페이지 크기입니다.
   */
  pageSize: number

  /**
   * 차등검색 비활성화 여부입니다.
   */
  disableDifferentialSearch: boolean

  /**
   * 수정 제시어 비활성화 여부입니다.
   */
  disableSuggestion: boolean
}

function normalizeSearchInput(input: SearchAddressesInput): NormalizedSearchInput {
  const searchKeyword = normalizeRequiredString(input.searchKeyword, 'searchKeyword는 필수입니다.')
  const pageNumber = normalizePositiveInteger(input.pageNumber, JusoLinkSearchDefaults.PageNumber, 'pageNumber')
  const pageSize = normalizePageSize(input.pageSize)

  return {
    searchKeyword,
    pageNumber,
    pageSize,
    disableDifferentialSearch: input.disableDifferentialSearch ?? JusoLinkSearchDefaults.DisableDifferentialSearch,
    disableSuggestion: input.disableSuggestion ?? JusoLinkSearchDefaults.DisableSuggestion,
  }
}

function normalizePositiveInteger(value: number | undefined, defaultValue: number, fieldName: string): number {
  if (value === undefined) {
    return defaultValue
  }

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName}는 1 이상의 정수여야 합니다.`)
  }

  return value
}

function normalizePageSize(value: number | undefined): number {
  const pageSize = normalizePositiveInteger(value, JusoLinkSearchDefaults.PageSize, 'pageSize')

  if (pageSize > JusoLinkSearchDefaults.MaximumPageSize) {
    throw new Error(`pageSize는 ${String(JusoLinkSearchDefaults.MaximumPageSize)} 이하여야 합니다.`)
  }

  return pageSize
}

function mapSearchResult(apiResponse: JusoLinkAddressSearchApiResponse): SearchAddressesResult {
  return {
    searchKeyword: apiResponse.searches,
    excludedKeywords: apiResponse.deletedWord ?? [],
    suggestedKeyword: normalizeOptionalString(apiResponse.suggest),
    provinceResultCountMap: mapProvinceResultCountMap(apiResponse.sidoCount),
    totalResultCount: apiResponse.numFound,
    pageResultCount: apiResponse.listSize,
    totalPageCount: apiResponse.totalPage,
    pageNumber: apiResponse.page,
    addresses: (apiResponse.juso ?? []).map(mapAddressItem),
  }
}

function mapAddressItem(item: JusoLinkAddressSearchItemApiResponse): AddressSearchItem {
  return {
    roadNameAddress: item.roadAddr1,
    roadNameAddressAdditionalInfo: normalizeOptionalString(item.roadAddr2),
    lotNumberAddress: item.jibunAddr,
    oldPostalCode: item.zipcode,
    newPostalCode: item.sectionNum,
    detailedBuildingNames: item.detailBuildingName ?? [],
    relatedLotNumbers: item.relatedJibun ?? [],
    legalDistrictCode: item.dongCode,
    roadNameCode: item.streetCode,
  }
}

function mapProvinceResultCountMap(source: Record<string, number> | undefined): Partial<Record<JusoLinkProvinceCode, number>> {
  if (!source) {
    return {}
  }

  const result: Partial<Record<JusoLinkProvinceCode, number>> = {}
  const validProvinceCodeSet = new Set<string>(Object.values(JusoLinkProvinceCodes))

  for (const [provinceCode, count] of Object.entries(source)) {
    if (!validProvinceCodeSet.has(provinceCode)) {
      continue
    }

    result[provinceCode as JusoLinkProvinceCode] = count
  }

  return result
}
