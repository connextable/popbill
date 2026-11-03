import { createHomeTaxTaxInvoiceService } from '@/services/home-tax-tax-invoice/service'
import type { HTTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import { HOME_TAX_TAX_INVOICE_METHODS } from '@/services/home-tax-tax-invoice/methods'

const businessNumber = '1234567890'
const jobId = '026091610000000001'
const userId = 'ht-user'
const confirmationNumber = '202609164100020300007559'
const ok = { code: 1, message: '처리 완료' }
type DepartmentRegistrationMock = (
  corpNum: string,
  departmentUserId: string,
  departmentPassword: string,
  identityOrUserId?: string | null,
  userId?: string
) => ReturnType<HTTaxinvoicePromiseService['registDeptUser']>
function setup(onError?: (error: unknown) => void) {
  const compat = {
    getChargeInfo: vi
      .fn<HTTaxinvoicePromiseService['getChargeInfo']>()
      .mockResolvedValue({ unitCost: '1000', chargeMethod: '연동', rateSystem: '정액제' }),
    requestJob: vi.fn<HTTaxinvoicePromiseService['requestJob']>().mockResolvedValue(jobId),
    getJobState: vi.fn<HTTaxinvoicePromiseService['getJobState']>().mockResolvedValue({ jobID: jobId, jobState: 3, errorCode: 1, collectCount: 2 }),
    listActiveJob: vi.fn<HTTaxinvoicePromiseService['listActiveJob']>().mockResolvedValue([{ jobID: jobId, jobState: '3', errorCode: 1 }]),
    search: vi.fn<HTTaxinvoicePromiseService['search']>().mockResolvedValue({ code: 1, total: 0, perPage: 500, pageNum: 1, pageCount: 0, list: [] }),
    summary: vi
      .fn<HTTaxinvoicePromiseService['summary']>()
      .mockResolvedValue({ count: 1, supplyCostTotal: -100000, taxTotal: -10000, amountTotal: -110000 }),
    getTaxinvoice: vi.fn<HTTaxinvoicePromiseService['getTaxinvoice']>().mockResolvedValue({
      ntsconfirmNum: confirmationNumber,
      invoiceType: 101,
      supplyCostTotal: '999999999999999999',
      taxTotal: '-10000',
      cash: '0',
      modifyCode: 1,
      orgNTSConfirmNum: '202509164100020300007559',
      invoicerCorpNum: businessNumber,
      invoicerTaxRegID: '0001',
      invoiceeType: '개인',
      invoiceeCorpNum: '9001011234567',
      invoiceeEmail2: 'second@example.test',
      trusteeCorpName: '수탁사',
      trusteeMgtKey: 'TRUSTEE-0001',
      detailList: [{ serialNum: 1, qty: '-1.25', unitCost: '100.00', supplyCost: '-125', tax: '0', purchaseDT: '20260916' }],
    }),
    getXML: vi
      .fn<HTTaxinvoicePromiseService['getXML']>()
      .mockResolvedValue({ ResultCode: 1, Message: confirmationNumber, retObject: '<TaxInvoice />' }),
    getPopUpURL: vi.fn<HTTaxinvoicePromiseService['getPopUpURL']>().mockResolvedValue('https://example.test/popup'),
    getPrintURL: vi.fn<HTTaxinvoicePromiseService['getPrintURL']>().mockResolvedValue('https://example.test/print'),
    getFlatRatePopUpURL: vi.fn<HTTaxinvoicePromiseService['getFlatRatePopUpURL']>().mockResolvedValue('https://example.test/flat'),
    getCertificatePopUpURL: vi.fn<HTTaxinvoicePromiseService['getCertificatePopUpURL']>().mockResolvedValue('https://example.test/cert'),
    getFlatRateState: vi.fn<HTTaxinvoicePromiseService['getFlatRateState']>().mockResolvedValue({
      referenceID: businessNumber,
      state: 1,
      baseDate: 25,
      closeRequestYN: false,
      useRestrictYN: false,
      closeOnExpired: false,
      unPaidYN: false,
    }),
    getCertificateExpireDate: vi.fn<HTTaxinvoicePromiseService['getCertificateExpireDate']>().mockResolvedValue('20271111204731'),
    checkCertValidation: vi.fn<HTTaxinvoicePromiseService['checkCertValidation']>().mockResolvedValue(ok),
    checkDeptUser: vi.fn<HTTaxinvoicePromiseService['checkDeptUser']>().mockResolvedValue(ok),
    registDeptUser: vi.fn<DepartmentRegistrationMock>().mockResolvedValue(ok),
    checkLoginDeptUser: vi.fn<HTTaxinvoicePromiseService['checkLoginDeptUser']>().mockResolvedValue(ok),
    deleteDeptUser: vi.fn<HTTaxinvoicePromiseService['deleteDeptUser']>().mockResolvedValue(ok),
  } satisfies HTTaxinvoicePromiseService
  return { compat, service: createHomeTaxTaxInvoiceService({ compatHTTaxinvoiceService: compat, defaultUserId: userId, onError }) }
}
describe('홈택스 세금계산서 modern service', () => {
  test('exposes all 19 object methods without legacy aliases', () => {
    const { service } = setup()
    expect(Object.keys(service).sort()).toEqual([...HOME_TAX_TAX_INVOICE_METHODS].sort())
    expect(Reflect.get(service, 'requestJob')).toBeUndefined()
    expect(Reflect.get(service, 'registDeptUser')).toBeUndefined()
  })
  test('starts exactly one job and returns its identifier without polling', async () => {
    const { service, compat } = setup()
    await expect(
      service.requestCollection({ businessNumber, invoiceDirection: 'BUY', searchDateType: 'S', startDate: '20260901', endDate: '20260916' })
    ).resolves.toEqual({ jobId })
    expect(compat.requestJob).toHaveBeenCalledExactlyOnceWith(businessNumber, 'BUY', 'S', '20260901', '20260916', userId)
    expect(compat.getJobState).not.toHaveBeenCalled()
  })
  test.each([
    { jobState: 1, errorCode: 1, expected: false },
    { jobState: 2, errorCode: 1, expected: false },
    { jobState: 3, errorCode: -11100001, expected: false },
    { jobState: '3', errorCode: 1, expected: true },
    { jobState: '3', errorCode: '1', expected: true },
    { jobState: ' 3 ', errorCode: ' 1 ', expected: true },
    { jobState: 3, errorCode: '-11100001', expected: false },
    { jobState: 3, errorCode: '', expected: false },
    { jobState: 3, errorCode: null, expected: false },
    { jobState: 3, errorCode: 'future-result', expected: false },
    { jobState: 3, errorCode: '9007199254740993', expected: false },
  ])('completion alone cannot imply collection success: $jobState / $errorCode', async ({ jobState, errorCode, expected }) => {
    const { service, compat } = setup()
    compat.getJobState.mockResolvedValueOnce({ jobID: jobId, jobState, errorCode })
    await expect(service.getCollectionState({ businessNumber, jobId })).resolves.toMatchObject({
      jobId,
      stateCode: Number(jobState),
      resultCode: errorCode,
      isSearchable: expected,
    })
    expect(compat.requestJob).not.toHaveBeenCalled()
  })
  test('passes false registration filter and leading zeros to search and totals', async () => {
    const { service, compat } = setup()
    const filters = {
      businessNumber,
      jobId,
      documentTypes: ['N' as const],
      taxTypes: ['T' as const],
      purposeTypes: ['R' as const],
      hasTaxRegistrationId: false,
      taxRegistrationParty: 'B' as const,
      taxRegistrationIds: ['0001', '0002'],
      queryText: '상호 &/',
    }
    await service.searchTaxInvoices(filters)
    expect(compat.search).toHaveBeenCalledWith(businessNumber, jobId, ['N'], ['T'], ['R'], 'B', '0', '0001,0002', 1, 500, 'D', userId, '상호 &/')
    await expect(service.getTaxInvoiceTotals(filters)).resolves.toEqual({
      count: 1,
      totalSupplyCostAmount: -100000,
      totalTaxAmount: -10000,
      totalAmount: -110000,
    })
    expect(compat.summary).toHaveBeenCalledWith(businessNumber, jobId, ['N'], ['T'], ['R'], 'B', '0', '0001,0002', userId, '상호 &/')
    expect(filters.taxRegistrationIds).toEqual(['0001', '0002'])
  })
  test('preserves 18 digit monetary strings, negative quantities, party and correction fields', async () => {
    const { service } = setup()
    await expect(service.getTaxInvoice({ businessNumber, confirmationNumber })).resolves.toMatchObject({
      confirmationNumber,
      invoiceTypeCode: 101,
      totalSupplyCostAmount: '999999999999999999',
      totalTaxAmount: '-10000',
      cashAmount: '0',
      modificationReasonCode: 1,
      supplier: { businessNumber, taxRegistrationId: '0001' },
      recipient: { partyType: '개인', businessNumber: '9001011234567', secondaryEmailAddress: 'second@example.test' },
      trustee: { companyName: '수탁사', managementKey: 'TRUSTEE-0001' },
      lineItems: [
        { sequenceNumber: 1, quantity: '-1.25', unitCost: '100.00', supplyCostAmount: '-125', taxAmount: '0', transactionDate: '20260916' },
      ],
    })
  })
  test('maps XML wrapper, URLs, authentication and billing states', async () => {
    const { service, compat } = setup()
    await expect(service.getTaxInvoiceXml({ businessNumber, confirmationNumber })).resolves.toEqual({
      resultCode: 1,
      resultMessage: confirmationNumber,
      xml: '<TaxInvoice />',
    })
    await expect(service.getTaxInvoicePopupUrl({ businessNumber, confirmationNumber })).resolves.toEqual({ accessUrl: 'https://example.test/popup' })
    await expect(service.getTaxInvoicePrintUrl({ businessNumber, confirmationNumber })).resolves.toEqual({ accessUrl: 'https://example.test/print' })
    await expect(service.getAuthenticationRegistrationUrl({ businessNumber })).resolves.toEqual({ accessUrl: 'https://example.test/cert' })
    await expect(service.getFlatRateApplicationUrl({ businessNumber })).resolves.toEqual({ accessUrl: 'https://example.test/flat' })
    await expect(service.getCertificateExpiration({ businessNumber })).resolves.toEqual({ expiresAt: '20271111204731' })
    await expect(service.validateCertificate({ businessNumber })).resolves.toEqual({ resultCode: 1, resultMessage: '처리 완료' })
    await expect(service.checkDepartmentUserRegistration({ businessNumber })).resolves.toEqual({ resultCode: 1, resultMessage: '처리 완료' })
    await expect(service.validateDepartmentUserLogin({ businessNumber })).resolves.toEqual({ resultCode: 1, resultMessage: '처리 완료' })
    await expect(service.deleteDepartmentUser({ businessNumber })).resolves.toEqual({ resultCode: 1, resultMessage: '처리 완료' })
    expect(compat.deleteDeptUser).toHaveBeenCalledWith(businessNumber, userId)
    await expect(service.getFlatRateState({ businessNumber })).resolves.toMatchObject({
      businessNumber,
      stateCode: 1,
      billingDay: 25,
      terminationRequested: false,
      usageRestricted: false,
      terminateOnExpiration: false,
      hasUnpaidBalance: false,
    })
    await expect(service.getChargeInfo({ businessNumber })).resolves.toEqual({ unitCost: '1000', chargeMethod: '연동', rateSystem: '정액제' })
    await expect(service.listActiveCollections({ businessNumber })).resolves.toMatchObject([{ jobId, stateCode: 3, isSearchable: true }])
  })
  test('department second authentication identity occupies its own legacy slot', async () => {
    const { service, compat } = setup()
    await service.registerDepartmentUser({
      businessNumber,
      departmentUserId: 'department-user',
      departmentPassword: 'password',
      identityNumber: '9001011',
    })
    expect(compat.registDeptUser).toHaveBeenCalledWith(businessNumber, 'department-user', 'password', '9001011', userId)
    await service.registerDepartmentUser({ businessNumber, departmentUserId: 'department-user', departmentPassword: 'password' })
    expect(compat.registDeptUser).toHaveBeenLastCalledWith(businessNumber, 'department-user', 'password', undefined, userId)
  })
  test.each([null, ''])('accepts the documented disabled secondary authentication value %j', async (identityNumber) => {
    const { service, compat } = setup()
    await service.registerDepartmentUser({ businessNumber, departmentUserId: 'department-user', departmentPassword: 'password', identityNumber })
    expect(compat.registDeptUser).toHaveBeenCalledWith(businessNumber, 'department-user', 'password', identityNumber, userId)
  })
  test('invalid calendar dates, reversed range and invalid paging fail before compat', async () => {
    const { service, compat } = setup()
    await expect(
      service.requestCollection({ businessNumber, invoiceDirection: 'SELL', searchDateType: 'S', startDate: '20260230', endDate: '20260301' })
    ).rejects.toBeInstanceOf(Error)
    await expect(
      service.requestCollection({ businessNumber, invoiceDirection: 'SELL', searchDateType: 'S', startDate: '20260302', endDate: '20260301' })
    ).rejects.toBeInstanceOf(Error)
    await expect(service.searchTaxInvoices({ businessNumber, jobId, pageSize: 0 })).rejects.toBeInstanceOf(Error)
    expect(compat.requestJob).not.toHaveBeenCalled()
    expect(compat.search).not.toHaveBeenCalled()
  })
  test('delegates provider filter extensions and page limits without losing their values', async () => {
    const { service, compat } = setup()
    await service.searchTaxInvoices({ businessNumber, jobId, documentTypes: ['NEXT'], sortOrder: 'NEXT', pageSize: 1001 })
    expect(compat.search).toHaveBeenCalledWith(
      businessNumber,
      jobId,
      ['NEXT'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      1001,
      'NEXT',
      userId,
      undefined
    )
  })
  test.each(['', null, 'future-state', '9007199254740993'])('preserves unrecognized or absent provider states: %j', async (jobState) => {
    const { service, compat } = setup()
    compat.getJobState.mockResolvedValueOnce({ jobID: jobId, jobState, errorCode: 1 })
    await expect(service.getCollectionState({ businessNumber, jobId })).resolves.toMatchObject({ stateCode: jobState, isSearchable: false })
  })
  test('expired job errors reach onError once without retry; failed hooks preserve original error', async () => {
    const onError = vi.fn<(error: unknown) => Promise<void>>().mockRejectedValue(new Error('hook failed'))
    const { service, compat } = setup(onError)
    compat.getJobState.mockRejectedValueOnce({ code: -11101001, message: '작업아이디의 수집작업이 존재하지 않습니다.' })
    await expect(service.getCollectionState({ businessNumber, jobId })).rejects.toMatchObject({
      code: -11101001,
      message: '작업아이디의 수집작업이 존재하지 않습니다.',
    })
    expect(onError).toHaveBeenCalledTimes(1)
    expect(compat.getJobState).toHaveBeenCalledTimes(1)
    expect(compat.requestJob).not.toHaveBeenCalled()
  })
})
