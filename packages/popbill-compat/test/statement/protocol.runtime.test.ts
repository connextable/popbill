import { fileURLToPath } from 'node:url'
import * as helpers from './helpers'

interface ProtocolCase {
  method: string
  args: unknown[]
  path: string
  verb?: string
  query?: Record<string, string>
  body?: unknown
  response: unknown
  expected?: unknown
  hasUserId?: boolean
  multipartFileName?: string
  multipartContents?: string
}

const ok = { code: 1, message: 'Success' }
const info = { itemKey: 'ITEM-1', mgtKey: 'STMT-001', itemCode: 121, stateCode: 100 }
const url = 'https://statement.example.test/document'
const input = helpers.document()
const filePath = fileURLToPath(new URL('../../README.md', import.meta.url))
const cases: ProtocolCase[] = [
  { method: 'checkMgtKeyInUse', args: [121, helpers.MGT_KEY], path: helpers.DOCUMENT_PATH, response: info, expected: true },
  { method: 'register', args: [input], path: '/Statement', verb: 'POST', body: input, response: ok },
  { method: 'update', args: [121, helpers.MGT_KEY, input], path: helpers.DOCUMENT_PATH, verb: 'PATCH', body: input, response: ok },
  {
    method: 'registIssue',
    args: [input, '메모', helpers.USER_ID, '메일 제목'],
    path: '/Statement',
    verb: 'ISSUE',
    body: { ...input, memo: '메모', emailSubject: '메일 제목' },
    response: { ...ok, invoiceNum: 'STMT-ISSUED' },
    hasUserId: true,
  },
  {
    method: 'issue',
    args: [121, helpers.MGT_KEY, '메모', '메일 제목'],
    path: helpers.DOCUMENT_PATH,
    verb: 'ISSUE',
    body: { memo: '메모', emailSubject: '메일 제목' },
    response: ok,
  },
  { method: 'cancel', args: [121, helpers.MGT_KEY, '취소'], path: helpers.DOCUMENT_PATH, verb: 'CANCEL', body: { memo: '취소' }, response: ok },
  { method: 'delete', args: [121, helpers.MGT_KEY], path: helpers.DOCUMENT_PATH, verb: 'DELETE', response: ok },
  { method: 'getInfo', args: [121, helpers.MGT_KEY], path: helpers.DOCUMENT_PATH, response: info },
  {
    method: 'getInfos',
    args: [121, ['STMT-001', 'STMT-002']],
    path: '/Statement/121',
    verb: 'POST',
    body: ['STMT-001', 'STMT-002'],
    response: [info],
  },
  { method: 'getDetailInfo', args: [121, helpers.MGT_KEY], path: helpers.DOCUMENT_PATH, query: { Detail: '' }, response: input },
  {
    method: 'getLogs',
    args: [121, helpers.MGT_KEY],
    path: `${helpers.DOCUMENT_PATH}/Logs`,
    response: [{ docLogType: 100, log: '등록', procType: '연동', procCorpName: '공급자', procContactName: '담당자', regDT: '20261102120000' }],
  },
  {
    method: 'search',
    args: ['W', '20261101', '20261102', ['200', '3**'], [121, 126], '회사 & 상품/?', 'D', 2, 10],
    path: '/Statement/Search',
    query: {
      DType: 'W',
      SDate: '20261101',
      EDate: '20261102',
      State: '200,3**',
      ItemCode: '121,126',
      QString: '회사 & 상품/?',
      Order: 'D',
      Page: '2',
      PerPage: '10',
    },
    response: { code: 1, message: 'Success', total: 1, perPage: 10, pageNum: 2, pageCount: 1, list: [info] },
  },
  { method: 'getURL', args: ['TBOX'], path: '/Statement', query: { TG: 'TBOX' }, response: { url }, expected: url },
  ...[
    ['getPopUpURL', 'POPUP'],
    ['getViewURL', 'VIEW'],
    ['getPrintURL', 'PRINT'],
    ['getEPrintURL', 'EPRINT'],
    ['getMailURL', 'MAIL'],
  ].map(([method, target]): ProtocolCase => ({
    method: method!,
    args: [121, helpers.MGT_KEY],
    path: helpers.DOCUMENT_PATH,
    query: { TG: target! },
    response: { url },
    expected: url,
  })),
  {
    method: 'getMassPrintURL',
    args: [121, ['STMT-001', 'STMT-002']],
    path: '/Statement/121',
    query: { Print: '' },
    verb: 'POST',
    body: ['STMT-001', 'STMT-002'],
    response: { url },
    expected: url,
  },
  {
    method: 'sendEmail',
    args: [121, helpers.MGT_KEY, 'receiver@example.test'],
    path: helpers.DOCUMENT_PATH,
    verb: 'EMAIL',
    body: { receiver: 'receiver@example.test' },
    response: ok,
  },
  {
    method: 'sendSMS',
    args: [121, helpers.MGT_KEY, '07075103710', '01012345678', '명세서 확인'],
    path: helpers.DOCUMENT_PATH,
    verb: 'SMS',
    body: { sender: '07075103710', receiver: '01012345678', contents: '명세서 확인' },
    response: ok,
  },
  {
    method: 'sendFAX',
    args: [121, helpers.MGT_KEY, '07075103710', '0212345678'],
    path: helpers.DOCUMENT_PATH,
    verb: 'FAX',
    body: { sender: '07075103710', receiver: '0212345678' },
    response: ok,
  },
  {
    method: 'FAXSend',
    args: [input, '07075103710', '0212345678'],
    path: '/Statement',
    verb: 'FAX',
    body: { ...input, sendNum: '07075103710', receiveNum: '0212345678' },
    response: { receiptNum: 'FAX-RECEIPT-1' },
    expected: 'FAX-RECEIPT-1',
  },
  {
    method: 'attachFile',
    args: [121, helpers.MGT_KEY, 'statement.md', filePath],
    path: `${helpers.DOCUMENT_PATH}/Files`,
    verb: 'POST',
    response: ok,
    multipartFileName: 'statement.md',
    multipartContents: '# @connextable/popbill-compat',
  },
  {
    method: 'attachFileBinary',
    args: [121, helpers.MGT_KEY, { fileName: 'statement.txt', fileData: Buffer.from('statement binary content') }],
    path: `${helpers.DOCUMENT_PATH}/Files`,
    verb: 'POST',
    response: ok,
    multipartFileName: 'statement.txt',
    multipartContents: 'statement binary content',
  },
  {
    method: 'getFiles',
    args: [121, helpers.MGT_KEY],
    path: `${helpers.DOCUMENT_PATH}/Files`,
    response: [{ serialNum: 1, attachedFile: 'FILE-1', displayName: 'statement.txt', regDT: '20261102120000' }],
  },
  {
    method: 'deleteFile',
    args: [121, helpers.MGT_KEY, 'FILE/1?x'],
    path: `${helpers.DOCUMENT_PATH}/Files/FILE%2F1%3Fx`,
    verb: 'DELETE',
    response: ok,
  },
  {
    method: 'attachStatement',
    args: [121, helpers.MGT_KEY, 122, 'SUB-001'],
    path: `${helpers.DOCUMENT_PATH}/AttachStmt`,
    verb: 'POST',
    body: { ItemCode: 122, MgtKey: 'SUB-001' },
    response: ok,
  },
  {
    method: 'detachStatement',
    args: [121, helpers.MGT_KEY, 122, 'SUB-001'],
    path: `${helpers.DOCUMENT_PATH}/DetachStmt`,
    verb: 'POST',
    body: { ItemCode: 122, MgtKey: 'SUB-001' },
    response: ok,
  },
  {
    method: 'getChargeInfo',
    args: [121],
    path: '/Statement/ChargeInfo/121',
    response: { unitCost: '10', chargeMethod: '연동', rateSystem: '종량제' },
  },
  {
    method: 'getUnitCost',
    args: [121],
    path: '/Statement/121',
    query: { cfg: 'UNITCOST' },
    response: { unitCost: '10' },
    expected: '10',
    hasUserId: true,
  },
  { method: 'getSealURL', args: [], path: '/Member', query: { TG: 'SEAL' }, response: { url }, expected: url },
  {
    method: 'listEmailConfig',
    args: [],
    path: '/Statement/EmailSendConfig',
    response: [{ emailType: 'SMT_ISSUE', sendYN: false }],
  },
  {
    method: 'updateEmailConfig',
    args: ['SMT_ISSUE', false],
    path: '/Statement/EmailSendConfig',
    query: { EmailType: 'SMT_ISSUE', SendYN: 'false' },
    verb: 'POST',
    response: ok,
  },
]

describe('statement runtime: legacy protocol', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each(['callback', 'promise'] as const)('%s exposes all 34 statement methods', (style) => {
    const service = style === 'callback' ? helpers.createStatementService(helpers.config()) : helpers.createStatementPromiseService(helpers.config())
    expect(cases).toHaveLength(34)
    for (const entry of cases) {
      expect(Reflect.get(service, entry.method)).toBeTypeOf('function')
    }
  })

  describe.each(['callback', 'promise'] as const)('%s', (style) => {
    test.each(cases)('$method preserves request and legacy result shape', async (entry) => {
      const fetchMock = helpers.stubApiResponse(entry.response)
      const service =
        style === 'callback' ? helpers.createStatementService(helpers.config()) : helpers.createStatementPromiseService(helpers.config())
      const args = [helpers.CORP_NUM, ...entry.args]
      if (!entry.hasUserId) {
        args.push(helpers.USER_ID)
      }

      const result =
        style === 'promise'
          ? await helpers.invoke(service, entry.method, args)
          : await new Promise<unknown>((resolve, reject) => {
              helpers.invoke(service, entry.method, [...args, resolve, reject])
            })

      expect(result).toEqual(entry.expected ?? entry.response)
      const { url: requestUrl, init } = helpers.apiRequest(fetchMock)
      expect(requestUrl.pathname).toBe(entry.path)
      expect(Object.fromEntries(requestUrl.searchParams)).toEqual(entry.query ?? {})
      const headers = init.headers as Record<string, string>
      expect(headers['x-pb-userid']).toBe(entry.method === 'getUnitCost' ? undefined : helpers.USER_ID)
      const verb = entry.verb ?? 'GET'
      expect(init.method).toBe(verb === 'GET' ? 'GET' : 'POST')
      expect(headers['X-HTTP-Method-Override']).toBe(verb === 'GET' || verb === 'POST' ? undefined : verb)
      expect(typeof init.body === 'string' ? JSON.parse(init.body) : undefined).toEqual(entry.body)
    })

    test.each(cases.filter((entry) => entry.multipartFileName !== undefined))('$method uploads filename and file bytes', async (entry) => {
      const fetchMock = helpers.stubApiResponse(entry.response)
      const service =
        style === 'callback' ? helpers.createStatementService(helpers.config()) : helpers.createStatementPromiseService(helpers.config())
      const args = [helpers.CORP_NUM, ...entry.args, helpers.USER_ID]
      await (style === 'promise'
        ? helpers.invoke(service, entry.method, args)
        : new Promise<unknown>((resolve, reject) => {
            helpers.invoke(service, entry.method, [...args, resolve, reject])
          }))

      const { init } = helpers.apiRequest(fetchMock)
      expect((init.headers as Record<string, string>)['Content-Type']).toContain('multipart/form-data;')
      const body = Buffer.from(init.body as Uint8Array).toString('utf8')
      expect(body).toContain(`name="Filedata"; filename="${entry.multipartFileName}"\r\n`)
      expect(body).toContain(entry.multipartContents)
    })
  })

  test('statement token requests member and all six document scopes', async () => {
    const fetchMock = helpers.stubApiResponse(info)
    await helpers.createStatementPromiseService(helpers.config()).getInfo(helpers.CORP_NUM, 121, 'STMT-001')

    const tokenInit = fetchMock.mock.calls[0]?.[1] as RequestInit
    expect(JSON.parse(tokenInit.body as string)).toMatchObject({
      access_id: helpers.CORP_NUM,
      scope: ['member', '121', '122', '123', '124', '125', '126'],
    })
  })

  test('leaves document-count limits to the provider without splitting', async () => {
    const fetchMock = helpers.stubApiResponse([])
    const keys = Array.from({ length: 1001 }, (_, index) => `STMT-${index}`)

    await helpers.createStatementPromiseService(helpers.config()).getInfos(helpers.CORP_NUM, 121, keys)

    expect(JSON.parse(helpers.apiRequest(fetchMock).init.body as string)).toEqual(keys)
  })
})
