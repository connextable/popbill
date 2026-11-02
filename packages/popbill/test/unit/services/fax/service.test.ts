import type { FaxPromiseService } from '@connextable/popbill-compat/factory'
import { createFaxService } from '@/services/fax'
import { FAX_METHODS } from '@/services/fax/methods'
import type { FaxService } from '@/services/fax'

const businessNumber = '1234567890'
const userId = 'fax-user'
const ok = { code: 1, message: 'Success' }
const url = 'https://example.test/fax'
const raw = {
  state: 3,
  result: 0,
  sendNum: '0211111111',
  receiveNum: '0222222222',
  receiveNumType: '일반' as const,
  receiveName: '고객',
  successPageCnt: 0,
  requestNum: 'REQ-1',
  receiptNum: 'RECEIPT-1',
  reserveDT: null,
  tiffFileSize: '0',
  fileNames: ['sample.txt'],
}

function setup(onError?: (error: unknown) => void) {
  const compat = {
    getChargeInfo: vi.fn<FaxPromiseService['getChargeInfo']>().mockResolvedValue({ unitCost: '50', chargeMethod: '연동', rateSystem: '종량제' }),
    getUnitCost: vi.fn<FaxPromiseService['getUnitCost']>().mockResolvedValue('50'),
    checkSenderNumber: vi.fn<FaxPromiseService['checkSenderNumber']>().mockResolvedValue(ok),
    sendFax: vi.fn<FaxPromiseService['sendFax']>().mockResolvedValue('RECEIPT-1'),
    sendFaxBinary: vi.fn<FaxPromiseService['sendFaxBinary']>().mockResolvedValue('RECEIPT-1'),
    resendFax: vi.fn<FaxPromiseService['resendFax']>().mockResolvedValue('RECEIPT-2'),
    resendFaxRN: vi.fn<FaxPromiseService['resendFaxRN']>().mockResolvedValue('RECEIPT-2'),
    getFaxResult: vi.fn<FaxPromiseService['getFaxResult']>().mockResolvedValue([raw]),
    getFaxResultRN: vi.fn<FaxPromiseService['getFaxResultRN']>().mockResolvedValue([raw]),
    getURL: vi.fn<FaxPromiseService['getURL']>().mockResolvedValue(url),
    getSentListURL: vi.fn<FaxPromiseService['getSentListURL']>().mockResolvedValue(url),
    getSenderNumberMgtURL: vi.fn<FaxPromiseService['getSenderNumberMgtURL']>().mockResolvedValue(url),
    cancelReserve: vi.fn<FaxPromiseService['cancelReserve']>().mockResolvedValue(ok),
    cancelReserveRN: vi.fn<FaxPromiseService['cancelReserveRN']>().mockResolvedValue(ok),
    search: vi.fn<FaxPromiseService['search']>().mockResolvedValue({ ...ok, total: 1, perPage: 500, pageNum: 1, pageCount: 1, list: [raw] }),
    getSenderNumberList: vi
      .fn<FaxPromiseService['getSenderNumberList']>()
      .mockResolvedValue([{ number: '0211111111', representYN: false, state: 1, memo: null }]),
    getPreviewURL: vi.fn<FaxPromiseService['getPreviewURL']>().mockResolvedValue(url),
  }
  return { compat, service: createFaxService({ compatFaxService: compat, defaultUserId: userId, onError }) }
}

describe('fax modern API', () => {
  test('exposes 16 explicit methods without generic legacy screen aliases', () => {
    expect(Object.keys(setup().service).sort()).toEqual([...FAX_METHODS].sort())
    expect(FAX_METHODS).toHaveLength(16)
  })
  test('maps sending objects without mutating caller recipients or files', async () => {
    const { compat, service } = setup()
    const recipients = Object.freeze([Object.freeze({ phoneNumber: '0222222222', name: '고객', partnerReferenceKey: 'ROW-1' })])
    const filePaths = Object.freeze(['/tmp/sample.pdf'])
    const base = {
      businessNumber,
      senderPhoneNumber: '0211111111',
      senderName: '발신자',
      recipients,
      scheduledAt: '20261201120000',
      isAdvertisement: false,
      title: '안내',
      requestNumber: 'REQ-1',
    }
    await expect(service.sendFaxFromPaths({ ...base, filePaths })).resolves.toEqual({ receiptNumber: 'RECEIPT-1' })
    expect(compat.sendFax).toHaveBeenCalledWith(businessNumber, {
      SenderNum: '0211111111',
      SenderName: '발신자',
      Receiver: [{ receiveNum: '0222222222', receiveName: '고객', interOPRefKey: 'ROW-1' }],
      ReserveDT: '20261201120000',
      AdsYN: false,
      Title: '안내',
      RequestNum: 'REQ-1',
      UserID: userId,
      FilePaths: ['/tmp/sample.pdf'],
    })
    const files = Object.freeze([Object.freeze({ fileName: 'sample.pdf', fileData: Buffer.from('fax') })])
    await expect(service.sendFaxFromBinary({ ...base, files })).resolves.toEqual({ receiptNumber: 'RECEIPT-1' })
    expect(compat.sendFaxBinary).toHaveBeenCalledWith(
      businessNumber,
      expect.objectContaining({ BinaryFiles: [{ fileName: 'sample.pdf', fileData: Buffer.from('fax') }], UserID: userId })
    )
    expect(recipients[0]!.phoneNumber).toBe('0222222222')
  })
  test('resend retains old recipients when omitted and forwards overrides when supplied', async () => {
    const { compat, service } = setup()
    await expect(service.resendFaxByReceipt({ businessNumber, receiptNumber: 'RECEIPT-1' })).resolves.toEqual({ receiptNumber: 'RECEIPT-2' })
    expect(compat.resendFax).toHaveBeenCalledWith(
      businessNumber,
      expect.objectContaining({ ReceiptNum: 'RECEIPT-1', Receiver: undefined, UserID: userId })
    )
    await expect(
      service.resendFaxByRequest({
        businessNumber,
        requestNumber: 'REQ-1',
        newRequestNumber: 'REQ-2',
        scheduledAt: '20261201120000',
        recipients: [{ phoneNumber: '0233333333', name: '다른 고객' }],
      })
    ).resolves.toEqual({ receiptNumber: 'RECEIPT-2' })
    expect(compat.resendFaxRN).toHaveBeenCalledWith(
      businessNumber,
      expect.objectContaining({
        OrgRequestNum: 'REQ-1',
        RequestNum: 'REQ-2',
        ReserveDT: '20261201120000',
        Receiver: [{ receiveNum: '0233333333', receiveName: '다른 고객', interOPRefKey: undefined }],
      })
    )
  })
  test.each([
    ['checkSenderNumber', { businessNumber, senderPhoneNumber: '0211111111' }, 'checkSenderNumber', [businessNumber, '0211111111', userId], ok],
    ['getFaxSenderRegistrationURL', { businessNumber }, 'getSenderNumberMgtURL', [businessNumber, userId], { url }],
    ['getSentFaxListURL', { businessNumber }, 'getSentListURL', [businessNumber, userId], { url }],
    ['getFaxPreviewURL', { businessNumber, receiptNumber: 'RECEIPT-1' }, 'getPreviewURL', [businessNumber, 'RECEIPT-1', userId], { url }],
    ['cancelScheduledFaxByReceipt', { businessNumber, receiptNumber: 'RECEIPT-1' }, 'cancelReserve', [businessNumber, 'RECEIPT-1', userId], ok],
    ['cancelScheduledFaxByRequest', { businessNumber, requestNumber: 'REQ-1' }, 'cancelReserveRN', [businessNumber, 'REQ-1', userId], ok],
    ['getUnitCost', { businessNumber, receiveNumberType: '지능' }, 'getUnitCost', [businessNumber, '지능', userId], { unitCost: '50' }],
    [
      'getChargeInfo',
      { businessNumber, receiveNumberType: '일반' },
      'getChargeInfo',
      [businessNumber, '일반', userId],
      { unitCost: '50', chargeMethod: '연동', rateSystem: '종량제' },
    ],
  ] as const)('%s forwards explicit identifiers and the configured user', async (method, input, compatMethod, args, expected) => {
    const { service, compat } = setup()
    const fn = Reflect.get(service, method) as (value: unknown) => Promise<unknown>
    await expect(fn(input)).resolves.toEqual(expected)
    expect(compat[compatMethod]).toHaveBeenCalledWith(...args)
  })
  test.each(['getFaxResultsByReceipt', 'getFaxResultsByRequest'] as const)(
    '%s maps codes, nulls and decimal strings without losing zero',
    async (method) => {
      const { service, compat } = setup()
      const value =
        method === 'getFaxResultsByReceipt'
          ? await service[method]({ businessNumber, receiptNumber: 'RECEIPT-1' })
          : await service[method]({ businessNumber, requestNumber: 'REQ-1' })
      expect(value).toMatchObject([
        {
          stateCode: 3,
          resultCode: 0,
          recipientPhoneNumber: '0222222222',
          recipientName: '고객',
          successfulPageCount: 0,
          convertedFileSize: '0',
          scheduledAt: undefined,
          fileNames: ['sample.txt'],
        },
      ])
      expect(method === 'getFaxResultsByReceipt' ? compat.getFaxResult : compat.getFaxResultRN).toHaveBeenCalledWith(
        businessNumber,
        method === 'getFaxResultsByReceipt' ? 'RECEIPT-1' : 'REQ-1',
        userId
      )
      value[0]!.fileNames!.push('changed')
      expect(raw.fileNames).toEqual(['sample.txt'])
    }
  )
  test('maps sender list and keeps false', async () => {
    const { service, compat } = setup()
    await expect(service.getSenderNumbers({ businessNumber })).resolves.toEqual([
      { phoneNumber: '0211111111', isRepresentative: false, stateCode: 1, memo: undefined },
    ])
    expect(compat.getSenderNumberList).toHaveBeenCalledWith(businessNumber, userId)
  })
  test('search applies provider defaults, false filters and paging response names', async () => {
    const { service, compat } = setup()
    const value = await service.searchFaxes({
      businessNumber,
      startDate: ' 20261101 ',
      endDate: '20261103',
      scheduledOnly: false,
      currentUserOnly: false,
      stateCodes: ['1', '4'],
    })
    expect(compat.search).toHaveBeenCalledWith(businessNumber, '20261101', '20261103', ['1', '4'], false, false, 'D', 1, 500, undefined, userId)
    expect(value).toMatchObject({ totalCount: 1, pageNumber: 1, pageSize: 500, pageCount: 1, items: [{ stateCode: 3 }] })
  })
  test.each([
    { startDate: '20260230', endDate: '20260301' },
    { startDate: '20261103', endDate: '20261101' },
    { startDate: '20261101', endDate: '20261103', pageNumber: 0 },
    { startDate: '20261101', endDate: '20261103', pageSize: 0 },
  ])('rejects invalid search before the compat boundary', async (range) => {
    const { service, compat } = setup()
    await expect(service.searchFaxes({ businessNumber, ...range })).rejects.toMatchObject({ operation: 'fax.searchFaxes' })
    expect(compat.search).not.toHaveBeenCalled()
  })
  test('forwards provider state extensions and pagination limits to the provider', async () => {
    const { service, compat } = setup()
    await service.searchFaxes({ businessNumber, startDate: '20261101', endDate: '20261103', stateCodes: ['6'], pageSize: 1001 })
    expect(compat.search).toHaveBeenCalledWith(businessNumber, '20261101', '20261103', ['6'], undefined, undefined, 'D', 1, 1001, undefined, userId)
  })
  test('onError exceptions and rejected promises do not replace API errors', async () => {
    const { service, compat } = setup(() => {
      throw new Error('hook error')
    })
    compat.cancelReserve.mockRejectedValue({ code: -16010001, message: 'cannot cancel' })
    await expect(service.cancelScheduledFaxByReceipt({ businessNumber, receiptNumber: 'RECEIPT-1' })).rejects.toMatchObject({
      code: -16010001,
      message: 'cannot cancel',
      operation: 'fax.cancelScheduledFaxByReceipt',
    })
    const asynchronous = setup(() => Promise.reject(new Error('hook rejection')))
    asynchronous.compat.getFaxResult.mockRejectedValue({ code: -16000002, message: 'receipt missing' })
    await expect(asynchronous.service.getFaxResultsByReceipt({ businessNumber, receiptNumber: 'missing' })).rejects.toMatchObject({ code: -16000002 })
  })
  test('client service satisfies the complete public type', () => {
    expectTypeOf(setup().service).toEqualTypeOf<FaxService>()
  })
})
