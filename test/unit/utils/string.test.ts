import { normalizeOptionalString, trimTrailingSlash } from '@/utils/string'

describe('string utils', () => {
  test('trimTrailingSlash removes trailing slashes only', () => {
    expect(trimTrailingSlash('https://api.example.com/')).toBe('https://api.example.com')
    expect(trimTrailingSlash('https://api.example.com///')).toBe('https://api.example.com')
    expect(trimTrailingSlash('https://api.example.com/path')).toBe('https://api.example.com/path')
  })

  test('normalizeOptionalString returns undefined for blank strings', () => {
    expect(normalizeOptionalString(undefined)).toBeUndefined()
    expect(normalizeOptionalString('')).toBeUndefined()
    expect(normalizeOptionalString('   ')).toBeUndefined()
  })

  test('normalizeOptionalString trims non-empty strings', () => {
    expect(normalizeOptionalString('en-US')).toBe('en-US')
    expect(normalizeOptionalString('  en-US  ')).toBe('en-US')
  })
})
