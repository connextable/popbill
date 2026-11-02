import { createClosedownService } from '@/services/closedown'
import { createBizInfoCheckService } from '@/services/biz-info-check'
import { createAccountCheckService } from '@/services/account-check'

type ClosedownCompat = Parameters<typeof createClosedownService>[0]['compatClosedownService']
type BizInfoCompat = Parameters<typeof createBizInfoCheckService>[0]['compatBizInfoCheckService']
type AccountCheckCompat = Parameters<typeof createAccountCheckService>[0]['compatAccountCheckService']

const businessNumber = '1234567890'
const targetBusinessNumber = '8888888888'
const defaultUserId = 'lookup-user'
const charge = { unitCost: '1.25', chargeMethod: '선불', rateSystem: '종량제' }
const status = { corpNum: targetBusinessNumber, taxType: '10', typeDate: null, state: '01', stateDate: null, checkDate: '2026-11-03' }
const statusResult = {
  businessNumber: targetBusinessNumber,
  taxTypeCode: '10',
  taxTypeChangedDate: null,
  businessStateCode: '01',
  businessStateChangedDate: null,
  checkedDate: '2026-11-03',
}
const company = {
  corpNum: targetBusinessNumber,
  companyRegNum: '1101110123456',
  checkDT: '20261103100000',
  corpName: '테스트기업',
  ceoname: '홍길동',
  corpCode: 1,
  corpScaleCode: 2,
  personCorpCode: 3,
  headOfficeCode: 4,
  establishCode: 5,
  workPlaceCode: 6,
  addrCode: 7,
  industryCode: '12345',
  establishDate: '20000101',
  zipCode: '01234',
  addr: '서울',
  addrDetail: '1층',
  enAddr: 'Seoul',
  bizClass: '서비스',
  bizType: '정보통신',
  result: 200,
  resultMessage: '조회결과 없음',
  closeDownState: 0,
  closeDownStateDate: null,
  closeDownTaxType: null,
  closeDownTaxTypeDate: null,
}
const companyResult = {
  businessNumber: targetBusinessNumber,
  corporateRegistrationNumber: '1101110123456',
  checkedAt: '20261103100000',
  companyName: '테스트기업',
  chiefExecutiveOfficerName: '홍길동',
  corporateTypeCode: 1,
  companyScaleCode: 2,
  personOrCorporationCode: 3,
  headOfficeCode: 4,
  establishmentTypeCode: 5,
  workplaceTypeCode: 6,
  addressTypeCode: 7,
  industryCode: '12345',
  establishedDate: '20000101',
  postalCode: '01234',
  address: '서울',
  addressDetail: '1층',
  englishAddress: 'Seoul',
  businessClass: '서비스',
  businessType: '정보통신',
  resultCode: 200,
  resultMessage: '조회결과 없음',
  businessStateCode: 0,
  businessStateChangedDate: null,
  taxTypeCode: null,
  taxTypeChangedDate: null,
}
const account = { result: 200, resultMessage: '조회 실패', accountName: '', bankCode: '0004', accountNumber: '123-456', checkDT: '20261103100000' }
const accountResult = {
  resultCode: 200,
  resultMessage: '조회 실패',
  accountHolderName: '',
  bankCode: '0004',
  accountNumber: '123-456',
  checkedAt: '20261103100000',
}

function fixtures(onError?: (error: unknown) => void) {
  const closedown = {
    checkCorpNum: vi.fn<ClosedownCompat['checkCorpNum']>().mockResolvedValue(status),
    checkCorpNums: vi.fn<ClosedownCompat['checkCorpNums']>().mockResolvedValue([status]),
    getChargeInfo: vi.fn<ClosedownCompat['getChargeInfo']>().mockResolvedValue(charge),
    getUnitCost: vi.fn<ClosedownCompat['getUnitCost']>().mockResolvedValue('1.25'),
  } satisfies Parameters<typeof createClosedownService>[0]['compatClosedownService']
  const biz = {
    checkBizInfo: vi.fn<BizInfoCompat['checkBizInfo']>().mockResolvedValue(company),
    getChargeInfo: vi.fn<BizInfoCompat['getChargeInfo']>().mockResolvedValue(charge),
    getUnitCost: vi.fn<BizInfoCompat['getUnitCost']>().mockResolvedValue('1.25'),
  } satisfies Parameters<typeof createBizInfoCheckService>[0]['compatBizInfoCheckService']
  const accounts = {
    checkAccountInfo: vi.fn<AccountCheckCompat['checkAccountInfo']>().mockResolvedValue(account),
    checkDepositorInfo: vi
      .fn<AccountCheckCompat['checkDepositorInfo']>()
      .mockResolvedValue({ ...account, identityNumType: 'P', identityNum: '900101' }),
    getChargeInfo: vi.fn<AccountCheckCompat['getChargeInfo']>().mockResolvedValue(charge),
    getUnitCost: vi.fn<AccountCheckCompat['getUnitCost']>().mockResolvedValue('1.25'),
  } satisfies Parameters<typeof createAccountCheckService>[0]['compatAccountCheckService']
  return {
    compat: { closedown, biz, accounts },
    closedown: createClosedownService({ compatClosedownService: closedown, defaultUserId, onError }),
    biz: createBizInfoCheckService({ compatBizInfoCheckService: biz, defaultUserId, onError }),
    accounts: createAccountCheckService({ compatAccountCheckService: accounts, defaultUserId, onError }),
  }
}

test('closedown maps nullable dates and keeps leading-zero state codes', async () => {
  const fixture = fixtures()
  await expect(fixture.closedown.checkBusinessStatus({ businessNumber, targetBusinessNumber })).resolves.toEqual(statusResult)
  expect(fixture.compat.closedown.checkCorpNum).toHaveBeenCalledWith(businessNumber, targetBusinessNumber, defaultUserId)
  const targetBusinessNumbers = Object.freeze([targetBusinessNumber])
  await expect(fixture.closedown.checkBusinessStatuses({ businessNumber, targetBusinessNumbers: [...targetBusinessNumbers] })).resolves.toEqual([
    statusResult,
  ])
  expect(fixture.compat.closedown.checkCorpNums).toHaveBeenCalledWith(businessNumber, [targetBusinessNumber], defaultUserId)
})

test('company info maps every documented field and preserves business lookup failures as results', async () => {
  const fixture = fixtures()
  await expect(fixture.biz.getCompanyInfo({ businessNumber, targetBusinessNumber })).resolves.toEqual(companyResult)
  expect(fixture.compat.biz.checkBizInfo).toHaveBeenCalledWith(businessNumber, targetBusinessNumber, defaultUserId)
})

test('account lookup uses four-digit bank code and preserves non-success business results', async () => {
  const fixture = fixtures()
  await expect(fixture.accounts.checkAccountHolderName({ businessNumber, bankCode: '0004', accountNumber: '123-456' })).resolves.toEqual(
    accountResult
  )
  expect(fixture.compat.accounts.checkAccountInfo).toHaveBeenCalledWith(businessNumber, '0004', '123-456', defaultUserId)
  await expect(
    fixture.accounts.verifyAccountHolderIdentity({
      businessNumber,
      bankCode: '0004',
      accountNumber: '123-456',
      identityNumberType: 'P',
      identityNumber: '900101',
    })
  ).resolves.toEqual({ ...accountResult, identityNumberType: 'P', identityNumber: '900101' })
  expect(fixture.compat.accounts.checkDepositorInfo).toHaveBeenCalledWith(businessNumber, '0004', '123-456', 'P', '900101', defaultUserId)
})

test.each(['closedown', 'biz', 'accounts'] as const)('%s charge/unit costs keep decimal strings', async (name) => {
  const fixture = fixtures()
  await expect(fixture[name].getChargeInfo({ businessNumber })).resolves.toEqual(charge)
  await expect(fixture[name].getUnitCost({ businessNumber })).resolves.toEqual({ unitCost: '1.25' })
  expect(fixture.compat[name].getChargeInfo).toHaveBeenCalledWith(
    ...(name === 'accounts' ? [businessNumber, undefined, defaultUserId] : [businessNumber, defaultUserId])
  )
  expect(fixture.compat[name].getUnitCost).toHaveBeenCalledWith(
    ...(name === 'accounts' ? [businessNumber, undefined, defaultUserId] : [businessNumber])
  )
})

test('account charge service type is forwarded in its own slot', async () => {
  const fixture = fixtures()
  await fixture.accounts.getChargeInfo({ businessNumber, serviceType: '성명' })
  await fixture.accounts.getUnitCost({ businessNumber, serviceType: '실명' })
  expect(fixture.compat.accounts.getChargeInfo).toHaveBeenCalledWith(businessNumber, '성명', defaultUserId)
  expect(fixture.compat.accounts.getUnitCost).toHaveBeenCalledWith(businessNumber, '실명', defaultUserId)
})

test('error normalization preserves the API failure when onError rejects', async () => {
  const onError = vi.fn<() => Promise<void>>().mockRejectedValue(new Error('hook failed'))
  const fixture = fixtures(onError)
  fixture.compat.biz.checkBizInfo.mockRejectedValueOnce({ code: -11000001, message: 'API failed' })
  await expect(fixture.biz.getCompanyInfo({ businessNumber, targetBusinessNumber })).rejects.toMatchObject({
    code: -11000001,
    message: 'API failed',
    operation: 'bizInfoCheck.getCompanyInfo',
  })
  expect(onError).toHaveBeenCalledOnce()
})

test('modern services expose only their modern names', () => {
  const fixture = fixtures()
  expect(Object.keys(fixture.closedown).sort()).toEqual(['checkBusinessStatus', 'checkBusinessStatuses', 'getChargeInfo', 'getUnitCost'].sort())
  expect(Object.keys(fixture.biz).sort()).toEqual(['getCompanyInfo', 'getChargeInfo', 'getUnitCost'].sort())
  expect(Object.keys(fixture.accounts).sort()).toEqual(
    ['checkAccountHolderName', 'verifyAccountHolderIdentity', 'getChargeInfo', 'getUnitCost'].sort()
  )
})
