import {
  POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY,
  createApiResponseError,
  createNetworkError,
  getPopbillErrorCodeDefinitionsByCategory,
  getPopbillErrorCodeDefinition,
  isKnownPopbillApiError,
  isPopbillApiError,
  matchPopbillErrorByDomain,
  normalizePopbillError,
  PopbillErrorDomain,
  PopbillErrorType,
} from '@/errors'

describe('popbill error catalog integration', () => {
  test('createApiResponseError enriches known code metadata', () => {
    const code = -11000000
    const apiError = createApiResponseError(code, '사용자 지정 메시지')

    const definition = getPopbillErrorCodeDefinition(code)

    expect(definition).toBeDefined()
    expect(apiError).toMatchObject({
      code,
      message: '사용자 지정 메시지',
      domain: PopbillErrorDomain.TaxInvoice,
      userMessage: '[전자세금계산서] (세금)계산서 정보가 존재하지 않습니다.',
      knownCode: true,
      category: definition?.category,
      canonicalMessage: definition?.message,
      type: PopbillErrorType.ApiResponse,
    })

    expect(isPopbillApiError(apiError)).toBe(true)
    expect(isKnownPopbillApiError(apiError)).toBe(true)
  })

  test('createApiResponseError uses canonical message when message is blank', () => {
    const code = -11000000
    const definition = getPopbillErrorCodeDefinition(code)

    const apiError = createApiResponseError(code, '   ')

    expect(apiError).toMatchObject({
      code,
      message: definition?.message,
      domain: PopbillErrorDomain.TaxInvoice,
      canonicalMessage: definition?.message,
      knownCode: true,
    })
  })

  test('normalizePopbillError marks unknown API code as unknown metadata', () => {
    const unknownCode = -19999999
    const apiError = normalizePopbillError({
      status: 400,
      body: {
        code: unknownCode,
        message: '알 수 없는 오류',
      },
    })

    expect(apiError).toMatchObject({
      code: unknownCode,
      message: '알 수 없는 오류',
      userMessage: '[팝빌] 알 수 없는 오류',
      domain: PopbillErrorDomain.Unknown,
      knownCode: false,
      category: undefined,
      canonicalMessage: undefined,
      type: PopbillErrorType.ApiResponse,
    })
  })

  test('createNetworkError standardizes user message', () => {
    const networkError = createNetworkError(new Error('fetch failed'))

    expect(networkError).toMatchObject({
      type: PopbillErrorType.Network,
      domain: PopbillErrorDomain.Unknown,
      userMessage: '네트워크 문제로 팝빌 요청에 실패했어. 잠시 후 다시 시도해줘.',
      knownCode: false,
    })
  })

  test('matchPopbillErrorByDomain routes with typed domain handlers', () => {
    const knownError = createApiResponseError(-11000000, '무시')
    const unknownError = normalizePopbillError({ code: -1, message: 'x' })

    const knownResult = matchPopbillErrorByDomain(knownError, {
      [PopbillErrorDomain.TaxInvoice]: () => 'tax-invoice',
      default: () => 'default',
    })

    const unknownResult = matchPopbillErrorByDomain(unknownError, {
      [PopbillErrorDomain.TaxInvoice]: () => 'tax-invoice',
      default: () => 'default',
    })

    expect(knownResult).toBe('tax-invoice')
    expect(unknownResult).toBe('default')
  })

  test('error definitions are structured by category', () => {
    const totalCount = Object.values(POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY).reduce((sum, count) => sum + count, 0)
    expect(totalCount).toBe(1307)

    for (const category of Object.keys(POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY)) {
      const typedCategory = category as keyof typeof POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY
      const count = POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY[typedCategory]
      const definitions = getPopbillErrorCodeDefinitionsByCategory(typedCategory)
      expect(definitions).toHaveLength(count)
      expect(definitions.every((definition) => definition.category === typedCategory)).toBe(true)
    }

    expect(
      getPopbillErrorCodeDefinitionsByCategory('전자세금계산서').some((definition) => definition.code === -11000000)
    ).toBe(true)
  })
})
