import { normalizeOptionalString, normalizeRequiredString, trimTrailingSlash } from '@connextable/popbill-utils'

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

  test('normalizeRequiredString trims non-empty strings', () => {
    expect(normalizeRequiredString('  TEST_LINK_ID  ', 'required')).toBe('TEST_LINK_ID')
  })

  test('normalizeRequiredString throws on invalid input', () => {
    expect(() => normalizeRequiredString(undefined, 'required')).toThrow('required')
    expect(() => normalizeRequiredString('   ', 'required')).toThrow('required')
  })
})
