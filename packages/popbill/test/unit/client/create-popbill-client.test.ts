import * as sdk from '@/index'

describe('createPopbillClient', () => {
  test('exposes only facade-oriented public API', () => {
    expect(typeof sdk.createPopbillClient).toBe('function')
    expect('createLinkhubClient' in sdk).toBe(false)
    expect('TokenBuilder' in sdk).toBe(false)
  })

  test('creates taxInvoice getInvoiceInfo service', () => {
    const client = sdk.createPopbillClient({
      linkId: 'TEST_LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      userId: 'test-user',
      isTest: true,
    })

    expect(typeof client.services.taxInvoice.getInvoiceInfo).toBe('function')
  })

  test('throws when userId is missing', () => {
    expect(() =>
      sdk.createPopbillClient({
        linkId: 'TEST_LINK_ID',
        secretKey: Buffer.from('secret').toString('base64'),
        userId: '',
      })
    ).toThrow('userId는 필수입니다.')
  })

  test('throws when requestTimeoutMs is not positive integer', () => {
    expect(() =>
      sdk.createPopbillClient({
        linkId: 'TEST_LINK_ID',
        secretKey: Buffer.from('secret').toString('base64'),
        userId: 'test-user',
        requestTimeoutMs: 0,
      })
    ).toThrow('requestTimeoutMs는 1 이상의 정수여야 합니다.')

    expect(() =>
      sdk.createPopbillClient({
        linkId: 'TEST_LINK_ID',
        secretKey: Buffer.from('secret').toString('base64'),
        userId: 'test-user',
        requestTimeoutMs: 10.5,
      })
    ).toThrow('requestTimeoutMs는 1 이상의 정수여야 합니다.')
  })
})
