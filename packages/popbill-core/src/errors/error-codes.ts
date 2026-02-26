import rawErrorCodeDefinitions from './error-codes.data.json'

/**
 * Popbill API 오류코드 정의.
 *
 * Source:
 * - /Users/jinyongp/Downloads/팝빌_오류코드_목록.xlsx
 * - ./error-codes.data.json
 */
export const POPBILL_ERROR_CATEGORIES = [
  '계좌조회',
  '공통',
  '기업정보조회',
  '문자',
  '사업자등록상태조회',
  '예금주조회',
  '전자명세서',
  '전자세금계산서',
  '카카오톡',
  '카카오톡/문자',
  '팩스',
  '현금영수증',
  '홈택스수집',
] as const

export type PopbillErrorCategory = (typeof POPBILL_ERROR_CATEGORIES)[number]

export interface PopbillErrorCodeDefinition {
  category: PopbillErrorCategory
  code: number
  message: string
}

interface RawPopbillErrorCodeDefinition {
  category: string
  code: number
  message: string
}

const rawDefinitions = rawErrorCodeDefinitions as readonly RawPopbillErrorCodeDefinition[]
const popbillErrorCategorySet = new Set<string>(POPBILL_ERROR_CATEGORIES)

export const POPBILL_ERROR_CODE_DEFINITIONS: readonly PopbillErrorCodeDefinition[] = rawDefinitions.map((definition) =>
  normalizeErrorCodeDefinition(definition)
)

export const POPBILL_ERROR_CODE_DEFINITIONS_BY_CATEGORY =
  createErrorCodeDefinitionsByCategory(POPBILL_ERROR_CODE_DEFINITIONS)

export const POPBILL_ERROR_CODE_COUNTS_BY_CATEGORY = createErrorCodeCountsByCategory(
  POPBILL_ERROR_CODE_DEFINITIONS_BY_CATEGORY
)

/**
 * 오류코드로 단건 조회하기 위한 맵입니다.
 */
export const POPBILL_ERROR_CODE_MAP = new Map<number, PopbillErrorCodeDefinition>(
  POPBILL_ERROR_CODE_DEFINITIONS.map((definition) => [definition.code, definition])
)

export function getPopbillErrorCodeDefinition(code: number): PopbillErrorCodeDefinition | undefined {
  return POPBILL_ERROR_CODE_MAP.get(code)
}

export function getPopbillErrorCodeDefinitionsByCategory(
  category: PopbillErrorCategory
): readonly PopbillErrorCodeDefinition[] {
  return POPBILL_ERROR_CODE_DEFINITIONS_BY_CATEGORY[category]
}

export function isKnownPopbillErrorCode(code: number): boolean {
  return POPBILL_ERROR_CODE_MAP.has(code)
}

function normalizeErrorCodeDefinition(definition: RawPopbillErrorCodeDefinition): PopbillErrorCodeDefinition {
  if (!popbillErrorCategorySet.has(definition.category)) {
    throw new Error(`Unknown Popbill error category: ${definition.category}`)
  }

  return {
    category: definition.category as PopbillErrorCategory,
    code: definition.code,
    message: definition.message,
  }
}

function createErrorCodeDefinitionsByCategory(
  definitions: readonly PopbillErrorCodeDefinition[]
): Readonly<Record<PopbillErrorCategory, readonly PopbillErrorCodeDefinition[]>> {
  const grouped = createEmptyCategoryRecord(() => [] as PopbillErrorCodeDefinition[])

  for (const definition of definitions) {
    grouped[definition.category].push(definition)
  }

  return grouped
}

function createErrorCodeCountsByCategory(
  definitionsByCategory: Readonly<Record<PopbillErrorCategory, readonly PopbillErrorCodeDefinition[]>>
): Readonly<Record<PopbillErrorCategory, number>> {
  return createEmptyCategoryRecord((category) => definitionsByCategory[category].length)
}

function createEmptyCategoryRecord<T>(
  initializer: (category: PopbillErrorCategory) => T
): Record<PopbillErrorCategory, T> {
  const record = {} as Record<PopbillErrorCategory, T>

  for (const category of POPBILL_ERROR_CATEGORIES) {
    record[category] = initializer(category)
  }

  return record
}
