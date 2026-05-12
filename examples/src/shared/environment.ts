export function readEnvironmentString(name: string, fallbackValue: string): string {
  const value = process.env[name]
  if (typeof value !== 'string') {
    return fallbackValue
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : fallbackValue
}

export function parseBooleanValue(value: string, fallbackValue: boolean): boolean {
  const normalizedValue = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'y', 'on'].includes(normalizedValue)) {
    return true
  }

  if (['0', 'false', 'no', 'n', 'off'].includes(normalizedValue)) {
    return false
  }

  return fallbackValue
}

export function parsePositiveIntegerValue(value: string, fallbackValue: number): number {
  const parsedValue = Number.parseInt(value, 10)
  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue
  }

  return fallbackValue
}
