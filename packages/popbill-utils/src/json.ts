/** 직렬화할 루트 값이 없으면 undefined를 반환합니다. */
export function stringifyWithoutEmptyValues(payload: unknown): string | undefined {
  return JSON.stringify(payload, removeEmptyValuesReplacer)
}

function removeEmptyValuesReplacer(_key: string, value: unknown): unknown {
  if (value === null || value === '' || value === undefined) {
    return undefined
  }

  return value
}
