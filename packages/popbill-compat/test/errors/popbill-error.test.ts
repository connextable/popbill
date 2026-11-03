import { createRequire } from 'node:module'
import { createCommonPromiseService } from '@/factory'
import {
  POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY,
  createApiResponseError,
  createNetworkError,
  createUnknownError,
  createInputValidationError,
  getPopbillErrorCodeDefinitionsByCategory,
  getPopbillErrorCodeDefinition,
  isKnownPopbillApiError,
  isPopbillApiError,
  matchPopbillErrorByDomain,
  normalizePopbillError,
  PopbillErrorDomain,
  PopbillErrorType,
} from '@/errors'
import { RequestAbortError } from '@connextable/popbill-runtime'

describe('popbill error catalog integration', () => {
  test('retains SDK input validation across CJS and ESM entry points', async () => {
    const require = createRequire(import.meta.url)
    const cjsFactory = require('@connextable/popbill-compat/factory') as { createCommonPromiseService: typeof createCommonPromiseService }
    const cjsErrors = require('@connextable/popbill-compat/errors') as { normalizePopbillError: typeof normalizePopbillError }
    const fetch = vi.fn<typeof globalThis.fetch>()
    const config = { LinkID: 'LINK', SecretKey: Buffer.from('secret').toString('base64'), fetch }
    const cjsFailure: unknown = await cjsFactory
      .createCommonPromiseService(config)
      .getCorpInfo('')
      .catch((error: unknown) => error)
    const esmFailure: unknown = await createCommonPromiseService(config)
      .getCorpInfo('')
      .catch((error: unknown) => error)
    expect(normalizePopbillError(cjsFailure)).toMatchObject({ type: 'input_validation', stage: 'validate_input' })
    expect(cjsErrors.normalizePopbillError(esmFailure)).toMatchObject({ type: 'input_validation', stage: 'validate_input' })
    expect(fetch).not.toHaveBeenCalled()
  })

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

  test('uses explicit error type before the legacy generic code when inferring stage', () => {
    for (const type of ['unknown', 'network', 'timeout', 'api_response'] as const) {
      expect(normalizePopbillError({ code: -99999999, message: 'failure', type })).toMatchObject({ type, stage: 'unknown' })
    }
    expect(normalizePopbillError({ code: -99999999, message: 'legacy validation' })).toMatchObject({
      type: 'input_validation',
      stage: 'validate_input',
    })
    expect(normalizePopbillError({ code: -1, message: 'explicit validation', type: 'input_validation' })).toMatchObject({ stage: 'validate_input' })
  })

  test.each([undefined, 'unknown', 'issue_token', 'request_api'] as const)(
    'keeps unknown errors distinct from input validation at stage %s',
    (stage) => {
      const context = { stage }
      const original = new Error('response mapping failed')
      expect(createUnknownError(original, context)).toMatchObject({ type: 'unknown', stage: stage ?? 'unknown', raw: original })
      expect(createInputValidationError('invalid input', context)).toMatchObject({ type: 'input_validation', stage: stage ?? 'validate_input' })
      expect(createApiResponseError(-99999999, 'remote error', context)).toMatchObject({ type: 'api_response', stage: stage ?? 'unknown' })
    }
  )

  test.each([undefined, 'unknown', 'issue_token', 'request_api'] as const)(
    'preserves cancellation metadata through repeated normalization at stage %s',
    (stage) => {
      for (const source of ['signal', 'request_timeout'] as const) {
        const reason = { code: -11000000, message: 'cancelled' }
        const first = normalizePopbillError(new RequestAbortError({ source, reason }), { stage })
        const second = normalizePopbillError(Object.assign(new Error(first.message), first), { operation: 'outer' })
        expect(second).toMatchObject({ stage: stage ?? 'unknown', type: source === 'signal' ? 'unknown' : 'timeout', retriable: false })
        expect(second.raw).toBe(reason)
        expect(second.abort).toBe(first.abort)
      }
    }
  )

  test.each([
    new TypeError('transport.fetch is not a function'),
    Object.assign(new TypeError('invalid fetch configuration'), { code: 'ERR_INVALID_ARG_TYPE' }),
    Object.assign(new TypeError('fetch failed'), { code: 403 }),
    new TypeError('fetch failed', { cause: Object.assign(new TypeError('invalid URL'), { code: 'ERR_INVALID_URL' }) }),
    new SyntaxError('fetch failed'),
  ])('does not classify local errors as network failures: %s', (original) => {
    expect(normalizePopbillError(original)).toMatchObject({ type: PopbillErrorType.Unknown, stage: 'unknown', retriable: false, raw: original })
  })

  test('does not classify an invalid native header containing fetch as a network failure', () => {
    let original: unknown
    try {
      new Headers({ 'Accept-Language': 'fetch\nko-KR' })
    } catch (error) {
      original = error
    }
    expect(original).toBeInstanceOf(TypeError)
    expect(normalizePopbillError(original)).toMatchObject({ type: 'unknown', stage: 'unknown', retriable: false, raw: original })
  })

  test.each([
    new TypeError('fetch failed'),
    new TypeError('fetch failed', { cause: Object.assign(new Error('socket closed'), { code: 'UND_ERR_SOCKET' }) }),
    Object.assign(new Error('connection refused'), { code: 'ECONNREFUSED' }),
  ])('retains supported native network failures: %s', (original) => {
    expect(normalizePopbillError(original, { stage: 'request_api' })).toMatchObject({ type: 'network', stage: 'request_api', raw: original })
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
