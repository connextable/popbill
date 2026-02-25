import { isBlank, isValidDate8 } from '@connextable/popbill-core'

describe('validation utils', () => {
  test('validates yyyyMMdd date format', () => {
    expect(isValidDate8('20260224')).toBe(true)
    expect(isValidDate8('202602')).toBe(false)
    expect(isValidDate8('20261301')).toBe(false)
  })

  test('detects blank values', () => {
    expect(isBlank('')).toBe(true)
    expect(isBlank('   ')).toBe(true)
    expect(isBlank([])).toBe(true)
    expect(isBlank({})).toBe(true)
    expect(isBlank('A')).toBe(false)
    expect(isBlank([1])).toBe(false)
  })
})
