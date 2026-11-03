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

  test.each([-11000000, -19999999])('normalizes numeric string API codes while retaining the original body: %i', (code) => {
    const body = { code: ` ${String(code)} `, message: '원본 오류', futureDetail: 'retained' }
    const apiError = normalizePopbillError({ status: 400, body })

    expect(apiError).toMatchObject({ code, message: '원본 오류', status: 400, type: PopbillErrorType.ApiResponse })
    expect(apiError.knownCode).toBe(getPopbillErrorCodeDefinition(code) !== undefined)
    expect(apiError.raw).toBe(body)

    const directError = normalizePopbillError(body)
    expect(directError).toMatchObject({ code, message: '원본 오류' })
    expect(directError.raw).toBe(body)
  })

  test.each(['future-code', '', null, false, '1.5', '9007199254740993'])('retains unsupported API codes in the raw HTTP error: %j', (code) => {
    const body = { code, message: '원본 오류' }
    const apiError = normalizePopbillError({ status: 400, body })

    expect(apiError.type).toBe(PopbillErrorType.Http)
    expect(apiError.raw).toBe(body)
  })

  test.each([-11000000.5, Number.MAX_SAFE_INTEGER + 1])(
    'preserves previously accepted numeric error codes without imposing an integer constraint: %j',
    (code) => {
      const body = { code, message: '원본 숫자 오류' }
      const apiError = normalizePopbillError({ status: 400, body })

      expect(apiError).toMatchObject({ code, message: body.message, type: PopbillErrorType.ApiResponse })
      expect(apiError.raw).toBe(body)
      expect(normalizePopbillError(body)).toMatchObject({ code, message: body.message })
    }
  )

  test('createNetworkError standardizes user message', () => {
    const networkError = createNetworkError(new Error('fetch failed'))

    expect(networkError).toMatchObject({
      type: PopbillErrorType.Network,
      domain: PopbillErrorDomain.Unknown,
      userMessage: '네트워크 문제로 팝빌 응답을 확인하지 못했어. 재요청 전에 처리 결과를 확인해줘.',
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

  test.each(['AbortError', 'TimeoutError'])('preserves native %s exceptions instead of treating their numeric codes as API codes', (name) => {
    const original = new DOMException('native exception', name)
    const error = normalizePopbillError(original, { stage: 'request_api' })
    expect(error).toMatchObject({ type: PopbillErrorType.Unknown, code: -99999999, retriable: false, stage: 'request_api' })
    expect(error.raw).toBe(original)
    expect(normalizePopbillError(error).raw).toBe(original)
  })

  test('does not classify local argument errors with string codes as network failures', () => {
    const original = Object.assign(new TypeError('invalid argument'), { code: 'ERR_INVALID_ARG_TYPE' })
    expect(normalizePopbillError(original)).toMatchObject({ type: PopbillErrorType.Unknown, retriable: false, raw: original })
  })

  test('error definitions are structured by category', () => {
    for (const category of Object.keys(POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY)) {
      const typedCategory = category as keyof typeof POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY
      const count = POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY[typedCategory]
      const definitions = getPopbillErrorCodeDefinitionsByCategory(typedCategory)
      expect(definitions).toHaveLength(count)
      expect(definitions.every((definition) => definition.category === typedCategory)).toBe(true)
    }

    expect(getPopbillErrorCodeDefinitionsByCategory('전자세금계산서').some((definition) => definition.code === -11000000)).toBe(true)
  })
})
