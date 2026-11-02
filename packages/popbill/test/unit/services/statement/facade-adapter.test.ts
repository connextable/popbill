import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { PopbillErrorStage, PopbillErrorType } from '@/errors'
import { createStatementService, type StatementDocumentInput, type StatementService } from '@/services/statement'

type CompatStatementService = Parameters<typeof createStatementService>[0]['compatStatementService']

interface ForwardingCase {
  method: keyof StatementService
  compatMethod: Extract<keyof CompatStatementService, string>
  invoke: (service: StatementService) => Promise<unknown>
  expectedArgs: unknown[]
  response: unknown
}

const BUSINESS_NUMBER = '1234567890'
const USER_ID = 'statement-user'
const BASE_INPUT = { businessNumber: BUSINESS_NUMBER, documentTypeCode: 121, managementKey: 'STMT-001' } as const
const DOCUMENT: StatementDocumentInput = { documentTypeCode: 121, managementKey: 'STMT-001', writtenDate: '20261102' }
const API_DOCUMENT = { itemCode: 121, mgtKey: 'STMT-001', writeDate: '20261102' }
const OK = { code: 1, message: 'OK' }
const KEY_ARGS = [BUSINESS_NUMBER, 121, 'STMT-001']
const URL = 'https://statement.example.test/document'

const FORWARDING_CASES: ForwardingCase[] = [
  {
    method: 'issueStatementImmediately',
    compatMethod: 'registIssue',
    invoke: (service) =>
      service.issueStatementImmediately({ businessNumber: BUSINESS_NUMBER, document: DOCUMENT, historyMemo: 'memo', emailSubject: 'subject' }),
    expectedArgs: [BUSINESS_NUMBER, API_DOCUMENT, 'memo', USER_ID, 'subject'],
    response: { ...OK, invoiceNum: 'ISSUED-001' },
  },
  {
    method: 'registerStatement',
    compatMethod: 'register',
    invoke: (service) => service.registerStatement({ businessNumber: BUSINESS_NUMBER, document: DOCUMENT }),
    expectedArgs: [BUSINESS_NUMBER, API_DOCUMENT, USER_ID],
    response: OK,
  },
  {
    method: 'updateStatement',
    compatMethod: 'update',
    invoke: (service) => service.updateStatement({ ...BASE_INPUT, document: DOCUMENT }),
    expectedArgs: [...KEY_ARGS, API_DOCUMENT, USER_ID],
    response: OK,
  },
  {
    method: 'issueStatement',
    compatMethod: 'issue',
    invoke: (service) => service.issueStatement({ ...BASE_INPUT, historyMemo: 'memo', emailSubject: 'subject' }),
    expectedArgs: [...KEY_ARGS, 'memo', 'subject', USER_ID],
    response: OK,
  },
  {
    method: 'cancelIssuedStatement',
    compatMethod: 'cancel',
    invoke: (service) => service.cancelIssuedStatement({ ...BASE_INPUT, historyMemo: 'cancel' }),
    expectedArgs: [...KEY_ARGS, 'cancel', USER_ID],
    response: OK,
  },
  {
    method: 'deleteStatement',
    compatMethod: 'delete',
    invoke: (service) => service.deleteStatement(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: OK,
  },
  {
    method: 'getStatementInfo',
    compatMethod: 'getInfo',
    invoke: (service) => service.getStatementInfo(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: { itemKey: 'ITEM-001', itemCode: 121, mgtKey: 'STMT-001' },
  },
  {
    method: 'getStatementsInfo',
    compatMethod: 'getInfos',
    invoke: (service) =>
      service.getStatementsInfo({ businessNumber: BUSINESS_NUMBER, documentTypeCode: 121, managementKeys: ['STMT-001', 'STMT-002'] }),
    expectedArgs: [BUSINESS_NUMBER, 121, ['STMT-001', 'STMT-002'], USER_ID],
    response: [],
  },
  {
    method: 'getStatementDetailInfo',
    compatMethod: 'getDetailInfo',
    invoke: (service) => service.getStatementDetailInfo(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: API_DOCUMENT,
  },
  {
    method: 'checkStatementManagementKeyInUse',
    compatMethod: 'checkMgtKeyInUse',
    invoke: (service) => service.checkStatementManagementKeyInUse(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: false,
  },
  {
    method: 'searchStatements',
    compatMethod: 'search',
    invoke: (service) =>
      service.searchStatements({
        businessNumber: BUSINESS_NUMBER,
        searchDateType: 'W',
        startDate: '20261101',
        endDate: '20261102',
        stateCodes: ['200', '3**'],
        documentTypeCodes: [121, 126],
        queryText: '회사 & 상품/?',
        sortOrder: 'D',
        pageNumber: 2,
        pageSize: 10,
      }),
    expectedArgs: [BUSINESS_NUMBER, 'W', '20261101', '20261102', ['200', '3**'], [121, 126], '회사 & 상품/?', 'D', 2, 10, USER_ID],
    response: { ...OK, list: [] },
  },
  {
    method: 'getStatementLogs',
    compatMethod: 'getLogs',
    invoke: (service) => service.getStatementLogs(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: [],
  },
  {
    method: 'getStatementBoxURL',
    compatMethod: 'getURL',
    invoke: (service) => service.getStatementBoxURL({ businessNumber: BUSINESS_NUMBER, statementBoxScope: 'TBOX' }),
    expectedArgs: [BUSINESS_NUMBER, 'TBOX', USER_ID],
    response: URL,
  },
  ...(
    [
      ['getStatementPopupURL', 'getPopUpURL'],
      ['getStatementViewURL', 'getViewURL'],
      ['getSenderStatementPrintURL', 'getPrintURL'],
      ['getReceiverStatementPrintURL', 'getEPrintURL'],
      ['getStatementMailURL', 'getMailURL'],
    ] as const
  ).map(([method, compatMethod]): ForwardingCase => ({
    method,
    compatMethod,
    invoke: (service) => service[method](BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: URL,
  })),
  {
    method: 'getBulkStatementPrintURL',
    compatMethod: 'getMassPrintURL',
    invoke: (service) =>
      service.getBulkStatementPrintURL({ businessNumber: BUSINESS_NUMBER, documentTypeCode: 121, managementKeys: ['STMT-001', 'STMT-002'] }),
    expectedArgs: [BUSINESS_NUMBER, 121, ['STMT-001', 'STMT-002'], USER_ID],
    response: URL,
  },
  {
    method: 'getSealAndAttachmentRegistrationURL',
    compatMethod: 'getSealURL',
    invoke: (service) => service.getSealAndAttachmentRegistrationURL({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: URL,
  },
  {
    method: 'attachFileFromPath',
    compatMethod: 'attachFile',
    invoke: (service) => service.attachFileFromPath({ ...BASE_INPUT, displayName: 'statement.pdf', filePath: '/tmp/statement.pdf' }),
    expectedArgs: [...KEY_ARGS, 'statement.pdf', '/tmp/statement.pdf', USER_ID],
    response: OK,
  },
  {
    method: 'attachFileFromBinary',
    compatMethod: 'attachFileBinary',
    invoke: (service) => service.attachFileFromBinary({ ...BASE_INPUT, fileName: 'statement.pdf', fileData: Buffer.from('statement file') }),
    expectedArgs: [...KEY_ARGS, { fileName: 'statement.pdf', fileData: Buffer.from('statement file') }, USER_ID],
    response: OK,
  },
  {
    method: 'deleteAttachedFile',
    compatMethod: 'deleteFile',
    invoke: (service) => service.deleteAttachedFile({ ...BASE_INPUT, fileIdentifier: 'FILE-001' }),
    expectedArgs: [...KEY_ARGS, 'FILE-001', USER_ID],
    response: OK,
  },
  {
    method: 'getAttachedFiles',
    compatMethod: 'getFiles',
    invoke: (service) => service.getAttachedFiles(BASE_INPUT),
    expectedArgs: [...KEY_ARGS, USER_ID],
    response: [],
  },
  {
    method: 'resendStatementEmail',
    compatMethod: 'sendEmail',
    invoke: (service) => service.resendStatementEmail({ ...BASE_INPUT, receiverEmailAddress: 'receiver@example.test' }),
    expectedArgs: [...KEY_ARGS, 'receiver@example.test', USER_ID],
    response: OK,
  },
  {
    method: 'resendStatementSMS',
    compatMethod: 'sendSMS',
    invoke: (service) =>
      service.resendStatementSMS({ ...BASE_INPUT, senderPhoneNumber: '07075103710', receiverPhoneNumber: '01012345678', messageBody: '명세서 확인' }),
    expectedArgs: [...KEY_ARGS, '07075103710', '01012345678', '명세서 확인', USER_ID],
    response: OK,
  },
  {
    method: 'resendStatementFAX',
    compatMethod: 'sendFAX',
    invoke: (service) => service.resendStatementFAX({ ...BASE_INPUT, senderPhoneNumber: '07075103710', receiverPhoneNumber: '0212345678' }),
    expectedArgs: [...KEY_ARGS, '07075103710', '0212345678', USER_ID],
    response: OK,
  },
  {
    method: 'sendStatementFAX',
    compatMethod: 'FAXSend',
    invoke: (service) =>
      service.sendStatementFAX({
        businessNumber: BUSINESS_NUMBER,
        document: DOCUMENT,
        senderPhoneNumber: '07075103710',
        receiverPhoneNumber: '0212345678',
      }),
    expectedArgs: [BUSINESS_NUMBER, API_DOCUMENT, '07075103710', '0212345678', USER_ID],
    response: 'FAX-001',
  },
  ...(['attachStatement', 'detachStatement'] as const).map((method): ForwardingCase => ({
    method,
    compatMethod: method,
    invoke: (service) => service[method]({ ...BASE_INPUT, attachedDocumentTypeCode: 122, attachedManagementKey: 'SUB-001' }),
    expectedArgs: [...KEY_ARGS, 122, 'SUB-001', USER_ID],
    response: OK,
  })),
  {
    method: 'getEmailSendSettings',
    compatMethod: 'listEmailConfig',
    invoke: (service) => service.getEmailSendSettings({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: [],
  },
  {
    method: 'updateEmailSendSettings',
    compatMethod: 'updateEmailConfig',
    invoke: (service) => service.updateEmailSendSettings({ businessNumber: BUSINESS_NUMBER, emailTypeCode: 'SMT_ISSUE', sendEnabled: false }),
    expectedArgs: [BUSINESS_NUMBER, 'SMT_ISSUE', false, USER_ID],
    response: OK,
  },
  {
    method: 'getChargeInfo',
    compatMethod: 'getChargeInfo',
    invoke: (service) => service.getChargeInfo({ businessNumber: BUSINESS_NUMBER, documentTypeCode: 121 }),
    expectedArgs: [BUSINESS_NUMBER, 121, USER_ID],
    response: { unitCost: '10', chargeMethod: '연동', rateSystem: '종량제' },
  },
  {
    method: 'getUnitCost',
    compatMethod: 'getUnitCost',
    invoke: (service) => service.getUnitCost({ businessNumber: BUSINESS_NUMBER, documentTypeCode: 121 }),
    expectedArgs: [BUSINESS_NUMBER, 121],
    response: '10',
  },
]

describe('statement facade adapter', () => {
  for (const testCase of FORWARDING_CASES) {
    test(`${testCase.method} forwards the public contract to ${testCase.compatMethod}`, async () => {
      const compatMethod = vi.fn<(...args: unknown[]) => Promise<unknown>>(() => Promise.resolve(testCase.response))
      const service = createStatementService({
        defaultUserId: USER_ID,
        compatStatementService: { [testCase.compatMethod]: compatMethod } as unknown as CompatStatementService,
      })

      await testCase.invoke(service)

      expect(compatMethod).toHaveBeenCalledExactlyOnceWith(...testCase.expectedArgs)
    })
  }

  test('keeps caller documents unchanged when a compat implementation mutates its argument', async () => {
    const document: StatementDocumentInput = {
      ...DOCUMENT,
      sender: { businessNumber: BUSINESS_NUMBER, companyName: '공급자', departmentName: '발신부서', faxNumber: '0212345678' },
      receiver: { businessNumber: '8888888888', companyName: '수신자', departmentName: '수신부서', faxNumber: '0288889999' },
      paymentSummary: { totalSupplyCostAmount: '00020.50', totalTaxAmount: '0', totalAmount: '00020.50' },
      lineItems: [{ lineNumber: 1, itemName: '품목', quantity: '0', supplyCostAmount: '00020.50', additionalFields: { 1: '', 20: '0' } }],
      sendTextMessage: false,
      includeBusinessLicenseImage: false,
      propertyBag: { Balance: '00020.50', Deposit: '0' },
    }
    const before = structuredClone(document)
    const registIssue = vi.fn<(...args: unknown[]) => Promise<unknown>>((_corpNum, rawDocument) => {
      const raw = rawDocument as { memo?: string; detailList: { itemName?: string }[]; propertyBag: Record<string, string> }
      raw.memo = 'compat memo'
      raw.detailList[0]!.itemName = 'changed'
      raw.propertyBag['Balance'] = 'changed'
      return Promise.resolve(OK)
    })
    const service = createStatementService({ defaultUserId: USER_ID, compatStatementService: { registIssue } as unknown as CompatStatementService })

    await service.issueStatementImmediately({ businessNumber: BUSINESS_NUMBER, document })

    expect(document).toEqual(before)
    expect(registIssue.mock.calls[0]?.[1]).toMatchObject({
      supplyCostTotal: '00020.50',
      taxTotal: '0',
      totalAmount: '00020.50',
      smssendYN: false,
      businessLicenseYN: false,
      senderDeptName: '발신부서',
      senderFAX: '0212345678',
      receiverDeptName: '수신부서',
      receiverFAX: '0288889999',
      detailList: [{ qty: '0', spare1: '', spare20: '0' }],
    })
  })

  test.each([
    { field: 'searchDateType', value: 'X' },
    { field: 'startDate', value: '20260230' },
    { field: 'startDate', value: '20261103' },
    { field: 'stateCodes', value: ['**3'] },
    { field: 'documentTypeCodes', value: [999] },
    { field: 'sortOrder', value: 'X' },
    { field: 'pageNumber', value: 0 },
    { field: 'pageSize', value: 0 },
  ])('rejects invalid search $field=$value before reaching compat', async ({ field, value }) => {
    const search = vi.fn<CompatStatementService['search']>(() => Promise.resolve({ code: 1, message: 'OK', list: [] }))
    const service = createStatementService({ defaultUserId: USER_ID, compatStatementService: { search } as unknown as CompatStatementService })
    const input = {
      businessNumber: BUSINESS_NUMBER,
      searchDateType: 'W',
      startDate: '20261101',
      endDate: '20261102',
      [field]: value,
    } as Parameters<StatementService['searchStatements']>[0]

    await expect(service.searchStatements(input)).rejects.toMatchObject({
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'statement.searchStatements',
    })
    expect(search).not.toHaveBeenCalled()
  })

  test('leaves the provider page-size limit to the server while retaining pagination defaults', async () => {
    const search = vi.fn<CompatStatementService['search']>(() => Promise.resolve({ code: 1, message: 'OK', list: [] }))
    const service = createStatementService({ defaultUserId: USER_ID, compatStatementService: { search } as unknown as CompatStatementService })

    await service.searchStatements({
      businessNumber: BUSINESS_NUMBER,
      searchDateType: 'W',
      startDate: '20261101',
      endDate: '20261102',
      pageSize: 1001,
    })

    expect(search.mock.calls[0]?.slice(7)).toEqual(['D', 1, 1001, USER_ID])
  })

  test.each(['synchronously', 'asynchronously'])('preserves normalized API errors when onError fails %s', async (failureMode) => {
    const original = Object.assign(
      new Error('invalid businessNumber'),
      createInputValidationError('invalid businessNumber', { stage: PopbillErrorStage.ValidateInput })
    )
    const hookCalled = vi.fn<(error: unknown) => void>()
    const onError = (error: unknown) => {
      hookCalled(error)
      if (failureMode === 'asynchronously') return Promise.reject(new Error('hook failure'))
      throw new Error('hook failure')
    }
    const getInfo = vi.fn<CompatStatementService['getInfo']>(() => Promise.reject(original))
    const service = createStatementService({
      defaultUserId: USER_ID,
      compatStatementService: { getInfo } as unknown as CompatStatementService,
      onError,
    })

    await expect(service.getStatementInfo(BASE_INPUT)).rejects.toMatchObject({
      code: -99999999,
      message: 'invalid businessNumber',
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'statement.getStatementInfo',
    })
    expect(hookCalled).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ operation: 'statement.getStatementInfo' }))
    await new Promise<void>((resolve) => setImmediate(resolve))
  })
})
