export function stringifyWithoutEmptyValues(payload: unknown): string {
  return JSON.stringify(payload, removeEmptyValuesReplacer)
}

function removeEmptyValuesReplacer(_key: string, value: unknown): unknown {
  if (value === null || value === '' || value === undefined) {
    return undefined
  }

  return value
}
