import { createJusoLinkClient } from '@/client'

describe('createJusoLinkClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('주소검색 요청 시 Bearer 토큰과 쿼리 파라미터를 올바르게 전송하고 응답을 래핑한다', async () => {
    let searchAuthorizationHeader: string | undefined

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput, requestInit) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        return new Response(
          JSON.stringify({
            session_token: 'SESSION_TOKEN',
            serviceID: 'JUSOLINK',
            linkID: 'TEST_LINK_ID',
            userID: 'ACCESS_IDENTIFIER',
            partnerCode: 'PARTNER',
            usercode: 'USER_CODE',
            scope: ['member'],
            ipaddress: '127.0.0.1',
            expiration: '2999-12-31T00:00:00Z',
          }),
          { status: 200 }
        )
      }

      if (requestUrl.startsWith('https://jusolink.linkhub.co.kr/Search')) {
        const headers = requestInit?.headers as Record<string, string>
        searchAuthorizationHeader = headers['Authorization']

        return new Response(
          JSON.stringify({
            searches: '삼성동',
            deletedWord: ['동'],
            suggest: '삼성',
            sidoCount: {
              SEOUL: 2,
            },
            numFound: 2,
            listSize: 2,
            totalPage: 1,
            page: 1,
            juso: [
              {
                roadAddr1: '서울특별시 강남구 영동대로 517',
                roadAddr2: '(삼성동)',
                jibunAddr: '서울특별시 강남구 삼성동 159',
                zipcode: '135798',
                sectionNum: '06164',
                detailBuildingName: ['아셈타워'],
                relatedJibun: ['159'],
                dongCode: '1168010500',
                streetCode: '116803122007',
              },
            ],
          }),
          { status: 200 }
        )
      }

      throw new Error(`예상하지 못한 요청 URL: ${requestUrl}`)
    })

    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    })

    const result = await client.services.juso.searchAddresses({
      searchKeyword: '삼성동',
      pageNumber: 1,
      pageSize: 20,
      disableDifferentialSearch: true,
      disableSuggestion: false,
    })

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(searchAuthorizationHeader).toBe('Bearer SESSION_TOKEN')

    const searchCall = fetchSpy.mock.calls.find((call) => {
      const requestUrl = resolveRequestUrl(call[0])
      return requestUrl.startsWith('https://jusolink.linkhub.co.kr/Search')
    })

    const requestInput = searchCall?.[0]
    const searchRequestUrl = requestInput ? resolveRequestUrl(requestInput) : ''
    const parsedSearchRequestUrl = new URL(searchRequestUrl ?? '')

    expect(parsedSearchRequestUrl.searchParams.get('Searches')).toBe('삼성동')
    expect(parsedSearchRequestUrl.searchParams.get('PageNum')).toBe('1')
    expect(parsedSearchRequestUrl.searchParams.get('PerPage')).toBe('20')
    expect(parsedSearchRequestUrl.searchParams.get('noDifferential')).toBe('true')
    expect(parsedSearchRequestUrl.searchParams.get('noSuggest')).toBe('false')

    expect(result).toEqual({
      searchKeyword: '삼성동',
      excludedKeywords: ['동'],
      suggestedKeyword: '삼성',
      provinceResultCountMap: {
        SEOUL: 2,
      },
      totalResultCount: 2,
      pageResultCount: 2,
      totalPageCount: 1,
      pageNumber: 1,
      addresses: [
        {
          roadNameAddress: '서울특별시 강남구 영동대로 517',
          roadNameAddressAdditionalInfo: '(삼성동)',
          lotNumberAddress: '서울특별시 강남구 삼성동 159',
          oldPostalCode: '135798',
          newPostalCode: '06164',
          detailedBuildingNames: ['아셈타워'],
          relatedLotNumbers: ['159'],
          legalDistrictCode: '1168010500',
          roadNameCode: '116803122007',
        },
      ],
    })
  })

  test('원격 API 에러를 JusoApiError로 정규화한다', async () => {
    const onError = vi.fn<(error: unknown) => void>()

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        return new Response(
          JSON.stringify({
            session_token: 'SESSION_TOKEN',
            serviceID: 'JUSOLINK',
            linkID: 'TEST_LINK_ID',
            userID: 'ACCESS_IDENTIFIER',
            partnerCode: 'PARTNER',
            usercode: 'USER_CODE',
            scope: ['member'],
            ipaddress: '127.0.0.1',
            expiration: '2999-12-31T00:00:00Z',
          }),
          { status: 200 }
        )
      }

      return new Response(
        JSON.stringify({
          code: -20010004,
          message: '검색어가 입력되지 않았습니다.',
        }),
        {
          status: 400,
        }
      )
    })

    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
      onError,
    })

    await expect(
      client.services.juso.searchAddresses({
        searchKeyword: '유효검색어',
      })
    ).rejects.toMatchObject({
      code: -20010004,
      message: '검색어가 입력되지 않았습니다.',
      httpStatusCode: 400,
      operationName: 'juso.searchAddresses',
      requestStage: 'request_api',
    })

    expect(onError).toHaveBeenCalledTimes(1)
  })

  test('동일 클라이언트에서 연속 호출 시 토큰 발급을 재사용한다', async () => {
    let tokenIssueCount = 0

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        tokenIssueCount += 1

        return new Response(
          JSON.stringify({
            session_token: 'SESSION_TOKEN',
            serviceID: 'JUSOLINK',
            linkID: 'TEST_LINK_ID',
            userID: 'ACCESS_IDENTIFIER',
            partnerCode: 'PARTNER',
            usercode: 'USER_CODE',
            scope: ['member'],
            ipaddress: '127.0.0.1',
            expiration: '2999-12-31T00:00:00Z',
          }),
          { status: 200 }
        )
      }

      return new Response(
        JSON.stringify({
          searches: '삼성동',
          numFound: 0,
          listSize: 0,
          totalPage: 0,
          page: 1,
          juso: [],
        }),
        { status: 200 }
      )
    })

    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    })

    await client.services.juso.searchAddresses({ searchKeyword: '삼성동' })
    await client.services.juso.searchAddresses({ searchKeyword: '강남구' })

    expect(tokenIssueCount).toBe(1)
  })
})

function resolveRequestUrl(requestInput: Request | URL | string): string {
  if (typeof requestInput === 'string') {
    return requestInput
  }

  if (requestInput instanceof URL) {
    return requestInput.toString()
  }

  return requestInput.url
}
