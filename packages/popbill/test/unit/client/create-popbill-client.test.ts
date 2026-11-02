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

  test('rejects timeouts outside the timer range while accepting its upper bound', () => {
    const config = { linkId: 'TEST_LINK_ID', secretKey: Buffer.from('secret').toString('base64'), userId: 'test-user' }
    for (const requestTimeoutMs of [0, 10.5, 2_147_483_648]) {
      expect(() => sdk.createPopbillClient({ ...config, requestTimeoutMs })).toThrow('requestTimeoutMs')
    }
    expect(() => sdk.createPopbillClient({ ...config, requestTimeoutMs: 2_147_483_647 })).not.toThrow()
  })
})
