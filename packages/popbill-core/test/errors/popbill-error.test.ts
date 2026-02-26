import {
  POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY,
  createApiResponseError,
  getPopbillErrorCodeDefinitionsByCategory,
  getPopbillErrorCodeDefinition,
  normalizePopbillError,
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
      knownCode: true,
      category: definition?.category,
      canonicalMessage: definition?.message,
      type: PopbillErrorType.ApiResponse,
    })
  })

  test('createApiResponseError uses canonical message when message is blank', () => {
    const code = -11000000
    const definition = getPopbillErrorCodeDefinition(code)

    const apiError = createApiResponseError(code, '   ')

    expect(apiError).toMatchObject({
      code,
      message: definition?.message,
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
      knownCode: false,
      category: undefined,
      canonicalMessage: undefined,
      type: PopbillErrorType.ApiResponse,
    })
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
