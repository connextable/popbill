import { createJusoLinkClient, type SearchAddressesInput, type SearchAddressesResult } from '@connextable/popbill-juso'
import { loadJusoRuntimeConfig } from './env.ts'
import { formatJusoError } from './error.ts'
import { logError, logInfo, printHeader } from './log.ts'
import { createSharedRunner } from '../shared/runner.ts'

main().catch((error) => {
  logError('예상하지 못한 런타임 에러', formatJusoError(error))
  process.exitCode = 1
})

async function main(): Promise<void> {
  printHeader('POPBILL JUSO SEARCH EXAMPLE')
  const rawArgumentList = process.argv.slice(2)

  if (hasHelpFlag(rawArgumentList)) {
    printUsage()
    return
  }

  const runtimeConfig = loadJusoRuntimeConfig()
  if (runtimeConfig.missingNames.length > 0) {
    logError('필수 환경변수 누락', {
      missingNames: runtimeConfig.missingNames,
      hint: 'examples/.env.example 참고 후 examples/.env에 값을 입력하세요.',
    })
    process.exitCode = 1
    return
  }

  const searchInput = parseSearchInput(rawArgumentList, runtimeConfig.defaultSearchKeyword)
  if (!searchInput) {
    logError('검색어가 없습니다.', {
      hint: '예시: pnpm -C examples juso -- "서울 강남구 테헤란로"',
    })
    printUsage()
    process.exitCode = 1
    return
  }

  const client = createJusoLinkClient({
    linkId: runtimeConfig.linkId,
    secretKey: runtimeConfig.secretKey,
    accessId: runtimeConfig.accessId,
    apiBaseUrl: runtimeConfig.apiBaseUrl,
    authBaseUrl: runtimeConfig.authBaseUrl,
    useLocalTime: runtimeConfig.useLocalTime,
    requestTimeoutMilliseconds: runtimeConfig.requestTimeoutMilliseconds,
    acceptLanguage: runtimeConfig.acceptLanguage,
    forwardedIpAddress: runtimeConfig.forwardedIpAddress,
    onError(error) {
      logError('SDK onError 콜백', formatJusoError(error))
    },
  })

  const runner = createSharedRunner({
    formatError: formatJusoError,
  })

  const searchResultRunResult = await runner.run(
    'juso.searchAddresses',
    searchInput,
    () => client.services.juso.searchAddresses(searchInput),
    summarizeSearchResult
  )

  if (!searchResultRunResult.ok) {
    process.exitCode = 1
    return
  }

  const searchResult = searchResultRunResult.value
  const previewCount = Math.min(5, searchResult.addresses.length)
  logInfo('상위 결과 미리보기', {
    previewCount,
    addresses: searchResult.addresses.slice(0, previewCount).map((item) => ({
      roadNameAddress: item.roadNameAddress,
      lotNumberAddress: item.lotNumberAddress,
      newPostalCode: item.newPostalCode,
      oldPostalCode: item.oldPostalCode,
    })),
  })
}

function parseSearchInput(rawArgumentList: readonly string[], fallbackKeyword: string | undefined): SearchAddressesInput | null {
  const normalizedArgumentList = rawArgumentList.map((value) => value.trim()).filter((value) => value.length > 0)
  const optionMap = parseOptionMap(normalizedArgumentList)
  const positionalKeyword = normalizedArgumentList.find((value) => !value.startsWith('--'))
  const searchKeyword = optionMap.keyword ?? positionalKeyword ?? fallbackKeyword

  if (!searchKeyword || searchKeyword.length === 0) {
    return null
  }

  return {
    searchKeyword,
    pageNumber: parsePositiveIntegerOption(optionMap.pageNumber, 'pageNumber'),
    pageSize: parsePositiveIntegerOption(optionMap.pageSize, 'pageSize'),
    disableDifferentialSearch: optionMap.disableDifferentialSearch,
    disableSuggestion: optionMap.disableSuggestion,
  }
}

function parseOptionMap(rawArgumentList: readonly string[]): {
  keyword?: string
  pageNumber?: string
  pageSize?: string
  disableDifferentialSearch: boolean
  disableSuggestion: boolean
} {
  return {
    keyword: readOptionValue(rawArgumentList, '--keyword'),
    pageNumber: readOptionValue(rawArgumentList, '--page-number'),
    pageSize: readOptionValue(rawArgumentList, '--page-size'),
    disableDifferentialSearch: rawArgumentList.includes('--disable-differential-search'),
    disableSuggestion: rawArgumentList.includes('--disable-suggestion'),
  }
}

function readOptionValue(rawArgumentList: readonly string[], optionName: string): string | undefined {
  for (let index = 0; index < rawArgumentList.length; index += 1) {
    const token = rawArgumentList[index]
    if (token !== optionName) {
      continue
    }

    const value = rawArgumentList[index + 1]
    if (!value || value.startsWith('--')) {
      return undefined
    }

    return value
  }

  return undefined
}

function parsePositiveIntegerOption(value: string | undefined, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined
  }

  const parsedValue = Number.parseInt(value, 10)
  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`${fieldName}는 1 이상의 정수여야 합니다.`)
  }

  return parsedValue
}

function hasHelpFlag(rawArgumentList: readonly string[]): boolean {
  return rawArgumentList.includes('--help') || rawArgumentList.includes('-h')
}

function summarizeSearchResult(value: SearchAddressesResult): {
  totalResultCount: number
  pageResultCount: number
  totalPageCount: number
  pageNumber: number
  suggestedKeyword: string | null
  excludedKeywords: readonly string[]
  provinceResultCountMap: SearchAddressesResult['provinceResultCountMap']
} {
  return {
    totalResultCount: value.totalResultCount,
    pageResultCount: value.pageResultCount,
    totalPageCount: value.totalPageCount,
    pageNumber: value.pageNumber,
    suggestedKeyword: value.suggestedKeyword ?? null,
    excludedKeywords: value.excludedKeywords,
    provinceResultCountMap: value.provinceResultCountMap,
  }
}

function printUsage(): void {
  const lines: string[] = []
  lines.push('실행 방법')
  lines.push('  pnpm -C examples juso -- "<검색어>"')
  lines.push('  pnpm -C examples juso -- --keyword "<검색어>" --page-number 1 --page-size 20')
  lines.push('')
  lines.push('옵션')
  lines.push('  --keyword <string>                 검색어')
  lines.push('  --page-number <number>             페이지 번호(1 이상)')
  lines.push('  --page-size <number>               페이지 크기(1 이상, 최대 100)')
  lines.push('  --disable-differential-search      차등검색 비활성화')
  lines.push('  --disable-suggestion               수정 제시어 비활성화')
  lines.push('')
  lines.push('환경변수')
  lines.push('  JUSO_LINK_ID, JUSO_SECRET_KEY, JUSO_ACCESS_ID (필수)')
  lines.push('  JUSO_SEARCH_KEYWORD (기본 검색어)')
  lines.push('')
  lines.push('예시')
  lines.push('  pnpm -C examples juso -- "서울 강남구 테헤란로"')
  lines.push('  pnpm -C examples juso -- --keyword "부산 해운대구 우동" --page-size 5')

  console.log(lines.join('\n'))
}
