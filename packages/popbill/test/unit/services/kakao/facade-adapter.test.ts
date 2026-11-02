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
  ['sendFriendTextMessage', '/FTS'],
  ['sendFriendTextMessages', '/FTS'],
  ['sendIdenticalFriendTextMessages', '/FTS'],
  ['sendFriendImageMessage', '/FMS'],
  ['sendFriendImageMessages', '/FMS'],
  ['sendIdenticalFriendImageMessages', '/FMS'],
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
    expect(Object.keys(service())).toHaveLength(52)
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
  it('preserves friendtalk single-recipient references and send options through the full legacy tuple', async () => {
    const fetchMock = stub({ receiptNum: 'R' })
    await expect(
      service().sendFriendTextMessage({
        ...request,
        referenceKey: 'single-friend',
        fallbackSubject: '대체 제목',
        fallbackBody: '대체 본문',
        fallbackType: 'A',
        reserveDateTime: '20261104120000',
        advertising: false,
      })
    ).resolves.toEqual({ receiptNumber: 'R' })
    expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string)).toEqual({
      plusFriendID: '@채널',
      snd: '16008536',
      content: '본문',
      altSubject: '대체 제목',
      altContent: '대체 본문',
      altSendType: 'A',
      sndDT: '20261104120000',
      adsYN: false,
      requestNum: 'REQUEST',
      msgs: [
        {
          rcv: '01012345678',
          rcvnm: '수신자',
          msg: '본문',
          altsjt: '대체 제목',
          altmsg: '대체 본문',
          interOPRefKey: 'single-friend',
          btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
        },
      ],
      btns: [{ t: 'TN', n: '통화', telNum: '16008536' }],
    })
  })
  it('keeps friendtalk personalized content on each recipient and shared content on the send request', async () => {
    const recipients = [
      { ...receiver, messageBody: '첫 본문', fallbackSubject: '첫 제목', fallbackBody: '첫 대체문자' },
      { receiverPhoneNumber: '01098765432', messageBody: '둘째 본문', referenceKey: 'second-ref' },
    ]
    const personalized = stub({ receiptNum: 'P' })
    await service().sendFriendTextMessages({ ...request, recipients })
    expect(JSON.parse(personalized.mock.calls[1]![1]!.body as string)).toEqual({
      plusFriendID: '@채널',
      snd: '16008536',
      requestNum: 'REQUEST',
      msgs: [
        {
          rcv: '01012345678',
          rcvnm: '수신자',
          msg: '첫 본문',
          altsjt: '첫 제목',
          altmsg: '첫 대체문자',
          interOPRefKey: 'reference',
          btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
        },
        { rcv: '01098765432', msg: '둘째 본문', interOPRefKey: 'second-ref' },
      ],
      btns: [{ t: 'TN', n: '통화', telNum: '16008536' }],
    })
    const shared = stub({ receiptNum: 'S' })
    await service().sendIdenticalFriendTextMessages({
      ...request,
      fallbackSubject: '공통 제목',
      fallbackBody: '공통 대체문자',
      recipients: [{ receiverPhoneNumber: '01098765432', referenceKey: 'shared-ref' }],
    })
    expect(JSON.parse(shared.mock.calls[1]![1]!.body as string)).toMatchObject({
      content: '본문',
      altSubject: '공통 제목',
      altContent: '공통 대체문자',
      msgs: [{ rcv: '01098765432', interOPRefKey: 'shared-ref' }],
    })
  })
  it.each(['sendFriendImageMessage', 'sendFriendImageMessages', 'sendIdenticalFriendImageMessages'] as const)(
    '%s uploads the image file and keeps the image click URL in the JSON form',
    async (method) => {
      const fetchMock = stub({ receiptNum: 'IMAGE' })
      await expect(
        service()[method]({
          ...request,
          referenceKey: 'image-ref',
          imageLink: 'https://www.popbill.com/',
          advertising: false,
          fallbackSubject: '이미지 대체 제목',
          fallbackBody: '이미지 대체문자',
          fallbackType: 'A',
          reserveDateTime: '20261104120000',
        })
      ).resolves.toEqual({ receiptNumber: 'IMAGE' })
      const init = fetchMock.mock.calls[1]![1]!
      const form = await new Response(init.body, { headers: init.headers }).formData()
      const body = JSON.parse(form.get('form') as string)
      expect(body).toMatchObject({
        plusFriendID: '@채널',
        snd: '16008536',
        imageURL: 'https://www.popbill.com/',
        adsYN: false,
        altSendType: 'A',
        sndDT: '20261104120000',
        requestNum: 'REQUEST',
        msgs: [expect.objectContaining({ rcv: '01012345678' })],
        btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
      })
      if (method === 'sendFriendImageMessages') {
        expect(body).not.toHaveProperty('content')
        expect(body).not.toHaveProperty('altSubject')
      } else {
        expect(body).toMatchObject({ content: '본문', altSubject: '이미지 대체 제목', altContent: '이미지 대체문자' })
      }
      const image = form.get('file') as File
      expect(image.name).toBe('README.md')
      expect(await image.text()).toContain('@connextable/popbill')
    }
  )
  it.each(['sendFriendImageMessage', 'sendFriendImageMessages', 'sendIdenticalFriendImageMessages'] as const)(
    '%s rejects a missing file before any accidental text send',
    async (method) => {
      const fetchMock = vi.fn<typeof fetch>()
      vi.stubGlobal('fetch', fetchMock)
      await expect(service()[method]({ ...request, filePath: undefined as unknown as string })).rejects.toMatchObject({
        type: PopbillErrorType.InputValidation,
        stage: PopbillErrorStage.ValidateInput,
        operation: `kakao.${method}`,
      })
      expect(fetchMock).not.toHaveBeenCalled()
    }
  )
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
