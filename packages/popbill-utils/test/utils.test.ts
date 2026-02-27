import {
  hmacSha256Base64,
  isBlank,
  isValidDate8,
  normalizeErrorMessage,
  normalizeOptionalString,
  normalizeRequiredString,
  sha1Base64,
  sha256Base64,
  stringifyWithoutEmptyValues,
  toBoolean,
  trimTrailingSlash,
} from '@/index'

describe('popbill utils', () => {
  test('string utilities normalize and trim as expected', () => {
    expect(trimTrailingSlash('https://api.example.com///')).toBe('https://api.example.com')
    expect(normalizeOptionalString('   ')).toBeUndefined()
    expect(normalizeOptionalString('  ko-KR  ')).toBe('ko-KR')
    expect(normalizeRequiredString('  LINK  ', 'required')).toBe('LINK')
    expect(() => normalizeRequiredString('', 'required')).toThrow('required')
  })

  test('json utility removes empty values', () => {
    expect(
      stringifyWithoutEmptyValues({
        keep: 1,
        empty: '',
        nullable: null,
        optional: undefined,
        bool: false,
      })
    ).toBe('{"keep":1,"bool":false}')
  })

  test('validation and cast utilities operate consistently', () => {
    expect(isValidDate8('20260227')).toBe(true)
    expect(isValidDate8('202602')).toBe(false)
    expect(isBlank({})).toBe(true)
    expect(isBlank(' x ')).toBe(false)

    expect(toBoolean(true)).toBe(true)
    expect(toBoolean('Y')).toBe(true)
    expect(toBoolean('0')).toBe(false)
  })

  test('error and crypto utilities produce deterministic output', () => {
    const error = Object.assign(new Error('network failed'), { code: 'ECONNRESET' })
    expect(normalizeErrorMessage(error)).toBe('ECONNRESET network failed')

    expect(sha1Base64('abc')).toBe('qZk+NkcGgWq6PiVxeFDCbJzQ2J0=')
    expect(sha256Base64('abc')).toBe('ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=')
    expect(hmacSha256Base64('abc', Buffer.from('secret').toString('base64'))).toBe(
      'mUba1OAOkT/Ivo5dP34RCkqegy+D+wnDRShdeGONig4='
    )
  })
})
