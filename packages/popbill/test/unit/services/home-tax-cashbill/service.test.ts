import { createHomeTaxCashbillService, type HomeTaxCashbillService } from '@/services/home-tax-cashbill'
import { HOME_TAX_CASHBILL_METHODS } from '@/services/home-tax-cashbill/methods'

type CompatService = Parameters<typeof createHomeTaxCashbillService>[0]['compatHomeTaxCashbillService']
const CORP = '1234567890'
const USER = 'user-id'
const JOB = '026091614000000002'
const BUSINESS = { businessNumber: CORP }
const JOB_INPUT = { ...BUSINESS, jobId: JOB }
const OK = { code: 1, message: '처리 완료' }
const URL = 'https://example.test/auth'

interface ForwardingCase {
  method: keyof HomeTaxCashbillService
  compatMethod: keyof CompatService
  invoke: (service: HomeTaxCashbillService) => Promise<unknown>
  expectedArgs: unknown[]
  response: unknown
  result: unknown
}

const cases: ForwardingCase[] = [
  {
    method: 'getAuthenticationRegistrationUrl',
    compatMethod: 'getCertificatePopUpURL',
    invoke: (service) => service.getAuthenticationRegistrationUrl(BUSINESS),
    expectedArgs: [CORP, USER],
    response: URL,
    result: { url: URL },
  },
  {
    method: 'getCertificateExpiration',
    compatMethod: 'getCertificateExpireDate',
    invoke: (service) => service.getCertificateExpiration(BUSINESS),
    expectedArgs: [CORP],
    response: '20271231235959',
    result: { expiresAt: '20271231235959' },
  },
  {
    method: 'validateCertificate',
    compatMethod: 'checkCertValidation',
    invoke: (service) => service.validateCertificate(BUSINESS),
    expectedArgs: [CORP],
    response: OK,
    result: OK,
  },
  {
    method: 'registerDepartmentUser',
    compatMethod: 'registDeptUser',
    invoke: (service) =>
      service.registerDepartmentUser({
        ...BUSINESS,
        departmentUserId: 'dept',
        departmentUserPassword: 'pass',
        representativeIdentityPrefix: '9001011',
      }),
    expectedArgs: [CORP, 'dept', 'pass', '9001011', USER],
    response: OK,
    result: OK,
  },
  {
    method: 'checkDepartmentUserRegistration',
    compatMethod: 'checkDeptUser',
    invoke: (service) => service.checkDepartmentUserRegistration(BUSINESS),
    expectedArgs: [CORP, USER],
    response: OK,
    result: OK,
  },
  {
    method: 'validateDepartmentUser',
    compatMethod: 'checkLoginDeptUser',
    invoke: (service) => service.validateDepartmentUser(BUSINESS),
    expectedArgs: [CORP],
    response: OK,
    result: OK,
  },
  {
    method: 'deleteDepartmentUser',
    compatMethod: 'deleteDeptUser',
    invoke: (service) => service.deleteDepartmentUser(BUSINESS),
    expectedArgs: [CORP, USER],
    response: OK,
    result: OK,
  },
  {
    method: 'requestCollection',
    compatMethod: 'requestJob',
    invoke: (service) => service.requestCollection({ ...BUSINESS, receiptDirection: 'BUY', startDate: '20260901', endDate: '20260930' }),
    expectedArgs: [CORP, 'BUY', '20260901', '20260930', USER],
    response: JOB,
    result: { jobId: JOB },
  },
  {
    method: 'getCollectionJobState',
    compatMethod: 'getJobState',
    invoke: (service) => service.getCollectionJobState(JOB_INPUT),
    expectedArgs: [CORP, JOB, USER],
    response: { jobID: JOB, jobState: '3', errorCode: 1 },
    result: { jobId: JOB, stateCode: 3, collectionSucceeded: true, resultCode: 1 },
  },
  {
    method: 'listActiveCollectionJobs',
    compatMethod: 'listActiveJob',
    invoke: (service) => service.listActiveCollectionJobs(BUSINESS),
    expectedArgs: [CORP, USER],
    response: [{ jobID: JOB, jobState: 2 }],
    result: [{ jobId: JOB, stateCode: 2, collectionSucceeded: false }],
  },
  {
    method: 'searchCashbills',
    compatMethod: 'search',
    invoke: (service) =>
      service.searchCashbills({ ...JOB_INPUT, tradeTypes: ['N'], tradeUsages: ['C'], pageNumber: 2, pageSize: 10, sortOrder: 'A' }),
    expectedArgs: [CORP, JOB, ['N'], ['C'], 2, 10, 'A', USER],
    response: {
      ...OK,
      total: 1,
      pageNum: 2,
      perPage: 10,
      pageCount: 1,
      list: [
        {
          ntsconfirmNum: 'NTS-01',
          supplyCost: '0010',
          tax: '0',
          serviceFee: '0',
          totalAmount: '0010',
          identityNum: '0001',
          identityNumType: '1',
          franchiseCorpType: 0,
          deductionType: 0,
        },
      ],
    },
    result: {
      ...OK,
      totalCount: 1,
      pageNumber: 2,
      pageSize: 10,
      pageCount: 1,
      receipts: [
        {
          ntsConfirmationNumber: 'NTS-01',
          supplyAmount: '0010',
          taxAmount: '0',
          serviceFeeAmount: '0',
          totalAmount: '0010',
          maskedIdentityNumber: '0001',
          identityNumberTypeCode: 1,
          franchiseBusinessTypeCode: 0,
          deductionTypeCode: 0,
        },
      ],
    },
  },
  {
    method: 'getCashbillSummary',
    compatMethod: 'summary',
    invoke: (service) => service.getCashbillSummary(JOB_INPUT),
    expectedArgs: [CORP, JOB, undefined, undefined, USER],
    response: { count: 2, supplyCostTotal: 1820, taxTotal: 180, serviceFeeTotal: 0, amountTotal: 2000 },
    result: { receiptCount: 2, supplyAmountTotal: 1820, taxAmountTotal: 180, serviceFeeAmountTotal: 0, totalAmount: 2000 },
  },
  {
    method: 'getFlatRateRegistrationUrl',
    compatMethod: 'getFlatRatePopUpURL',
    invoke: (service) => service.getFlatRateRegistrationUrl(BUSINESS),
    expectedArgs: [CORP, USER],
    response: URL,
    result: { url: URL },
  },
  {
    method: 'getFlatRateState',
    compatMethod: 'getFlatRateState',
    invoke: (service) => service.getFlatRateState(BUSINESS),
    expectedArgs: [CORP, USER],
    response: { referenceID: CORP, state: 1, closeRequestYN: false, useRestrictYN: false, closeOnExpired: false, unPaidYN: false },
    result: {
      businessNumber: CORP,
      stateCode: 1,
      cancellationRequested: false,
      useRestricted: false,
      cancelOnExpiration: false,
      hasUnpaidBalance: false,
    },
  },
  {
    method: 'getChargeInfo',
    compatMethod: 'getChargeInfo',
    invoke: (service) => service.getChargeInfo(BUSINESS),
    expectedArgs: [CORP, USER],
    response: { unitCost: '001000', chargeMethod: '연동', rateSystem: '정액제' },
    result: { unitCost: '001000', chargeMethod: '연동', rateSystem: '정액제' },
  },
]

function createService(response: unknown = OK, onError?: Parameters<typeof createHomeTaxCashbillService>[0]['onError']) {
  const requestMock = vi.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue(response)
  const compat = Object.fromEntries(cases.map((entry) => [entry.compatMethod, requestMock])) as unknown as CompatService
  return { requestMock, service: createHomeTaxCashbillService({ compatHomeTaxCashbillService: compat, defaultUserId: USER, onError }) }
}

describe('HomeTaxCashbill modern service', () => {
  it.each(cases)('$method forwards its DTO and maps the documented result', async (testCase) => {
    const { service, requestMock } = createService(testCase.response)
    expect(await testCase.invoke(service)).toEqual(testCase.result)
    expect(requestMock).toHaveBeenCalledExactlyOnceWith(...testCase.expectedArgs)
  })

  it('covers all modern methods and exposes no legacy aliases', () => {
    const { service } = createService()
    expect(cases.map((entry) => entry.method).sort()).toEqual([...HOME_TAX_CASHBILL_METHODS].sort())
    expect(Object.keys(service).sort()).toEqual([...HOME_TAX_CASHBILL_METHODS].sort())
  })

  it.each([
    { jobState: 1, errorCode: 1, succeeded: false },
    { jobState: 2, errorCode: 1, succeeded: false },
    { jobState: 3, errorCode: -14100001, succeeded: false },
    { jobState: '3', errorCode: 1, succeeded: true },
  ])('separates collection completion from success $jobState/$errorCode', async ({ jobState, errorCode, succeeded }) => {
    const { service } = createService({ jobID: JOB, jobState, errorCode, errorReason: 'detail' })
    expect(await service.getCollectionJobState(JOB_INPUT)).toMatchObject({
      stateCode: Number(jobState),
      resultCode: errorCode,
      resultMessage: 'detail',
      collectionSucceeded: succeeded,
    })
  })

  it('passes explicit identity and user slots when secondary authentication is disabled', async () => {
    const { service, requestMock } = createService()
    await service.registerDepartmentUser({ ...BUSINESS, departmentUserId: 'dept', departmentUserPassword: 'pass' })
    expect(requestMock).toHaveBeenCalledExactlyOnceWith(CORP, 'dept', 'pass', undefined, USER)
  })
  it.each([null, ''])('accepts the documented disabled secondary authentication value %j', async (representativeIdentityPrefix) => {
    const { service, requestMock } = createService()
    await service.registerDepartmentUser({ ...BUSINESS, departmentUserId: 'dept', departmentUserPassword: 'pass', representativeIdentityPrefix })
    expect(requestMock).toHaveBeenCalledExactlyOnceWith(CORP, 'dept', 'pass', representativeIdentityPrefix, USER)
  })

  it('uses documented search defaults and preserves its input', async () => {
    const { service, requestMock } = createService({ ...OK, list: [] })
    const request = Object.freeze({ ...JOB_INPUT, tradeTypes: Object.freeze(['N']) as unknown as ['N'] })
    await service.searchCashbills(request)
    expect(requestMock).toHaveBeenCalledExactlyOnceWith(CORP, JOB, ['N'], undefined, 1, 500, 'D', USER)
  })
  it('accepts the documented search response without an operation message', async () => {
    const { service } = createService({ code: 1, list: [] })
    await expect(service.searchCashbills(JOB_INPUT)).resolves.toMatchObject({ code: 1, message: undefined, receipts: [] })
  })

  it.each([0, 1.5, Number.NaN])('rejects invalid page sizes before compat calls: %s', async (pageSize) => {
    const { service, requestMock } = createService()
    await expect(service.searchCashbills({ ...JOB_INPUT, pageSize })).rejects.toMatchObject({
      operation: 'homeTaxCashbill.searchCashbills',
      stage: 'validate_input',
    })
    expect(requestMock).not.toHaveBeenCalled()
  })
  it('leaves additional filter values and provider page limits to the provider', async () => {
    const { service, requestMock } = createService({ ...OK, list: [] })
    await service.searchCashbills({ ...JOB_INPUT, tradeTypes: ['NEXT'], tradeUsages: ['NEXT'], sortOrder: 'NEXT', pageSize: 1001 })
    expect(requestMock).toHaveBeenCalledExactlyOnceWith(CORP, JOB, ['NEXT'], ['NEXT'], 1, 1001, 'NEXT', USER)
  })
  it.each(['', null, 'future-state', '9007199254740993'])('preserves provider state values without manufacturing codes: %j', async (jobState) => {
    const { service } = createService({ jobID: JOB, jobState, errorCode: 1 })
    await expect(service.getCollectionJobState(JOB_INPUT)).resolves.toMatchObject({ stateCode: jobState, collectionSucceeded: false })
  })
  it('preserves blank, nullable and future classification codes', async () => {
    const { service } = createService({ ...OK, list: [{ franchiseCorpType: '', identityNumType: null, deductionType: 'NEXT' }] })
    await expect(service.searchCashbills(JOB_INPUT)).resolves.toMatchObject({
      receipts: [{ franchiseBusinessTypeCode: '', identityNumberTypeCode: null, deductionTypeCode: 'NEXT' }],
    })
  })

  it.each([
    { startDate: '20260230', endDate: '20260301' },
    { startDate: '20260902', endDate: '20260901' },
  ])('rejects invalid collection dates before compat calls', async ({ startDate, endDate }) => {
    const { service, requestMock } = createService()
    await expect(service.requestCollection({ ...BUSINESS, receiptDirection: 'SELL', startDate, endDate })).rejects.toMatchObject({
      stage: 'validate_input',
    })
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('preserves expired-job provider errors and isolates error hooks', async () => {
    const onError = vi.fn<(error: unknown) => void>(() => {
      throw new Error('hook failure')
    })
    const { service, requestMock } = createService(undefined, onError)
    requestMock.mockRejectedValue({ code: -11101001, message: '수집작업이 존재하지 않습니다.' })
    await expect(service.getCollectionJobState(JOB_INPUT)).rejects.toMatchObject({
      code: -11101001,
      operation: 'homeTaxCashbill.getCollectionJobState',
    })
    expect(onError).toHaveBeenCalledOnce()
  })
})
