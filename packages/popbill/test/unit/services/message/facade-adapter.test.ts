import { createMessageService, type MessageService } from '@/services/message'
import { mapSentMessage } from '@/services/message/mappers/response'
type Compat = Parameters<typeof createMessageService>[0]['compatMessageService']
const corp = '1234567890'
const user = 'message-user'
const base = { businessNumber: corp }
const receipt = { ...base, receiptNumber: 'RECEIPT' }
const requestNumber = { ...base, requestNumber: 'REQUEST' }
const message = {
  ...base,
  senderNumber: '07012345678',
  senderName: '발신',
  body: '본문',
  subject: '제목',
  recipients: [{ receiverNumber: '01012345678', receiverName: '수신', referenceKey: 'REF' }],
  requestNumber: 'REQUEST',
  isAdvertisement: false,
  reservedAt: '20261201120000',
}
const recipients = [
  {
    Sender: undefined,
    SenderName: undefined,
    Receiver: '01012345678',
    ReceiverName: '수신',
    Contents: undefined,
    Subject: undefined,
    interOPRefKey: 'REF',
  },
]
const ok = { code: 1, message: 'OK' }
interface Case {
  method: keyof MessageService
  compatMethod: keyof Compat
  input: unknown
  args: unknown[]
  response: unknown
  expected: unknown
}
const cases: Case[] = [
  ...(
    [
      ['sendShortMessage', 'SMS'],
      ['sendLongMessage', 'LMS'],
      ['sendAutoLengthMessage', 'XMS'],
    ] as const
  ).map(([method, type]) => ({
    method,
    compatMethod: 'sendMessage' as const,
    input: message,
    args: [type, corp, message.senderNumber, '발신', '제목', '본문', recipients, '20261201120000', false, 'REQUEST', user],
    response: 'RECEIPT',
    expected: { receiptNumber: 'RECEIPT' },
  })),
  {
    method: 'sendImageMessage',
    compatMethod: 'sendMMS_multi',
    input: { ...message, image: { filePath: '/tmp/image.jpg' } },
    args: [corp, message.senderNumber, '제목', '본문', recipients, '/tmp/image.jpg', '20261201120000', false, 'REQUEST', '발신', user],
    response: 'RECEIPT',
    expected: { receiptNumber: 'RECEIPT' },
  },
  {
    method: 'checkSenderNumber',
    compatMethod: 'checkSenderNumber',
    input: { ...base, senderNumber: '07012345678' },
    args: [corp, '07012345678', user],
    response: ok,
    expected: ok,
  },
  {
    method: 'getSenderNumberRegistrationURL',
    compatMethod: 'getSenderNumberMgtURL',
    input: base,
    args: [corp, user],
    response: 'https://example.test/sender',
    expected: { url: 'https://example.test/sender' },
  },
  {
    method: 'getSenderNumbers',
    compatMethod: 'getSenderNumberList',
    input: base,
    args: [corp, user],
    response: [{ number: '07012345678', representYN: false, state: 1, memo: '주번호' }],
    expected: [{ number: '07012345678', isRepresentative: false, stateCode: 1, memo: '주번호' }],
  },
  {
    method: 'getSentMessageListURL',
    compatMethod: 'getSentListURL',
    input: base,
    args: [corp, user],
    response: 'https://example.test/sent',
    expected: { url: 'https://example.test/sent' },
  },
  {
    method: 'getMessagesByReceiptNumber',
    compatMethod: 'getMessages',
    input: receipt,
    args: [corp, 'RECEIPT', user],
    response: [{ content: '본문', state: 2, result: '000', receiptNum: 'RECEIPT' }],
    expected: [expect.objectContaining({ body: '본문', stateCode: '2', resultCode: '000', receiptNumber: 'RECEIPT' })],
  },
  {
    method: 'getMessagesByRequestNumber',
    compatMethod: 'getMessagesRN',
    input: requestNumber,
    args: [corp, 'REQUEST', user],
    response: [],
    expected: [],
  },
  {
    method: 'searchMessages',
    compatMethod: 'search',
    input: {
      ...base,
      startDate: '20261101',
      endDate: '20261103',
      stateCodes: ['1'],
      messageTypes: ['SMS'],
      isReserved: false,
      sentByCurrentUserOnly: false,
      sortOrder: 'A',
      pageNumber: 2,
      pageSize: 10,
      queryText: '회사',
    },
    args: [corp, '20261101', '20261103', ['1'], ['SMS'], false, false, 'A', 2, 10, '회사', user],
    response: { ...ok, total: 0, perPage: 10, pageNum: 2, pageCount: 0, list: [] },
    expected: { ...ok, totalCount: 0, pageSize: 10, pageNumber: 2, pageCount: 0, items: [] },
  },
  {
    method: 'cancelScheduledMessagesByReceiptNumber',
    compatMethod: 'cancelReserve',
    input: receipt,
    args: [corp, 'RECEIPT', user],
    response: ok,
    expected: ok,
  },
  {
    method: 'cancelScheduledMessagesByRequestNumber',
    compatMethod: 'cancelReserveRN',
    input: requestNumber,
    args: [corp, 'REQUEST', user],
    response: ok,
    expected: ok,
  },
  {
    method: 'cancelScheduledRecipientByReceiptNumber',
    compatMethod: 'cancelReservebyRCV',
    input: { ...receipt, receiverNumber: '01012345678' },
    args: [corp, 'RECEIPT', '01012345678', user],
    response: ok,
    expected: ok,
  },
  {
    method: 'cancelScheduledRecipientByRequestNumber',
    compatMethod: 'cancelReserveRNbyRCV',
    input: { ...requestNumber, receiverNumber: '01012345678' },
    args: [corp, 'REQUEST', '01012345678', user],
    response: ok,
    expected: ok,
  },
  {
    method: 'getDeniedNumbers',
    compatMethod: 'getAutoDenyList',
    input: base,
    args: [corp, user],
    response: [{ number: '01012345678', regDT: '20261103120000' }],
    expected: [{ number: '01012345678', registeredAt: '20261103120000' }],
  },
  {
    method: 'getDenyNumberInfo',
    compatMethod: 'checkAutoDenyNumber',
    input: base,
    args: [corp, user],
    response: { smsdenyNumber: '08012345678', regDT: '20261103120000' },
    expected: { number: '08012345678', registeredAt: '20261103120000' },
  },
  {
    method: 'getChargeInfo',
    compatMethod: 'getChargeInfo',
    input: { ...base, messageType: 'SMS' },
    args: [corp, 'SMS', user],
    response: { unitCost: '8.00', chargeMethod: '연동', rateSystem: '종량제' },
    expected: { unitCost: '8.00', chargeMethod: '연동', rateSystem: '종량제' },
  },
  {
    method: 'getUnitCost',
    compatMethod: 'getUnitCost',
    input: { ...base, messageType: 'MMS' },
    args: [corp, 'MMS'],
    response: '70.00',
    expected: { unitCost: '70.00' },
  },
]
describe('modern message DTO contracts', () => {
  it.each(cases)('$method maps input and output', async (testCase) => {
    const spy = vi.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue(testCase.response)
    const compat = { [testCase.compatMethod]: spy } as unknown as Compat
    const service = createMessageService({ compatMessageService: compat, defaultUserId: user })
    expect(await Reflect.apply(service[testCase.method], service, [testCase.input])).toEqual(testCase.expected)
    expect(spy).toHaveBeenCalledExactlyOnceWith(...testCase.args)
  })
  it('supports binary images and preserves input references', async () => {
    const spy = vi.fn<(...args: unknown[]) => Promise<string>>().mockResolvedValue('BINARY')
    const compat = { sendMMSBinary_multi: spy } as unknown as Compat
    const bytes = Buffer.from([0, 1, 255])
    const input = Object.freeze({
      ...message,
      recipients: Object.freeze(message.recipients.map((value) => Object.freeze(value))),
      image: Object.freeze({ fileName: '사진.jpg', fileData: bytes }),
    })
    const service = createMessageService({ compatMessageService: compat, defaultUserId: user })
    expect(await service.sendImageMessage(input)).toEqual({ receiptNumber: 'BINARY' })
    expect(spy.mock.calls[0]?.[5]).toEqual({ fileName: '사진.jpg', fileData: bytes })
    expect(spy.mock.calls[0]?.[4]).not.toBe(input.recipients)
  })
  it('normalizes the documented null sender memo', async () => {
    const getSenderNumberList = vi
      .fn<Compat['getSenderNumberList']>()
      .mockResolvedValue([{ number: '07012345678', representYN: false, state: 1, memo: null }])
    const service = createMessageService({ compatMessageService: { getSenderNumberList } as unknown as Compat, defaultUserId: user })
    expect(await service.getSenderNumbers(base)).toEqual([{ number: '07012345678', isRepresentative: false, stateCode: 1, memo: undefined }])
  })
  it('preserves all result fields and zero result codes', () => {
    expect(
      mapSentMessage({
        subject: '제목',
        content: '내용',
        sendNum: '1',
        senderName: '발신',
        receiveNum: '2',
        receiveName: '수신',
        receiptDT: '1',
        sendDT: '2',
        resultDT: '3',
        reserveDT: '4',
        state: 0,
        result: 0,
        type: 'SMS',
        tranNet: 'SKT',
        receiptNum: 'R',
        requestNum: 'Q',
        interOPRefKey: 'I',
      })
    ).toEqual({
      subject: '제목',
      body: '내용',
      senderNumber: '1',
      senderName: '발신',
      receiverNumber: '2',
      receiverName: '수신',
      receivedAt: '1',
      sentAt: '2',
      resultReceivedAt: '3',
      reservedAt: '4',
      stateCode: '0',
      resultCode: '0',
      messageType: 'SMS',
      carrierName: 'SKT',
      receiptNumber: 'R',
      requestNumber: 'Q',
      referenceKey: 'I',
    })
  })
  it('keeps API failures when an error hook throws or rejects', async () => {
    for (const onError of [
      () => {
        throw new Error('hook')
      },
      async () => {
        throw new Error('hook')
      },
    ]) {
      const compat = { getUnitCost: vi.fn<Compat['getUnitCost']>().mockRejectedValue({ code: -10000001, message: '실패' }) } as unknown as Compat
      const service = createMessageService({ compatMessageService: compat, defaultUserId: user, onError })
      await expect(service.getUnitCost({ ...base, messageType: 'SMS' })).rejects.toMatchObject({
        code: -10000001,
        message: '실패',
        operation: 'message.getUnitCost',
      })
    }
  })
  it('keeps client user identities isolated', async () => {
    const spy = vi.fn<(...args: unknown[]) => Promise<typeof ok>>().mockResolvedValue(ok)
    const compat = { checkSenderNumber: spy } as unknown as Compat
    await createMessageService({ compatMessageService: compat, defaultUserId: 'one' }).checkSenderNumber({ ...base, senderNumber: '1' })
    await createMessageService({ compatMessageService: compat, defaultUserId: 'two' }).checkSenderNumber({ ...base, senderNumber: '2' })
    expect(spy.mock.calls).toEqual([
      [corp, '1', 'one'],
      [corp, '2', 'two'],
    ])
  })
})
