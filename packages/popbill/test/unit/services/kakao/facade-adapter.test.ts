/* oxlint-disable vitest/no-conditional-expect -- Each table row specifies the assertions relevant to its API contract. */
import { fileURLToPath } from 'node:url'
import { createKakaoPromiseService } from '@connextable/popbill-compat/factory'
import { createKakaoService } from '@/services/kakao'
import { KAKAO_METHODS } from '@/services/kakao/methods'
import { PopbillErrorStage, PopbillErrorType } from '@/errors'
import type { SendBrandTemplateMessagesRequest } from '@/services/kakao/types'
const filePath = fileURLToPath(new URL('../../../../README.md', import.meta.url))
const config = { LinkID: 'TEST', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const receiver = {
  receiverPhoneNumber: '01012345678',
  receiverName: '수신자',
  messageBody: '본문',
  referenceKey: 'reference',
  adultOnly: false,
  buttons: [{ label: '통화', typeCode: 'TN', phoneNumber: '16008536' }],
  templateVariables: { carousel: [{ content: { 상품: '값' } }] },
}
const request = {
  businessNumber: '1234567890',
  templateCode: 'TPL',
  receiptNumber: 'RECEIPT',
  requestNumber: 'REQUEST',
  senderPhoneNumber: '16008536',
  receiverPhoneNumber: '01012345678',
  receiverName: '수신자',
  messageBody: '본문',
  channelSearchId: '@채널',
  target: 'I' as const,
  recipients: [receiver],
  adultOnly: false,
  fallbackEnabled: false,
  startDate: '20261101',
  endDate: '20261103',
  stateCodes: ['3'],
  messageType: 'ATS',
  filePath,
  filePaths: [filePath],
  fileName: 'file.png',
  fileData: Buffer.from([0, 1, 255]),
  files: [{ fileName: 'file.png', fileData: Buffer.from([0, 1, 255]) }],
  buttons: [{ label: '통화', typeCode: 'TN', phoneNumber: '16008536' }],
  emphasizedTitle: '강조',
}
const cases = [
  ['getBusinessChannelManagementURL', '/KakaoTalk/'],
  ['listBusinessChannels', '/KakaoTalk/ListPlusFriendID'],
  ['getSenderNumberManagementURL', '/Message/'],
  ['listSenderNumbers', '/Message/SenderNumber'],
  ['checkSenderNumberRegistration', '/KakaoTalk/CheckSenderNumber/16008536'],
  ['getNotificationTemplateManagementURL', '/KakaoTalk/'],
  ['getNotificationTemplate', '/KakaoTalk/GetATSTemplate/TPL'],
  ['listNotificationTemplates', '/KakaoTalk/ListATSTemplate'],
  ['getBrandTemplateManagementURL', '/KakaoTalk/'],
  ['getBrandTemplate', '/KakaoTalk/BMSTemplate/TPL'],
  ['listBrandTemplates', '/KakaoTalk/BMSTemplates'],
  ['sendNotificationMessage', '/ATS'],
  ['sendNotificationMessages', '/ATS'],
  ['sendIdenticalNotificationMessages', '/ATS'],
  ['getMessageHistoryURL', '/KakaoTalk/'],
  ['getMessagesByReceiptNumber', '/KakaoTalk/RECEIPT'],
  ['getMessagesByRequestNumber', '/KakaoTalk/Get/REQUEST'],
  ['searchMessages', '/KakaoTalk/Search'],
  ['cancelReservedMessagesByReceiptNumber', '/KakaoTalk/RECEIPT/Cancel'],
  ['cancelReservedMessagesByRequestNumber', '/KakaoTalk/Cancel/REQUEST'],
  ['cancelReservedRecipientByReceiptNumber', '/KakaoTalk/RECEIPT/Cancel'],
  ['cancelReservedRecipientByRequestNumber', '/KakaoTalk/Cancel/REQUEST'],
  ['getMessageUnitCost', '/KakaoTalk/UnitCost'],
  ['getMessageChargeInfo', '/KakaoTalk/ChargeInfo'],
  ['sendBrandTextMessages', '/BMS/Text'],
  ['sendBrandImageMessages', '/BMS/Image'],
  ['sendBrandWideImageMessages', '/BMS/WideImage'],
  ['sendBrandWideListMessages', '/BMS/WideList'],
  ['sendBrandCarouselFeedMessages', '/BMS/CarouselFeed'],
  ['sendBrandCommerceMessages', '/BMS/Commerce'],
  ['sendBrandCarouselCommerceMessages', '/BMS/CarouselCommerce'],
  ['sendBrandTemplateMessages', '/BMS/Variable'],
  ['uploadBrandImageFromPath', '/BMS/Upload/Image/Default'],
  ['uploadBrandImageFromBinary', '/BMS/Upload/Image/Default'],
  ['uploadBrandWideImageFromPath', '/BMS/Upload/Image/WideImage'],
  ['uploadBrandWideImageFromBinary', '/BMS/Upload/Image/WideImage'],
  ['uploadBrandWideListMainImageFromPath', '/BMS/Upload/Image/WideList/Main'],
  ['uploadBrandWideListMainImageFromBinary', '/BMS/Upload/Image/WideList/Main'],
  ['uploadBrandWideListImageFromPath', '/BMS/Upload/Image/WideList'],
  ['uploadBrandWideListImageFromBinary', '/BMS/Upload/Image/WideList'],
  ['uploadBrandCarouselFeedImageFromPath', '/BMS/Upload/Image/CarouselFeed'],
  ['uploadBrandCarouselFeedImageFromBinary', '/BMS/Upload/Image/CarouselFeed'],
  ['uploadBrandCommerceImageFromPath', '/BMS/Upload/Image/Commerce'],
  ['uploadBrandCommerceImageFromBinary', '/BMS/Upload/Image/Commerce'],
  ['uploadBrandCarouselCommerceImageFromPath', '/BMS/Upload/Image/CarouselCommerce'],
  ['uploadBrandCarouselCommerceImageFromBinary', '/BMS/Upload/Image/CarouselCommerce'],
]
const raw = {
  code: 1,
  message: '성공',
  url: 'https://popbill.example.test',
  receiptNum: 'RECEIPT',
  unitCost: '10.00',
  chargeMethod: '선불',
  rateSystem: '정액',
  templateCode: 'TPL',
  state: 0,
  secureYN: false,
  ads: '광고문구',
  stateDT: '20261103120000',
  sendNum: '16008536',
  contentType: 6,
  bmsTemplateCode: 'BTPL',
  sendCnt: '0',
  successCnt: '0',
  msgs: [
    {
      state: 0,
      result: 0,
      altResult: 0,
      contentType: 6,
      receiveNum: '01012345678',
      adultYN: false,
      btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
    },
  ],
  list: [],
  total: 0,
  pageNum: 1,
  perPage: 100,
  pageCount: 0,
  imageUrl: 'https://image.example.test',
  result: [{ formField: 'image_1', imageUrl: 'https://image.example.test' }],
}
function stub(body: unknown, status = 200) {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }), { status: 200 })
    )
    .mockResolvedValueOnce(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
function service(onError?: (error: unknown) => void) {
  return createKakaoService({ compatKakaoService: createKakaoPromiseService(config), defaultUserId: 'kakao-user', onError })
}
afterEach(() => vi.unstubAllGlobals())
describe('modern Kakao client contracts', () => {
  it('exposes current service names without compatibility aliases', () => {
    expect(new Set(cases.map(([method]) => method))).toEqual(new Set(KAKAO_METHODS))
    expect(Object.keys(service())).toHaveLength(46)
    expect(service()).not.toHaveProperty('sendFTS_one')
    expect(service()).not.toHaveProperty('sendBMSText')
  })
  it.each(cases)('%s reaches %s', async (method, path) => {
    const response = method!.startsWith('list') ? [] : raw
    const fetchMock = stub(response)
    const target = service(),
      handler = Reflect.get(target, method!) as (input: unknown) => Promise<unknown>
    await handler(Object.freeze(request))
    const targetRequest = fetchMock.mock.calls[1]![0]
    expect(new URL(targetRequest instanceof Request ? targetRequest.url : targetRequest).pathname).toBe(path)
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('X-PB-UserID')).toBe(method === 'getMessageUnitCost' ? null : 'kakao-user')
    if (method!.startsWith('sendBrand')) {
      const body = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string) as { msgs: unknown[]; altYN: boolean }
      expect(body.msgs).toEqual([
        expect.objectContaining({
          receiveNum: '01012345678',
          interOPRefKey: 'reference',
          adultYN: false,
          btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
        }),
      ])
      expect(body.altYN).toBe(false)
    }
  })
  it('maps emphasis and telephone buttons while retaining the legacy positional order', async () => {
    const fetchMock = stub({ receiptNum: 'R' })
    await expect(service().sendNotificationMessage({ ...request, referenceKey: 'single-ref' })).resolves.toEqual({ receiptNumber: 'R' })
    const body = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string) as { msgs: unknown[] }
    expect(body.msgs).toEqual([
      {
        rcv: '01012345678',
        rcvnm: '수신자',
        msg: '본문',
        emphasizeTitle: '강조',
        interOPRefKey: 'single-ref',
        btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
      },
    ])
  })
  it('preserves numeric zero states, string counts, and brand content details', async () => {
    stub(raw)
    await expect(service().getMessagesByReceiptNumber(request)).resolves.toMatchObject({
      senderPhoneNumber: '16008536',
      contentTypeCode: 6,
      brandTemplateCode: 'BTPL',
      sentCount: '0',
      successCount: '0',
      messages: [
        {
          stateCode: 0,
          resultCode: 0,
          fallbackResultCode: 0,
          contentTypeCode: 6,
          adultOnly: false,
          buttons: [{ label: '통화', phoneNumber: '16008536' }],
        },
      ],
    })
  })
  it('maps multiple image upload results through the HTTP result envelope', async () => {
    stub({
      ...raw,
      result: [
        { formField: 'image_1', imageUrl: 'https://image.example.test/1' },
        { formField: 'image_2', imageUrl: 'https://image.example.test/2' },
      ],
    })
    await expect(service().uploadBrandCarouselFeedImageFromBinary(request)).resolves.toEqual([
      { formField: 'image_1', imageUrl: 'https://image.example.test/1' },
      { formField: 'image_2', imageUrl: 'https://image.example.test/2' },
    ])
  })
  it('validates recipient count before touching the network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(service().sendBrandTextMessages({ ...request, recipients: [] })).rejects.toMatchObject({ operation: 'kakao.sendBrandTextMessages' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('classifies missing JavaScript template arguments as input validation', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      service().getNotificationTemplate({ businessNumber: request.businessNumber, templateCode: undefined as unknown as string })
    ).rejects.toMatchObject({
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('preserves provider errors and isolates a rejected onError hook', async () => {
    stub({ code: -15010023, message: '발신번호 오류' }, 400)
    const onError = vi.fn<(error: unknown) => Promise<void>>(async () => {
      throw new Error('hook')
    })
    await expect(service(onError).sendBrandTextMessages(request)).rejects.toMatchObject({ code: -15010023, operation: 'kakao.sendBrandTextMessages' })
    expect(onError).toHaveBeenCalledOnce()
  })
  it('maps carousel template variables as an array', async () => {
    const fetchMock = stub({ receiptNum: 'R' })
    const input: SendBrandTemplateMessagesRequest = {
      ...request,
      templateVariables: { carousel: [{ content: { 상품: '값' }, buttons: { 링크: '주소' } }] },
    }
    await service().sendBrandTemplateMessages(input)
    const body = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string) as { carouselVariable: unknown }
    expect(body.carouselVariable).toEqual([{ contentVariable: { 상품: '값' }, buttonVariable: { 링크: '주소' } }])
  })
  it('opens the brand template management menu', async () => {
    const fetchMock = stub(raw)
    await service().getBrandTemplateManagementURL(request)
    const target = fetchMock.mock.calls[1]![0]
    expect(new URL(target instanceof Request ? target.url : target).searchParams.get('TG')).toBe('BMS_TEMPLATE')
  })
  it('omits the state filter when querying all provider states', async () => {
    const fetchMock = stub(raw)
    await service().searchMessages({ businessNumber: request.businessNumber, startDate: request.startDate, endDate: request.endDate })
    const target = fetchMock.mock.calls[1]![0]
    expect(new URL(target instanceof Request ? target.url : target).searchParams.has('State')).toBe(false)
  })
  it('forwards provider target and pagination extensions without replacing provider validation', async () => {
    const send = stub(raw)
    await service().sendBrandTextMessages({ ...request, target: 'FUTURE', recipients: Array.from({ length: 1001 }, () => receiver) })
    const body = JSON.parse(send.mock.calls[1]![1]!.body as string)
    expect(body).toMatchObject({ targeting: 'FUTURE' })
    expect(body.msgs).toHaveLength(1001)
    const search = stub(raw)
    await service().searchMessages({ ...request, stateCodes: ['6'], pageSize: 1001 })
    const target = search.mock.calls[1]![0]
    const query = new URL(target instanceof Request ? target.url : target).searchParams
    expect(query.get('State')).toBe('6')
    expect(query.get('PerPage')).toBe('1001')
  })
  it.each(['cancelReservedRecipientByReceiptNumber', 'cancelReservedRecipientByRequestNumber'] as const)(
    '%s uses the current HTTP object body',
    async (method) => {
      const fetchMock = stub(raw)
      await service()[method](request)
      expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string)).toEqual({ receiveNum: request.receiverPhoneNumber })
    }
  )
  it('preserves leading zeros in fallback result codes', async () => {
    stub({ msgs: [{ receiveNum: '01012345678', altResult: '000' }] })
    await expect(service().getMessagesByReceiptNumber(request)).resolves.toMatchObject({ messages: [{ fallbackResultCode: '000' }] })
  })
})
