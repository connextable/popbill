import { describe, expect, it, vi } from 'vitest'
import type { CommonPromiseService } from '@connextable/popbill-compat/factory'
import { createCommonService } from '@/services/common/service'
import type { CommonService } from '@/services/common/types'

const businessNumber = '1234567890'
const business = { businessNumber }
const success = { code: 1, message: '성공' }
const operation = { resultCode: 1, resultMessage: '성공' }
const company = { chiefExecutiveOfficerName: '대표', companyName: '회사', address: '주소', businessType: '서비스', businessClass: '개발' }
const rawCompany = { ceoname: '대표', corpName: '회사', addr: '주소', bizType: '서비스', bizClass: '개발' }
const contact = { userId: 'contact', personName: '담당자', phoneNumber: '01012345678', emailAddress: 'contact@example.com', searchRole: 1 }
const rawContact = { id: 'contact', personName: '담당자', tel: '01012345678', email: 'contact@example.com', searchRole: 1 }
const rawPage = { code: 1, total: 1, pageNum: 2, perPage: 20, pageCount: 3 }
const page = { resultCode: 1, totalCount: 1, pageNumber: 2, pageSize: 20, pageCount: 3 }
const history = { ...business, startDate: '20260101', endDate: '20260131', pageNumber: 2, pageSize: 20 }
function facade(method: keyof CommonPromiseService, response: unknown, onError?: (error: unknown) => void) {
  const mock = vi.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue(response)
  const compat = { [method]: mock } as unknown as CommonPromiseService
  return { mock, service: createCommonService({ compatCommonService: compat, defaultUserId: 'operator', linkId: 'CLIENT_LINK', onError }) }
}

describe('common modern facade', () => {
  const cases: Array<{
    method: keyof CommonService
    input: unknown
    legacy: keyof CommonPromiseService
    args: unknown[]
    response: unknown
    expected: unknown
  }> = [
    {
      method: 'checkMemberRegistration',
      input: business,
      legacy: 'checkIsMember',
      args: [businessNumber],
      response: success,
      expected: { ...operation, isMember: true },
    },
    {
      method: 'checkUserIdUsage',
      input: { userId: 'checked-user' },
      legacy: 'checkID',
      args: ['checked-user'],
      response: { code: 0, message: '미사용' },
      expected: { resultCode: 0, resultMessage: '미사용', isInUse: false },
    },
    {
      method: 'registerMember',
      input: {
        ...business,
        userId: 'new-user',
        password: 'pw',
        company,
        contactName: '담당자',
        contactEmailAddress: 'a@example.com',
        contactPhoneNumber: '0101',
      },
      legacy: 'joinMember',
      args: [
        {
          ID: 'new-user',
          Password: 'pw',
          LinkID: 'CLIENT_LINK',
          CorpNum: businessNumber,
          CEOName: '대표',
          CorpName: '회사',
          Addr: '주소',
          BizType: '서비스',
          BizClass: '개발',
          ContactName: '담당자',
          ContactEmail: 'a@example.com',
          ContactTEL: '0101',
        },
      ],
      response: success,
      expected: operation,
    },
    {
      method: 'quitMember',
      input: { ...business, reason: '종료' },
      legacy: 'quitMember',
      args: [businessNumber, '종료', 'operator'],
      response: success,
      expected: operation,
    },
    { method: 'getCompanyInfo', input: business, legacy: 'getCorpInfo', args: [businessNumber, 'operator'], response: rawCompany, expected: company },
    {
      method: 'updateCompanyInfo',
      input: { ...business, company },
      legacy: 'updateCorpInfo',
      args: [businessNumber, 'operator', rawCompany],
      response: success,
      expected: operation,
    },
    {
      method: 'registerContact',
      input: { ...business, contact: { ...contact, password: 'pw' } },
      legacy: 'registContact',
      args: [businessNumber, 'operator', { ...rawContact, password: 'pw' }],
      response: success,
      expected: operation,
    },
    {
      method: 'getContactInfo',
      input: { ...business, contactUserId: 'contact' },
      legacy: 'getContactInfo',
      args: [businessNumber, 'contact', 'operator'],
      response: rawContact,
      expected: contact,
    },
    {
      method: 'listContacts',
      input: business,
      legacy: 'listContact',
      args: [businessNumber, 'operator'],
      response: [rawContact],
      expected: [contact],
    },
    {
      method: 'updateContact',
      input: { ...business, contact },
      legacy: 'updateContact',
      args: [businessNumber, 'operator', rawContact],
      response: success,
      expected: operation,
    },
    {
      method: 'deleteContact',
      input: { ...business, contactUserId: 'contact' },
      legacy: 'deleteContact',
      args: [businessNumber, 'contact', 'operator'],
      response: success,
      expected: operation,
    },
    {
      method: 'getLoginURL',
      input: business,
      legacy: 'getAccessURL',
      args: [businessNumber, 'operator'],
      response: 'login',
      expected: { accessUrl: 'login' },
    },
    {
      method: 'getMemberPointBalance',
      input: business,
      legacy: 'getBalance',
      args: [businessNumber],
      response: '9007199254740993.123',
      expected: { remainingPoints: '9007199254740993.123' },
    },
    {
      method: 'getPartnerPointBalance',
      input: business,
      legacy: 'getPartnerBalance',
      args: [businessNumber],
      response: '0.00',
      expected: { remainingPoints: '0.00' },
    },
    {
      method: 'getMemberPointChargeURL',
      input: business,
      legacy: 'getChargeURL',
      args: [businessNumber, 'operator'],
      response: 'charge',
      expected: { accessUrl: 'charge' },
    },
    {
      method: 'getPartnerPointChargeURL',
      input: business,
      legacy: 'getPartnerURL',
      args: [businessNumber, 'CHRG'],
      response: 'partner',
      expected: { accessUrl: 'partner' },
    },
    {
      method: 'requestPointPayment',
      input: {
        ...business,
        paymentName: '입금자',
        paymentAmount: '10000',
        contactName: '담당자',
        contactEmailAddress: 'a@example.com',
        notificationPhoneNumber: '0101',
      },
      legacy: 'paymentRequest',
      args: [
        businessNumber,
        { paymentName: '입금자', settleCost: '10000', settlerName: '담당자', settlerEmail: 'a@example.com', notifyHP: '0101' },
        'operator',
      ],
      response: { ...success, settleCode: 'S001' },
      expected: { ...operation, settlementCode: 'S001' },
    },
    {
      method: 'getPointPaymentInfo',
      input: { ...business, settlementCode: 'S001' },
      legacy: 'getSettleResult',
      args: [businessNumber, 'S001', 'operator'],
      response: { settleCost: '10000', settleState: 1 },
      expected: { paymentAmount: '10000', stateCode: 1 },
    },
    {
      method: 'getPointPaymentHistory',
      input: history,
      legacy: 'getPaymentHistory',
      args: [businessNumber, '20260101', '20260131', 2, 20, 'operator'],
      response: { ...rawPage, list: [{ settleCost: '10000', settleState: 1 }] },
      expected: { ...page, items: [{ paymentAmount: '10000', stateCode: 1 }] },
    },
    {
      method: 'getPointPaymentHistoryURL',
      input: business,
      legacy: 'getPaymentURL',
      args: [businessNumber, 'operator'],
      response: 'payment',
      expected: { accessUrl: 'payment' },
    },
    {
      method: 'getPointUseHistory',
      input: { ...history, sortOrder: 'A' },
      legacy: 'getUseHistory',
      args: [businessNumber, '20260101', '20260131', 2, 20, 'A', 'operator'],
      response: { ...rawPage, list: [{ itemCode: 150, txType: 21, txPoint: '-10', balance: '90' }] },
      expected: { ...page, items: [{ serviceCode: 150, transactionTypeCode: 21, transactionPoints: '-10', remainingPoints: '90' }] },
    },
    {
      method: 'getPointUseHistoryURL',
      input: business,
      legacy: 'getUseHistoryURL',
      args: [businessNumber, 'operator'],
      response: 'usage',
      expected: { accessUrl: 'usage' },
    },
    {
      method: 'getRefundablePointBalance',
      input: business,
      legacy: 'getRefundableBalance',
      args: [businessNumber, 'operator'],
      response: { refundableBalance: '100.00' },
      expected: { refundablePoints: '100.00' },
    },
    {
      method: 'requestPointRefund',
      input: {
        ...business,
        contactName: '담당자',
        phoneNumber: '0101',
        requestedPoints: '100',
        bankName: '은행',
        accountNumber: '1234',
        accountHolderName: '예금주',
        reason: '종료',
      },
      legacy: 'refund',
      args: [
        businessNumber,
        { contactname: '담당자', tel: '0101', requestpoint: '100', accountbank: '은행', accountnum: '1234', accountname: '예금주', reason: '종료' },
        'operator',
      ],
      response: { ...success, refundCode: 'R001' },
      expected: { ...operation, refundCode: 'R001' },
    },
    {
      method: 'getPointRefundInfo',
      input: { ...business, refundCode: 'R001' },
      legacy: 'getRefundInfo',
      args: [businessNumber, 'R001', 'operator'],
      response: { requestPoint: '100', state: 4 },
      expected: { requestedPoints: '100', stateCode: 4 },
    },
    {
      method: 'getPointRefundHistory',
      input: { ...business, pageNumber: 2, pageSize: 20 },
      legacy: 'getRefundHistory',
      args: [businessNumber, 2, 20, 'operator'],
      response: { ...rawPage, list: [{ requestPoint: '100', state: 1 }] },
      expected: { ...page, items: [{ requestedPoints: '100', stateCode: 1 }] },
    },
  ]
  for (const entry of cases)
    it(`${entry.method}`, async () => {
      const { mock, service } = facade(entry.legacy, entry.response)
      const before = structuredClone(entry.input)
      const method = service[entry.method] as (input: unknown) => Promise<unknown>
      expect(await method(entry.input)).toEqual(entry.expected)
      expect(mock).toHaveBeenCalledExactlyOnceWith(...entry.args)
      expect(entry.input).toEqual(before)
    })
  it('validates calendar dates and positive integer pagination before invoking compat', async () => {
    const { mock, service } = facade('getPaymentHistory', {})
    await expect(service.getPointPaymentHistory({ ...history, startDate: '20260230' })).rejects.toMatchObject({ stage: 'validate_input' })
    await expect(service.getPointPaymentHistory({ ...history, pageSize: 0 })).rejects.toMatchObject({ stage: 'validate_input' })
    await expect(service.getPointPaymentHistory({ ...history, pageNumber: 1.5 })).rejects.toMatchObject({ stage: 'validate_input' })
    expect(mock).not.toHaveBeenCalled()
  })
  it('leaves the provider page-size limit to the API', async () => {
    const { mock, service } = facade('getPaymentHistory', { ...rawPage, list: [] })
    await expect(service.getPointPaymentHistory({ ...history, pageSize: 1001 })).resolves.toMatchObject({ items: [] })
    expect(mock).toHaveBeenCalledExactlyOnceWith(businessNumber, '20260101', '20260131', 2, 1001, 'operator')
  })
  it('preserves the history message and service user ID from the official HTTP example', async () => {
    const { service } = facade('getUseHistory', {
      ...rawPage,
      message: '검색 완료',
      list: [
        {
          itemCode: 159,
          serviceUserID: '025070000083',
          userID: 'testkorea',
          userName: '담당자명',
          txPoint: '9007199254740993.123',
          balance: '0.00',
          txType: 41,
          txDT: '20260916151124',
        },
      ],
    })
    await expect(service.getPointUseHistory(history)).resolves.toEqual({
      ...page,
      resultMessage: '검색 완료',
      items: [
        {
          serviceCode: 159,
          serviceUserId: '025070000083',
          userId: 'testkorea',
          userName: '담당자명',
          transactionPoints: '9007199254740993.123',
          remainingPoints: '0.00',
          transactionTypeCode: 41,
          transactedAt: '20260916151124',
        },
      ],
    })
  })
  it('reports the failing operation and preserves API error when the hook fails', async () => {
    const onError = vi.fn<() => void>(() => {
      throw new Error('hook')
    })
    const { mock, service } = facade('getCorpInfo', undefined, onError)
    mock.mockRejectedValue({ code: -11000001, message: '원본 오류' })
    await expect(service.getCompanyInfo(business)).rejects.toMatchObject({
      code: -11000001,
      message: '원본 오류',
      operation: 'common.getCompanyInfo',
    })
    expect(onError).toHaveBeenCalledOnce()
  })
})
