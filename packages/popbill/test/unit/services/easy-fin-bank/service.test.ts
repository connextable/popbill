import { createEasyFinBankService } from '@/services/easy-fin-bank'
import { mapCollectionStatus } from '@/services/easy-fin-bank/mappers/response'
import type { EasyFinBankJobStateApiModel } from '@connextable/popbill-spec'

type Compat = Parameters<typeof createEasyFinBankService>[0]['compatEasyFinBankService']
const businessNumber = '1234567890'
const userId = 'bank-user'
const accountRef = { businessNumber, bankCode: '0004', accountNumber: '0123456789' }
const collectionId = '202611030000000001'
const ok = { code: 1, message: 'OK' }

function serviceWith(compat: Partial<Compat>, onError?: Parameters<typeof createEasyFinBankService>[0]['onError']) {
  return createEasyFinBankService({ compatEasyFinBankService: compat as Compat, defaultUserId: userId, onError })
}

it('maps registration credentials and paid months without mutating the input', async () => {
  const registBankAccount = vi.fn<Compat['registBankAccount']>().mockResolvedValue(ok)
  const account = Object.freeze({
    bankCode: '0004',
    accountNumber: '0123456789',
    accountPassword: '0000',
    accountType: '법인' as const,
    identityNumber: businessNumber,
    accountName: '운영계좌',
    internetBankingId: 'bank-id',
    inquiryId: 'read-id',
    inquiryPassword: 'password',
    memo: 'memo',
  })
  const request = Object.freeze({ businessNumber, account, subscriptionMonths: 3 })
  await expect(serviceWith({ registBankAccount }).registerBankAccount(request)).resolves.toEqual(ok)
  expect(registBankAccount).toHaveBeenCalledWith(
    businessNumber,
    {
      BankCode: '0004',
      AccountNumber: '0123456789',
      AccountPWD: '0000',
      AccountType: '법인',
      IdentityNumber: businessNumber,
      AccountName: '운영계좌',
      BankID: 'bank-id',
      FastID: 'read-id',
      FastPWD: 'password',
      Memo: 'memo',
      UsePeriod: 3,
    },
    userId
  )
  expect(account.accountPassword).toBe('0000')
})

it('uses the current documented ordinary closure type', async () => {
  const closeBankAccount = vi.fn<Compat['closeBankAccount']>().mockResolvedValue(ok)
  await serviceWith({ closeBankAccount }).requestBankAccountClosure(accountRef)
  expect(closeBankAccount).toHaveBeenCalledWith(businessNumber, '0004', '0123456789', '일반', userId)
})

it('returns a collection identifier and forwards dates explicitly', async () => {
  const requestJob = vi.fn<Compat['requestJob']>().mockResolvedValue(collectionId)
  await expect(serviceWith({ requestJob }).requestCollection({ ...accountRef, startDate: '20261101', endDate: '20261103' })).resolves.toEqual({
    collectionId,
  })
  expect(requestJob).toHaveBeenCalledWith(businessNumber, '0004', '0123456789', '20261101', '20261103', userId)
})

it.each([
  [0, 1, false],
  ['1', 1, false],
  [2, 1, false],
  [3, -18000001, false],
  ['3', 1, true],
  [3, 1, true],
] as const)('keeps completion %s distinct from successful collection (result %s)', (jobState, errorCode, expected) => {
  const state: EasyFinBankJobStateApiModel = {
    jobID: collectionId,
    jobState,
    startDate: '20261101',
    endDate: '20261103',
    errorCode,
    errorReason: errorCode === 1 ? '' : '계좌 인증 실패',
    jobStartDT: '20261103100000',
    jobEndDT: '',
    regDT: '20261103095900',
  }
  expect(mapCollectionStatus(state)).toEqual({
    collectionId,
    stateCode: Number(jobState),
    startDate: '20261101',
    endDate: '20261103',
    resultCode: errorCode,
    resultMessage: state.errorReason,
    startedAt: '20261103100000',
    completedAt: '',
    requestedAt: '20261103095900',
    isSuccessful: expected,
  })
})

it('preserves amount strings, bank remarks, and paging when mapping transactions', async () => {
  const search = vi.fn<Compat['search']>().mockResolvedValue({
    ...ok,
    total: 1,
    perPage: 1000,
    pageNum: 2,
    pageCount: 2,
    lastScrapDT: '20261103120000',
    balance: '9007199254740993.50',
    list: [
      {
        tid: 'TID',
        trdate: '20261103',
        trserial: 0,
        trdt: '20261103115959',
        accIn: '00000.00',
        accOut: '9007199254740993.50',
        balance: '0',
        remark1: '입금자',
        remark2: '',
        remark3: '거래구분',
        remark4: '지점',
        regDT: '20261103120000',
        memo: '확인',
      },
    ],
  })
  const filters = Object.freeze(['I', 'O'] as const)
  const result = await serviceWith({ search }).searchTransactions({
    businessNumber,
    collectionId,
    transactionTypes: [...filters],
    queryText: '입금자',
    pageNumber: 2,
    pageSize: 1000,
    sortOrder: 'A',
  })
  expect(search).toHaveBeenCalledWith(businessNumber, collectionId, ['I', 'O'], '입금자', 2, 1000, 'A', userId)
  expect(result).toEqual({
    ...ok,
    totalCount: 1,
    pageSize: 1000,
    pageNumber: 2,
    pageCount: 2,
    lastCollectedAt: '20261103120000',
    balance: '9007199254740993.50',
    transactions: [
      {
        transactionId: 'TID',
        transactionDate: '20261103',
        transactionSequence: 0,
        transactedAt: '20261103115959',
        depositAmount: '00000.00',
        withdrawalAmount: '9007199254740993.50',
        balance: '0',
        remark1: '입금자',
        remark2: '',
        remark3: '거래구분',
        remark4: '지점',
        registeredAt: '20261103120000',
        memo: '확인',
      },
    ],
  })
})

it.each(['', null, 'future-state', '9007199254740993'])('preserves unknown collection state values: %j', (jobState) => {
  const state: EasyFinBankJobStateApiModel = {
    jobID: collectionId,
    jobState,
    startDate: '20261101',
    endDate: '20261103',
    errorCode: 1,
    errorReason: '',
    jobStartDT: '',
    jobEndDT: '',
    regDT: '20261103095900',
  }
  expect(mapCollectionStatus(state)).toMatchObject({ stateCode: jobState, isSuccessful: false })
})

it('keeps the client user slot when optional transaction filters are omitted', async () => {
  const summary = vi.fn<Compat['summary']>().mockResolvedValue({ count: 0, cntAccIn: 0, cntAccOut: 0, totalAccIn: 0, totalAccOut: 0 })
  await expect(serviceWith({ summary }).summarizeTransactions({ businessNumber, collectionId })).resolves.toEqual({
    transactionCount: 0,
    depositCount: 0,
    withdrawalCount: 0,
    totalDepositAmount: 0,
    totalWithdrawalAmount: 0,
  })
  expect(summary).toHaveBeenCalledWith(businessNumber, collectionId, undefined, undefined, userId)
})

it('maps account and subscription states without losing false flags', async () => {
  const raw = {
    referenceID: 'REF',
    contractDT: '20261101000000',
    useEndDate: '20261130',
    baseDate: 5,
    state: 1,
    closeRequestYN: false,
    useRestrictYN: false,
    closeOnExpired: true,
    unPaidYN: false,
  }
  const getFlatRateState = vi.fn<Compat['getFlatRateState']>().mockResolvedValue(raw)
  const getBankAccountInfo = vi.fn<Compat['getBankAccountInfo']>().mockResolvedValue({
    ...raw,
    bankCode: '0004',
    accountNumber: '0123456789',
    accountName: '운영',
    accountType: '법인',
    contractState: 2,
    regDT: '20261101000000',
    memo: '',
  })
  const service = serviceWith({ getFlatRateState, getBankAccountInfo })
  await expect(service.getSubscriptionStatus(accountRef)).resolves.toEqual({
    accountReferenceId: 'REF',
    startedAt: '20261101000000',
    expiresOn: '20261130',
    renewalDay: 5,
    stateCode: 1,
    isClosureRequested: false,
    isUseRestricted: false,
    closesOnExpiration: true,
    hasUnpaidBalance: false,
  })
  await expect(service.getBankAccount(accountRef)).resolves.toMatchObject({
    bankCode: '0004',
    accountNumber: '0123456789',
    accountStateCode: 1,
    subscriptionStateCode: 2,
    isClosureRequested: false,
    isUseRestricted: false,
    hasUnpaidBalance: false,
  })
})

it('retains the provider error when an error hook throws', async () => {
  const error = { code: -18000001, message: 'Expired job' }
  const getJobState = vi.fn<Compat['getJobState']>().mockRejectedValue(error)
  const onError = vi.fn<() => void>(() => {
    throw new Error('hook')
  })
  await expect(serviceWith({ getJobState }, onError).getCollectionStatus({ businessNumber, collectionId })).rejects.toMatchObject({
    code: error.code,
    message: error.message,
    operation: 'easyFinBank.getCollectionStatus',
  })
  expect(onError).toHaveBeenCalledTimes(1)
})
