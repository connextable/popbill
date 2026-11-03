import {
  escapeMultipartFileName,
  hmacSha256Base64,
  isBlank,
  isValidDate8,
  normalizeErrorMessage,
  normalizeOptionalString,
  normalizeRequiredString,
  parseSafeInteger,
  sha1Base64,
  sha256Base64,
  stringifyWithoutEmptyValues,
  toBoolean,
  trimTrailingSlash,
} from '@/index'

describe('popbill utils', () => {
  test('string utilities normalize and trim as expected', () => {
    expect(trimTrailingSlash('https://api.example.com///')).toBe('https://api.example.com')
    expect(trimTrailingSlash('https://api.example.com/')).toBe('https://api.example.com')
    expect(trimTrailingSlash('https://api.example.com/path')).toBe('https://api.example.com/path')
    expect(normalizeOptionalString(undefined)).toBeUndefined()
    expect(normalizeOptionalString('')).toBeUndefined()
    expect(normalizeOptionalString('   ')).toBeUndefined()
    expect(normalizeOptionalString('  ko-KR  ')).toBe('ko-KR')
    expect(normalizeOptionalString('en-US')).toBe('en-US')
    expect(normalizeRequiredString('  LINK  ', 'required')).toBe('LINK')
    expect(() => normalizeRequiredString('', 'required')).toThrow('required')
    expect(() => normalizeRequiredString(undefined, 'required')).toThrow('required')
    expect(() => normalizeRequiredString('   ', 'required')).toThrow('required')
  })

  test('json utility removes empty values', () => {
    const serialized = stringifyWithoutEmptyValues({
      keep: 1,
      empty: '',
      nullable: null,
      optional: undefined,
      bool: false,
      zero: 0,
    })
    if (serialized === undefined) throw new Error('Object payload must serialize')
    expect(JSON.parse(serialized)).toEqual({ keep: 1, bool: false, zero: 0 })
    for (const payload of [undefined, null, '']) {
      expect(stringifyWithoutEmptyValues(payload)).toBeUndefined()
    }
  })

  test.each([
    ['attachment.pdf', 'attachment.pdf'],
    ['견적 "최종"\r\n.pdf', '견적 %22최종%22%0D%0A.pdf'],
    ['one\rtwo\n"three"', 'one%0Dtwo%0A%22three%22'],
    ['folder/견적\\최종.pdf', 'folder/견적\\최종.pdf'],
    ['100%20.pdf', '100%20.pdf'],
    ['', ''],
  ])('escapes multipart header delimiters while preserving filename %j', (value, expected) => {
    expect(escapeMultipartFileName(value)).toBe(expected)
  })

  test('validation and cast utilities operate consistently', () => {
    expect(isValidDate8('20260227')).toBe(true)
    expect(isValidDate8('202602')).toBe(false)
    expect(isValidDate8('20261301')).toBe(false)
    expect(isBlank('')).toBe(true)
    expect(isBlank('   ')).toBe(true)
    expect(isBlank([])).toBe(true)
    expect(isBlank({})).toBe(true)
    expect(isBlank(' x ')).toBe(false)
    expect(isBlank([1])).toBe(false)

    expect(toBoolean(true)).toBe(true)
    expect(toBoolean('Y')).toBe(true)
    expect(toBoolean('0')).toBe(false)
  })

  test.each([
    [0, 0],
    ['0', 0],
    ['  -11000000  ', -11000000],
    ['+1', 1],
    ['001', 1],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    [String(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER],
  ])('reads numeric codes without changing safe integer values: %j', (value, expected) => {
    expect(parseSafeInteger(value)).toBe(expected)
  })

  test.each([
    undefined,
    null,
    '',
    '  ',
    true,
    false,
    [],
    {},
    1.5,
    '1.5',
    '1e2',
    '0x10',
    'future-code',
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
    '9007199254740993',
  ])('does not manufacture an integer code from %j', (value) => {
    expect(parseSafeInteger(value)).toBeUndefined()
  })

  test('retains structured error messages without interpreting their codes', () => {
    expect(normalizeErrorMessage({ code: -11000000, message: 'policy blocked' })).toBe('policy blocked')
  })

  test.each([
    Object.create(null) as unknown,
    {
      toString() {
        throw new Error('cannot stringify')
      },
    },
  ])('formats non-stringifiable failures without throwing', (error) => {
    expect(normalizeErrorMessage(error)).toBe('Unknown error')
  })

  test('error and crypto utilities produce deterministic output', () => {
    const error = Object.assign(new Error('network failed'), { code: 'ECONNRESET' })
    expect(normalizeErrorMessage(error)).toBe('ECONNRESET network failed')
    expect(normalizeErrorMessage('plain text')).toBe('plain text')
    expect(normalizeErrorMessage(404)).toBe('404')

    expect(sha1Base64('abc')).toBe('qZk+NkcGgWq6PiVxeFDCbJzQ2J0=')
    expect(sha256Base64('abc')).toBe('ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=')
    expect(hmacSha256Base64('abc', Buffer.from('secret').toString('base64'))).toBe('mUba1OAOkT/Ivo5dP34RCkqegy+D+wnDRShdeGONig4=')
  })
})
