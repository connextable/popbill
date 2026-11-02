/* oxlint-disable vitest/no-conditional-expect -- Each table row specifies the assertions relevant to its API contract. */
import { fileURLToPath } from 'node:url'
import { createKakaoPromiseService, createKakaoService } from '@/services/kakao'
import { KAKAO_METHODS } from '@/services/kakao/methods'
const corp = '1234567890',
  user = 'kakao-user'
const config = { LinkID: 'TEST', SecretKey: Buffer.from('secret').toString('base64'), IsTest: true }
const ok = { code: 1, message: '성공' }
const targetUrl = 'https://popbill.example.test/temporary'
const filePath = fileURLToPath(new URL('../../README.md', import.meta.url))
const receiver = {
  rcv: '01012345678',
  rcvnm: '수신자',
  msg: '내용',
  altsjt: '제목',
  altmsg: '대체',
  interOPRefKey: 'ref',
  btns: [{ n: '통화', t: 'TN', telNum: '16008536' }],
  emphasizeTitle: '강조',
}
const buttons = [{ n: '조회', t: 'WL', u1: 'https://example.test', tg: 'out' }]
const brand = {
  plusFriendID: '@채널',
  targeting: 'O',
  adultYN: false,
  content: '내용',
  altYN: false,
  requestNum: 'REQ1',
  receivers: [{ receiveNum: '01012345678', interOPRefKey: 'ref' }],
  btns: buttons,
  imageUrl: 'https://image.example.test',
  imageLink: 'https://example.test',
  header: '제목',
  item: [],
  commerce: { title: '상품', regularPrice: 1000, discountType: 'R', discount: 10 },
  carousel: [],
  head: { header: '제목', content: '내용', imageUrl: 'https://image.example.test' },
  tail: { linkMobile: 'https://example.test' },
  templateCode: 'TEMPLATE',
  contentVariable: { 상품: '값' },
  carouselVariable: [{ contentVariable: { 상품: '값' } }],
}
type Case = {
  method: string
  args: unknown[]
  path: string
  response?: unknown
  expected?: unknown
  verb?: string
  body?: unknown
  query?: Record<string, string>
  multipartField?: string
  fileCount?: number
}
const cases: Case[] = [
  { method: 'getURL', args: ['SENDER', user], path: '/Message/', query: { TG: 'SENDER' }, response: { url: targetUrl }, expected: targetUrl },
  ...[
    ['getPlusFriendMgtURL', '/KakaoTalk/', 'PLUSFRIEND'],
    ['getSenderNumberMgtURL', '/Message/', 'SENDER'],
    ['getATSTemplateMgtURL', '/KakaoTalk/', 'TEMPLATE'],
    ['getBMSTemplateMgtURL', '/KakaoTalk/', 'BMS_TEMPLATE'],
    ['getSentListURL', '/KakaoTalk/', 'BOX'],
  ].map(([method, path, TG]) => ({
    method: method!,
    path: path!,
    args: [user],
    query: { TG: TG! },
    response: { url: targetUrl },
    expected: targetUrl,
  })),
  ...[
    ['listPlusFriendID', '/KakaoTalk/ListPlusFriendID'],
    ['getSenderNumberList', '/Message/SenderNumber'],
    ['listATSTemplate', '/KakaoTalk/ListATSTemplate'],
    ['listBMSTemplate', '/KakaoTalk/BMSTemplates'],
  ].map(([method, path]) => ({ method: method!, path: path!, args: [user], response: [] })),
  { method: 'getATSTemplate', args: ['A/B', user], path: '/KakaoTalk/GetATSTemplate/A%2FB', response: { templateCode: 'A/B' } },
  { method: 'getBMSTemplate', args: ['B/C', user], path: '/KakaoTalk/BMSTemplate/B%2FC', response: { templateCode: 'B/C' } },
  { method: 'checkSenderNumber', args: ['16008536', user], path: '/KakaoTalk/CheckSenderNumber/16008536', response: { code: 0, message: '미등록' } },
  {
    method: 'sendATS_one',
    args: ['TPL', '16008536', '내용', '제목', '대체', 'A', '20261104120000', receiver.rcv, receiver.rcvnm, user, 'REQ1', buttons],
    path: '/ATS',
    verb: 'POST',
    body: {
      templateCode: 'TPL',
      snd: '16008536',
      content: '내용',
      altSubject: '제목',
      altContent: '대체',
      altSendType: 'A',
      sndDT: '20261104120000',
      requestNum: 'REQ1',
      msgs: [{ rcv: receiver.rcv, rcvnm: receiver.rcvnm, msg: '내용', altsjt: '제목', altmsg: '대체' }],
      btns: buttons,
    },
    response: { receiptNum: 'RECEIPT' },
    expected: 'RECEIPT',
  },
  {
    method: 'sendATS_same',
    args: ['TPL', '16008536', '내용', '제목', '대체', 'A', '20261104120000', [receiver], user, 'REQ1', buttons],
    path: '/ATS',
    verb: 'POST',
    body: {
      templateCode: 'TPL',
      snd: '16008536',
      content: '내용',
      altSubject: '제목',
      altContent: '대체',
      altSendType: 'A',
      sndDT: '20261104120000',
      requestNum: 'REQ1',
      msgs: [receiver],
      btns: buttons,
    },
    response: { receiptNum: 'RECEIPT' },
    expected: 'RECEIPT',
  },
  {
    method: 'sendATS_multi',
    args: ['TPL', '16008536', 'A', '20261104120000', [receiver], user, 'REQ1', buttons],
    path: '/ATS',
    verb: 'POST',
    body: { templateCode: 'TPL', snd: '16008536', altSendType: 'A', sndDT: '20261104120000', requestNum: 'REQ1', msgs: [receiver], btns: buttons },
    response: { receiptNum: 'RECEIPT' },
    expected: 'RECEIPT',
  },
  ...['getMessages', 'getMessagesRN', 'cancelReserve', 'cancelReserveRN', 'cancelReservebyRCV', 'cancelReserveRNbyRCV'].map((method) => ({
    method,
    args: method.includes('byRCV') ? ['KEY/1', '01012345678', user] : ['KEY/1', user],
    path: method.includes('RN')
      ? method.startsWith('cancel')
        ? '/KakaoTalk/Cancel/KEY%2F1'
        : '/KakaoTalk/Get/KEY%2F1'
      : '/KakaoTalk/KEY%2F1' + (method.startsWith('cancel') ? '/Cancel' : ''),
    verb: method.includes('byRCV') ? 'POST' : 'GET',
    body: method.includes('byRCV') ? { receiveNum: '01012345678' } : undefined,
    response: method.startsWith('get') ? { msgs: [] } : ok,
  })),
  {
    method: 'search',
    args: ['20261101', '20261103', ['3'], ['ATS'], '0', false, 2, 30, 'D', '검색 &/문자', user, '@채널', ['1', '6']],
    path: '/KakaoTalk/Search',
    query: {
      SDate: '20261101',
      EDate: '20261103',
      State: '3',
      Item: 'ATS',
      ReserveYN: '0',
      SenderOnly: '0',
      Page: '2',
      PerPage: '30',
      Order: 'D',
      QString: '검색 &/문자',
      PlusFriendID: '@채널',
      ContentType: '1,6',
    },
    response: { ...ok, list: [], total: 0, pageNum: 2, perPage: 30, pageCount: 0 },
  },
  { method: 'getUnitCost', args: ['BMS'], path: '/KakaoTalk/UnitCost', query: { Type: 'BMS' }, response: { unitCost: '10.00' }, expected: '10.00' },
  {
    method: 'getChargeInfo',
    args: ['BMS', user],
    path: '/KakaoTalk/ChargeInfo',
    query: { Type: 'BMS' },
    response: { unitCost: '10.00', chargeMethod: '선불', rateSystem: '정액' },
  },
]
for (const type of ['FTS', 'FMS'])
  for (const form of ['one', 'multi', 'same']) {
    const method = 'send' + type + '_' + form
    const canonical =
      form === 'one'
        ? ['@채널', '16008536', '내용', '제목', '대체', 'A', '20261104120000', receiver.rcv, receiver.rcvnm, false]
        : form === 'same'
          ? ['@채널', '16008536', '내용', '제목', '대체', 'A', '20261104120000', false]
          : ['@채널', '16008536', 'A', '20261104120000', false]
    if (type === 'FMS') canonical.push('https://image.example.test', filePath)
    if (form !== 'one') canonical.push([receiver] as never)
    canonical.push(buttons as never, user, 'REQ1')
    cases.push({
      method,
      args: canonical,
      path: '/' + type,
      verb: 'POST',
      response: { receiptNum: 'RECEIPT' },
      expected: 'RECEIPT',
      ...(type === 'FMS' ? { multipartField: 'file', fileCount: 1 } : {}),
    })
  }
for (const kind of ['Text', 'Image', 'WideImage', 'WideList', 'CarouselFeed', 'Commerce', 'CarouselCommerce', 'Variable'])
  cases.push({
    method: 'sendBMS' + kind,
    args: [brand, user],
    path: '/BMS/' + kind,
    verb: 'POST',
    response: { receiptNum: 'BRAND' },
    expected: 'BRAND',
  })
for (const [kind, path, multiple] of [
  ['Image', 'Default', false],
  ['WideImage', 'WideImage', false],
  ['WideListMainImage', 'WideList/Main', false],
  ['WideListImage', 'WideList', true],
  ['CarouselFeedImage', 'CarouselFeed', true],
  ['CommerceImage', 'Commerce', false],
  ['CarouselCommerceImage', 'CarouselCommerce', true],
] as const) {
  for (const binary of [false, true]) {
    const file = { fileName: 'image"\r\n.png', fileData: Buffer.from([0, 1, 2, 255]) }
    cases.push({
      method: 'upload' + kind + (binary ? 'Binary' : ''),
      args: [binary ? (multiple ? [file, file] : file) : multiple ? [filePath, filePath] : filePath, user],
      path: '/BMS/Upload/Image/' + path,
      verb: 'POST',
      response: multiple ? { ...ok, result: [{ formField: 'image_1', imageUrl: targetUrl }] } : { ...ok, imageUrl: targetUrl },
      multipartField: multiple ? 'images' : 'image',
      fileCount: multiple ? 2 : 1,
    })
  }
}
function stub(body: unknown, status = 200) {
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ session_token: 'token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }), { status: 200 })
    )
    .mockResolvedValueOnce(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }))
  vi.stubGlobal('fetch', mock)
  return mock
}
function call(service: object, name: string, args: unknown[]): unknown {
  return Reflect.apply(Reflect.get(service, name) as (...args: unknown[]) => unknown, service, args)
}
afterEach(() => vi.unstubAllGlobals())
describe('KakaoService independently specified HTTP contracts', () => {
  it('covers every legacy and current service method', () => {
    expect(new Set(cases.map((item) => item.method))).toEqual(new Set(KAKAO_METHODS))
    expect(cases).toHaveLength(53)
  })
  it.each(cases)('$method', async (row) => {
    const mock = stub(row.response ?? ok),
      service = createKakaoPromiseService(config)
    const result = await call(service, row.method, [corp, ...row.args])
    expect(result).toEqual(row.expected ?? row.response ?? ok)
    const first = mock.mock.calls[0]![1]!,
      token = JSON.parse(first.body as string) as { scope: string[] }
    expect(token.scope).toEqual(['member', '153', '154', '155', '156', '157', '158', '159'])
    const [target, init] = mock.mock.calls[1]!,
      url = new URL(target instanceof Request ? target.url : target)
    expect(url.pathname).toBe(row.path)
    expect(init?.method).toBe(row.verb ?? 'GET')
    for (const [key, value] of Object.entries(row.query ?? {})) expect(url.searchParams.get(key)).toBe(value)
    if (row.body !== undefined) expect(JSON.parse(init?.body as string)).toEqual(row.body)
    if (row.multipartField) {
      const headers = new Headers(init?.headers)
      const data = await new Response(init?.body, { headers }).formData()
      expect(data.getAll(row.multipartField)).toHaveLength(row.fileCount!)
      if (row.method.startsWith('sendFMS'))
        expect(JSON.parse(data.get('form') as string)).toMatchObject({ plusFriendID: '@채널', snd: '16008536', adsYN: false })
      else expect(data.get('form')).toBe('')
      if (row.method.endsWith('Binary')) {
        const file = data.get(row.multipartField) as File
        expect(file.name).toBe('image"\r\n.png')
        expect(Buffer.from(init?.body as Uint8Array).toString()).toContain('filename="image%22%0D%0A.png"')
        expect([...new Uint8Array(await file.arrayBuffer())]).toEqual([0, 1, 2, 255])
      }
    }
    if (row.method.startsWith('sendBMS')) {
      const body = JSON.parse(init?.body as string) as Record<string, unknown>
      expect(body['msgs']).toEqual(brand.receivers)
      expect(body['targeting']).toBe('O')
      expect(body['altYN']).toBe(false)
      expect(body).not.toHaveProperty('receivers')
      if (row.method === 'sendBMSVariable')
        expect(body).toMatchObject({
          templateCode: 'TEMPLATE',
          contentVariable: { 상품: '값' },
          carouselVariable: [{ contentVariable: { 상품: '값' } }],
        })
      else expect(body['plusFriendID']).toBe('@채널')
    }
  })
  it('keeps callback omitted UserID overloads', async () => {
    const mock = stub({ templateCode: 'TPL' })
    const result = await new Promise((resolve, reject) => createKakaoService(config).getATSTemplate(corp, 'TPL', resolve, reject))
    expect(result).toEqual({ templateCode: 'TPL' })
    expect(new Headers(mock.mock.calls[1]?.[1]?.headers).has('X-PB-UserID')).toBe(false)
  })
  it('normalizes the older sendATS_one overload without altSubject', async () => {
    const mock = stub({ receiptNum: 'RECEIPT' })
    await new Promise((resolve, reject) =>
      createKakaoService(config).sendATS_one(
        corp,
        'TPL',
        '16008536',
        '내용',
        '대체',
        'A',
        '20261104120000',
        '01012345678',
        '수신자',
        user,
        'REQ1',
        buttons,
        resolve,
        reject
      )
    )
    const body = JSON.parse(mock.mock.calls[1]?.[1]?.body as string) as Record<string, unknown>
    expect(body['altContent']).toBe('대체')
    expect(body['altSubject']).toBeUndefined()
    expect(body['requestNum']).toBe('REQ1')
  })
  it('reports API errors without losing the original error to a failing hook', async () => {
    const mock = stub({ code: -15010023, message: '발신번호 오류' }, 400),
      hook = vi.fn<() => void>(() => {
        throw new Error('hook')
      })
    await expect(createKakaoPromiseService({ ...config, defaultErrorHandler: hook }).checkSenderNumber(corp, 'bad')).rejects.toMatchObject({
      code: -15010023,
      message: '발신번호 오류',
    })
    expect(mock).toHaveBeenCalledTimes(2)
    expect(hook).toHaveBeenCalledOnce()
  })
  it('rejects empty inputs before authentication', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(createKakaoPromiseService(config).getMessages(corp, '')).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('forwards recipient limits to the provider without splitting a notification send', async () => {
    const fetchMock = stub({ receiptNum: 'R' })
    await expect(
      createKakaoPromiseService(config).sendATS_multi(
        corp,
        'TPL',
        undefined,
        undefined,
        undefined,
        Array.from({ length: 1001 }, () => receiver)
      )
    ).resolves.toBe('R')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string).msgs).toHaveLength(1001)
  })
  it.each(['getATSTemplate', 'getBMSTemplate'] as const)('%s reports a missing JavaScript template argument as input validation', async (method) => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    await expect(createKakaoPromiseService(config)[method](corp, undefined as unknown as string)).rejects.toMatchObject({ code: -99999999 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
