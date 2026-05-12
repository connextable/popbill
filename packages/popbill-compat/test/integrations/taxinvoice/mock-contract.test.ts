import * as promiseCompat from '@/promise/index'
import { TaxinvoiceBoxScopes, TaxinvoiceDocumentKeyTypes } from '@/services/taxinvoice/types'
import { createManagementKey, createTaxInvoiceDocument, expectApiSuccess, formatDate } from './method-testkit'
import { installTaxinvoiceMockFetch } from './mock-fetch'

const MOCK_CORP_NUM = '1234567890'
const MOCK_COUNTERPART_CORP_NUM = '8888888888'
const MOCK_USER_ID = 'mock-user'
const MOCK_RECEIVER_EMAIL = 'test@example.com'

describe('taxinvoice compat mock contract', () => {
  beforeEach(() => {
    installTaxinvoiceMockFetch()
    promiseCompat.config({
      LinkID: 'MOCK_LINK_ID',
      SecretKey: Buffer.from('mock-secret').toString('base64'),
      IsTest: true,
      UseLocalTimeYN: true,
      requestTimeoutMs: 30_000,
      acceptEncoding: 'gzip',
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('exercises representative lifecycle calls without Popbill API credentials', async () => {
    const service = promiseCompat.TaxinvoiceService()
    const today = formatDate(new Date())
    const managementKey = createManagementKey('MOCK')

    expectApiSuccess(
      await service.register(
        MOCK_CORP_NUM,
        createTaxInvoiceDocument({
          businessNumber: MOCK_CORP_NUM,
          counterpartCorpNum: MOCK_COUNTERPART_CORP_NUM,
          managementKey,
          writeDate: today,
          receiverEmail: MOCK_RECEIVER_EMAIL,
        }),
        MOCK_USER_ID
      )
    )

    expectApiSuccess(
      await service.issue(MOCK_CORP_NUM, TaxinvoiceDocumentKeyTypes.Sales, managementKey, 'mock issue', 'mock issue', false, MOCK_USER_ID)
    )

    const info = await service.getInfo(MOCK_CORP_NUM, TaxinvoiceDocumentKeyTypes.Sales, managementKey, MOCK_USER_ID)
    expect(info.itemKey).toBe('MOCK-ITEM-KEY')

    const searchResult = await service.search(
      MOCK_CORP_NUM,
      TaxinvoiceDocumentKeyTypes.Sales,
      'R',
      today,
      today,
      ['3**'],
      ['N'],
      ['T'],
      null,
      'D',
      1,
      100,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      MOCK_USER_ID
    )
    expect(searchResult.list).toHaveLength(1)

    await expect(service.getURL(MOCK_CORP_NUM, TaxinvoiceBoxScopes.TemporaryDocumentBox, MOCK_USER_ID)).resolves.toBe(
      'https://mock.popbill.local/taxinvoice'
    )
  })
})
