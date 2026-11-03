import { isValidCalendarDate8, isValidDate8, isValidTimeoutMilliseconds } from '@/index'

describe('client timeout validation', () => {
  test.each([1, 180_000, 2_147_483_647])('accepts a positive integer timeout %j', (value) => {
    expect(isValidTimeoutMilliseconds(value)).toBe(true)
  })

  test.each([0, -1, 0.5, 2_147_483_648, Number.NaN, Number.POSITIVE_INFINITY, '1000', null, undefined])(
    'rejects an unsupported timeout without coercing %j',
    (value) => {
      expect(isValidTimeoutMilliseconds(value)).toBe(false)
    }
  )
})

describe('calendar date validation', () => {
  test.each(['20240229', '20000229', '20260101', '20260430', '20261231', '01000101', '09991231', '99991231'])(
    'accepts a valid UTC calendar date %s',
    (value) => {
      expect(isValidCalendarDate8(value)).toBe(true)
    }
  )

  test.each([
    '20260229',
    '19000229',
    '21000229',
    '20260230',
    '20260431',
    '20260001',
    '20261301',
    '20260100',
    '20260132',
    '2026027',
    '2026-02-27',
    ' 20260227',
    '20260227 ',
    '20260227\n',
    '',
  ])('rejects an invalid calendar date or unnormalized format %j', (value) => {
    expect(isValidCalendarDate8(value)).toBe(false)
  })

  test.each(['00000101', '00040229', '00991231'])('preserves the existing Date.UTC rejection for a year below 100: %s', (value) => {
    expect(isValidCalendarDate8(value)).toBe(false)
  })

  test('keeps the existing format-only date helper separate from calendar validation', () => {
    expect(isValidDate8('20260231')).toBe(true)
    expect(isValidCalendarDate8('20260231')).toBe(false)
    expect(isValidDate8('00000101')).toBe(true)
  })
})
