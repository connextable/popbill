import { createJusoLinkClient } from '@/client'

describe('createJusoLinkClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each(['auth', 'api', 'body'])('전송 실패 값의 모양으로 %s 단계나 원격 오류 코드를 추측하지 않는다', async (phase) => {
    const original = {
      message: 'local policy failed',
      status: 403,
      body: { code: -20010004, message: 'fake API error' },
      requestStage: 'issue_token',
      cause: 'original detail',
    }
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (target) => {
      if (phase !== 'auth' && resolveRequestUrl(target).endsWith('/Token')) return createTokenResponse()
      if (phase === 'body')
        return new Response(
          new ReadableStream({
            start(controller) {
              controller.error(original)
            },
          })
        )
      throw original
    })
    const client = createJusoLinkClient({ linkId: 'LINK', secretKey: Buffer.from('secret').toString('base64'), accessId: 'ACCESS' })
    const error: unknown = await client.services.juso.searchAddresses({ searchKeyword: '삼성동' }).catch((failure: unknown) => failure)
    expect(error).toMatchObject({ code: -99999999, message: original.message, requestStage: phase === 'auth' ? 'issue_token' : 'request_api' })
    expect((error as { cause: unknown }).cause).toBe(original)
    expect((error as { httpStatusCode?: number }).httpStatusCode).toBeUndefined()
  })

  test('본문 읽기 실패의 원본 예외와 API 단계를 보존한다', async () => {
    const original = new TypeError('terminated', { cause: Object.assign(new Error('socket closed'), { code: 'UND_ERR_SOCKET' }) })
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (target) => {
      if (resolveRequestUrl(target).endsWith('/Token')) return createTokenResponse()
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.error(original)
          },
        })
      )
    })
    const client = createJusoLinkClient({ linkId: 'LINK', secretKey: Buffer.from('secret').toString('base64'), accessId: 'ACCESS' })
    const error: unknown = await client.services.juso.searchAddresses({ searchKeyword: '삼성동' }).catch((failure: unknown) => failure)
    expect(error).toMatchObject({ requestStage: 'request_api' })
    expect((error as { cause: unknown }).cause).toBe(original)
  })

  test('요청 제한시간은 Node 타이머가 지원하는 정수 범위만 허용한다', () => {
    const config = {
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    }

    expect(() => createJusoLinkClient({ ...config, requestTimeoutMilliseconds: 2_147_483_647 })).not.toThrow()
    expect(() => createJusoLinkClient({ ...config, requestTimeoutMilliseconds: 2_147_483_648 })).toThrow('2147483647')
  })

  test('주소검색 요청 시 Bearer 토큰과 쿼리 파라미터를 올바르게 전송하고 응답을 래핑한다', async () => {
    let searchRequestUrl: URL | undefined
    let searchHeaders: Headers | undefined
    let tokenRequestBody: unknown

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput, requestInit) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        tokenRequestBody = JSON.parse(requestInit?.body as string) as unknown
        return createTokenResponse()
      }

      if (requestUrl.startsWith('https://juso.linkhub.co.kr/Search')) {
        searchRequestUrl = new URL(requestUrl)
        searchHeaders = new Headers(requestInit?.headers)

        return new Response(
          JSON.stringify({
            searches: '삼성동',
            deletedWord: ['동'],
            suggest: '삼성',
            sidoCount: {
              SEOUL: 2,
            },
            page: 1,
            listSize: 2,
            totalPage: 1,
            numFound: 2,
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
    expect(searchHeaders?.get('Authorization')).toBe('Bearer SESSION_TOKEN')
    expect(searchHeaders?.get('x-api-version')).toBe('1.0')
    expect(tokenRequestBody).toEqual({ scope: ['200'] })

    expect(searchRequestUrl?.searchParams.get('Searches')).toBe('삼성동')
    expect(searchRequestUrl?.searchParams.get('PageNum')).toBe('1')
    expect(searchRequestUrl?.searchParams.get('PerPage')).toBe('20')
    expect(searchRequestUrl?.searchParams.get('noDifferential')).toBe('true')
    expect(searchRequestUrl?.searchParams.get('noSuggest')).toBe('false')

    expect(result).toEqual({
      searchKeyword: '삼성동',
      excludedKeywords: ['동'],
      suggestedKeyword: '삼성',
      provinceResultCountMap: {
        SEOUL: 2,
      },
      pageNumber: 1,
      pageResultCount: 2,
      totalPageCount: 1,
      totalResultCount: 2,
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

  test.each(['normal', 'sync-throw', 'async-reject'] as const)('원격 API 에러를 훅 실패와 무관하게 보존한다 (%s)', async (hookBehavior) => {
    const hookError = new Error('onError hook failed')
    let hookCalls = 0
    const onError = (_error: unknown) => {
      hookCalls += 1
      if (hookBehavior === 'sync-throw') throw hookError
      if (hookBehavior === 'async-reject') return Promise.reject(hookError)
      return undefined
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        return createTokenResponse()
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

    expect(hookCalls).toBe(1)
    await new Promise<void>((resolve) => setImmediate(resolve))
  })

  test.each([
    [' -20010004 ', -20010004],
    [-20010004.5, -20010004.5],
    [Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER + 1],
  ])('원격 오류 코드의 문자열 변형과 기존 숫자를 보존한다 (%j)', async (code, expectedCode) => {
    const body = { code, message: '검색어가 입력되지 않았습니다.', futureDetail: 'retained' }
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      if (resolveRequestUrl(requestInput) === 'https://auth.linkhub.co.kr/JUSOLINK/Token') return createTokenResponse()
      return Response.json(body, { status: 400 })
    })
    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    })

    await expect(client.services.juso.searchAddresses({ searchKeyword: '유효검색어' })).rejects.toMatchObject({
      code: expectedCode,
      message: body.message,
      httpStatusCode: 400,
      cause: { body },
    })
  })

  test('알려지지 않은 시도 코드도 원본 키로 보존한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      if (resolveRequestUrl(requestInput) === 'https://auth.linkhub.co.kr/JUSOLINK/Token') return createTokenResponse()

      return new Response(
        '{"searches":"삼성동","sidoCount":{"SEOUL":2,"NEW_PROVINCE":3,"__proto__":4},"numFound":5,"listSize":0,"totalPage":1,"page":1}',
        { status: 200 }
      )
    })

    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    })
    const result = await client.services.juso.searchAddresses({ searchKeyword: '삼성동' })

    expect(result.provinceResultCountMap).toEqual(JSON.parse('{"SEOUL":2,"NEW_PROVINCE":3,"__proto__":4}'))
    expect(Object.hasOwn(result.provinceResultCountMap, '__proto__')).toBe(true)
    expect(Object.getPrototypeOf(result.provinceResultCountMap)).toBe(Object.prototype)
    expect(result.addresses).toEqual([])
  })

  test('페이지 크기 정책은 서버에 위임하고 양의 정수 형식만 검사한다', async () => {
    let requestedPageSize: string | null = null
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      const requestUrl = resolveRequestUrl(requestInput)
      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') return createTokenResponse()

      requestedPageSize = new URL(requestUrl).searchParams.get('PerPage')
      return Response.json({ searches: '삼성동', page: 1, listSize: 0, totalPage: 0, numFound: 0 })
    })
    const client = createJusoLinkClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('SECRET').toString('base64'),
      accessId: 'ACCESS_IDENTIFIER',
    })

    await client.services.juso.searchAddresses({ searchKeyword: '삼성동', pageSize: 101 })
    expect(requestedPageSize).toBe('101')
    const requestCount = fetchSpy.mock.calls.length
    await expect(client.services.juso.searchAddresses({ searchKeyword: '삼성동', pageSize: 0 })).rejects.toMatchObject({
      message: 'pageSize는 1 이상의 정수여야 합니다.',
    })
    expect(fetchSpy).toHaveBeenCalledTimes(requestCount)
  })

  test('동일 클라이언트에서 연속 호출 시 토큰 발급을 재사용한다', async () => {
    let tokenIssueCount = 0

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (requestInput) => {
      const requestUrl = resolveRequestUrl(requestInput)

      if (requestUrl === 'https://auth.linkhub.co.kr/JUSOLINK/Token') {
        tokenIssueCount += 1

        return createTokenResponse()
      }

      return new Response(
        JSON.stringify({
          searches: '삼성동',
          page: 1,
          listSize: 0,
          totalPage: 0,
          numFound: 0,
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

function createTokenResponse(): Response {
  return Response.json({
    session_token: 'SESSION_TOKEN',
    serviceID: 'JUSOLINK',
    linkID: 'TEST_LINK_ID',
    userID: 'ACCESS_IDENTIFIER',
    partnerCode: 'PARTNER',
    usercode: 'USER_CODE',
    scope: ['200'],
    ipaddress: '127.0.0.1',
    expiration: '2999-12-31T00:00:00Z',
  })
}

function resolveRequestUrl(requestInput: Request | URL | string): string {
  if (typeof requestInput === 'string') {
    return requestInput
  }

  if (requestInput instanceof URL) {
    return requestInput.toString()
  }

  return requestInput.url
}
