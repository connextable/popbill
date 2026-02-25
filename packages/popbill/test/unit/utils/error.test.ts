import { normalizeErrorMessage } from '@connextable/popbill-core'

describe('error utils', () => {
  test('normalizeErrorMessage returns error code and message for Error instances', () => {
    const error = Object.assign(new Error('network failed'), { code: 'ECONNRESET' })
    expect(normalizeErrorMessage(error)).toBe('ECONNRESET network failed')
  })

  test('normalizeErrorMessage stringifies non-Error values', () => {
    expect(normalizeErrorMessage('plain text')).toBe('plain text')
    expect(normalizeErrorMessage(404)).toBe('404')
  })
})
