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
      isTest: true,
    })

    expect(typeof client.services.taxInvoice.getInvoiceInfo).toBe('function')
  })
})
