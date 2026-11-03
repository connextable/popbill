/** Objects received at JSON boundaries; arrays and null are separate shapes. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** 객체의 최상위 필드 중 undefined만 제거하고 null·빈 문자열·false·0은 유지합니다. */
export function removeUndefinedProperties<T extends object>(source: T): T {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined)) as T
}

/** undefined 필드를 제거한 객체에 필드가 남아 있지 않으면 undefined를 반환합니다. */
export function compactOptionalObject<T extends object>(source: T): T | undefined {
  const compacted = removeUndefinedProperties(source)
  return Object.keys(compacted).length > 0 ? compacted : undefined
}
