import { optionalResponseNumber, preserveBooleanResponse, preserveNumericCode, toBoolean } from '@/index'

describe('provider response casts', () => {
  test.each([
    ['  -11000000  ', -11000000],
    ['+1', 1],
    ['001', 1],
    ['0', 0],
  ])('normalizes safe decimal code %j to %j', (value, expected) => {
    expect(preserveNumericCode(value)).toBe(expected)
  })

  test('keeps unknown, nullable, blank and unsafe codes without manufacturing a code', () => {
    const values = [undefined, null, '', '  ', 'future-code', '1.5', '1e2', '0x10', '9007199254740993', 0.5, Number.NaN]
    for (const value of values) {
      expect(preserveNumericCode(value)).toBe(value)
    }
  })

  test.each([
    [true, true],
    [false, false],
    [1, true],
    [0, false],
    [' TRUE ', true],
    ['false', false],
    ['y', true],
    [' N ', false],
    ['1', true],
    ['0', false],
  ])('normalizes known flag %j to %j', (value, expected) => {
    expect(preserveBooleanResponse(value)).toBe(expected)
  })

  test('keeps unavailable and future flags instead of changing them to false', () => {
    for (const value of [undefined, null, '', '  ', 'future-flag', '2', 2, Number.NaN]) {
      expect(preserveBooleanResponse(value)).toBe(value)
    }
    expect(toBoolean(2)).toBe(true)
    expect(toBoolean('future-flag')).toBe(false)
  })

  test('accepts finite numeric counts including zero and numeric strings', () => {
    expect(optionalResponseNumber(0)).toBe(0)
    expect(optionalResponseNumber('0')).toBe(0)
    expect(optionalResponseNumber(' 1.5 ')).toBe(1.5)
    expect(optionalResponseNumber(42)).toBe(42)
  })

  test('omits unavailable counts without coercing them to zero', () => {
    for (const value of [undefined, null, '', '  ', true, false, [], {}, 'future-count', Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(optionalResponseNumber(value)).toBeUndefined()
    }
  })
})
