import {
  createStatementService,
  type StatementDocumentInput,
  type StatementDocumentOutput,
  type StatementInfo,
  type StatementOperationResult,
} from '@/services/statement'

type CompatStatementService = Parameters<typeof createStatementService>[0]['compatStatementService']

const BASE_INPUT = { businessNumber: '1234567890', documentTypeCode: 121, managementKey: 'STMT-001' } as const

function serviceWith(overrides: Partial<CompatStatementService>) {
  return createStatementService({ defaultUserId: 'statement-user', compatStatementService: overrides as CompatStatementService })
}

describe('statement public response mapping', () => {
  test('preserves amount strings and false status flags in summaries and search results', async () => {
    const rawInfo = {
      itemKey: 'ITEM-001',
      itemCode: 121 as const,
      mgtKey: 'STMT-001',
      invoiceNum: 'DOC-001',
      stateCode: 0,
      stateDT: '20261102120000',
      stateMemo: '저장',
      regDT: '20261102110000',
      writeDate: '20261102',
      issueDT: '20261102130000',
      senderCorpNum: '1234567890',
      senderCorpName: '발신자',
      receiverCorpNum: '8888888888',
      receiverCorpName: '수신자',
      supplyCostTotal: '00020.50',
      taxTotal: '0',
      openYN: false,
      senderPrintYN: false,
      receiverPrintYN: true,
    }
    const service = serviceWith({
      getInfo: vi.fn<CompatStatementService['getInfo']>(() => Promise.resolve(rawInfo)),
      getInfos: vi.fn<CompatStatementService['getInfos']>(() => Promise.resolve([rawInfo])),
      search: vi.fn<(...args: unknown[]) => ReturnType<CompatStatementService['search']>>(() =>
        Promise.resolve({ code: 0, message: 'OK', total: 0, perPage: 100, pageNum: 1, pageCount: 0, list: [rawInfo] })
      ),
    })
    const expected = {
      itemKey: 'ITEM-001',
      documentTypeCode: 121,
      managementKey: 'STMT-001',
      documentNumber: 'DOC-001',
      stateCode: 0,
      stateChangedAt: '20261102120000',
      stateMemo: '저장',
      registeredAt: '20261102110000',
      writtenDate: '20261102',
      issuedAt: '20261102130000',
      sender: { businessNumber: '1234567890', companyName: '발신자', printEnabled: false },
      receiver: { businessNumber: '8888888888', companyName: '수신자', printEnabled: true },
      totalSupplyCostAmount: '00020.50',
      totalTaxAmount: '0',
      isOpen: false,
    }

    await expect(service.getStatementInfo(BASE_INPUT)).resolves.toEqual(expected)
    await expect(service.getStatementsInfo({ ...BASE_INPUT, managementKeys: ['STMT-001'] })).resolves.toEqual([expected])
    await expect(
      service.searchStatements({ businessNumber: BASE_INPUT.businessNumber, searchDateType: 'R', startDate: '20261101', endDate: '20261102' })
    ).resolves.toEqual({
      operationResult: { resultCode: 0, resultMessage: 'OK' },
      totalCount: 0,
      pageSize: 100,
      pageNumber: 1,
      pageCount: 0,
      statementSummaries: [expected],
    })
  })

  test('maps document parties, custom fields, amount strings and explicit false options without losing data', async () => {
    const rawDocument = {
      itemCode: 121 as const,
      mgtKey: 'STMT-001',
      writeDate: '20261102',
      formCode: 'FORM-01',
      serialNum: '0001',
      purposeType: '영수' as const,
      taxType: '과세' as const,
      senderCorpNum: '1234567890',
      senderCorpName: '발신자',
      senderCEOName: '대표',
      senderAddr: '서울',
      senderTaxRegID: '0001',
      senderBizType: '도소매',
      senderBizClass: '서비스',
      senderContactName: '발신 담당자',
      senderDeptName: '발신부서',
      senderFAX: '0212345678',
      senderTEL: '0212345678',
      senderHP: '01012345678',
      senderEmail: 'sender@example.test',
      receiverCorpNum: '8888888888',
      receiverCorpName: '수신자',
      receiverContactName: '수신 담당자',
      receiverDeptName: '수신부서',
      receiverFAX: '0288889999',
      receiverEmail: 'receiver@example.test',
      supplyCostTotal: '00020.50',
      taxTotal: '0',
      totalAmount: '00020.50',
      businessLicenseYN: false,
      bankBookYN: false,
      smssendYN: false,
      propertyBag: { Balance: '00020.50', Deposit: '0', CustomField: '' },
      detailList: [
        {
          serialNum: 1,
          purchaseDT: '20261102',
          itemName: '품목',
          spec: '규격',
          qty: '0',
          unitCost: '00020.50',
          supplyCost: '00020.50',
          tax: '0',
          remark: '비고',
          spare1: '',
          spare20: '0',
        },
      ],
    }
    const service = serviceWith({ getDetailInfo: vi.fn<CompatStatementService['getDetailInfo']>(() => Promise.resolve(rawDocument)) })

    await expect(service.getStatementDetailInfo(BASE_INPUT)).resolves.toEqual({
      documentTypeCode: 121,
      managementKey: 'STMT-001',
      writtenDate: '20261102',
      formCode: 'FORM-01',
      documentSerialNumber: '0001',
      purposeType: '영수',
      taxType: '과세',
      sender: {
        businessNumber: '1234567890',
        companyName: '발신자',
        chiefExecutiveOfficerName: '대표',
        address: '서울',
        taxRegistrationIdentifier: '0001',
        businessType: '도소매',
        businessClass: '서비스',
        contactName: '발신 담당자',
        departmentName: '발신부서',
        faxNumber: '0212345678',
        telephoneNumber: '0212345678',
        mobilePhoneNumber: '01012345678',
        emailAddress: 'sender@example.test',
      },
      receiver: {
        businessNumber: '8888888888',
        companyName: '수신자',
        contactName: '수신 담당자',
        departmentName: '수신부서',
        faxNumber: '0288889999',
        emailAddress: 'receiver@example.test',
      },
      paymentSummary: { totalSupplyCostAmount: '00020.50', totalTaxAmount: '0', totalAmount: '00020.50' },
      includeBusinessLicenseImage: false,
      includeBankBookImage: false,
      sendTextMessage: false,
      propertyBag: { Balance: '00020.50', Deposit: '0', CustomField: '' },
      lineItems: [
        {
          lineNumber: 1,
          transactionDate: '20261102',
          itemName: '품목',
          specification: '규격',
          quantity: '0',
          unitCostAmount: '00020.50',
          supplyCostAmount: '00020.50',
          taxAmount: '0',
          remark: '비고',
          additionalFields: { 1: '', 20: '0' },
        },
      ],
    })
  })

  test('keeps absent document sections absent', async () => {
    const service = serviceWith({
      getDetailInfo: vi.fn<CompatStatementService['getDetailInfo']>(() => Promise.resolve({ itemCode: 121 as const, mgtKey: 'STMT-001' })),
    })

    await expect(service.getStatementDetailInfo(BASE_INPUT)).resolves.toEqual({ documentTypeCode: 121, managementKey: 'STMT-001' })
  })

  test('maps operation, issue, attachment, email, cost and fax results at the service boundary', async () => {
    const service = serviceWith({
      register: vi.fn<CompatStatementService['register']>(() => Promise.resolve({ code: 0, message: 'stored' })),
      registIssue: vi.fn<CompatStatementService['registIssue']>(() =>
        Promise.resolve({ code: 1, message: 'issued', invoiceNum: 'DOC-001', issueDT: '20261102120000' })
      ),
      getFiles: vi.fn<CompatStatementService['getFiles']>(() =>
        Promise.resolve([{ serialNum: 1, attachedFile: 'FILE-001', fileSize: 0, displayName: '빈파일.txt', regDT: '20261102120000' }])
      ),
      listEmailConfig: vi.fn<CompatStatementService['listEmailConfig']>(() => Promise.resolve([{ emailType: 'SMT_ISSUE' as const, sendYN: false }])),
      getChargeInfo: vi.fn<CompatStatementService['getChargeInfo']>(() =>
        Promise.resolve({ unitCost: '0.00', chargeMethod: '연동' as const, rateSystem: '종량제' as const })
      ),
      getUnitCost: vi.fn<CompatStatementService['getUnitCost']>(() => Promise.resolve('0.00')),
      FAXSend: vi.fn<CompatStatementService['FAXSend']>(() => Promise.resolve('FAX-001')),
    })
    const documentInput = { businessNumber: BASE_INPUT.businessNumber, document: { documentTypeCode: 121 as const } }

    await expect(service.registerStatement(documentInput)).resolves.toEqual({ resultCode: 0, resultMessage: 'stored' })
    await expect(service.issueStatementImmediately(documentInput)).resolves.toEqual({
      resultCode: 1,
      resultMessage: 'issued',
      documentNumber: 'DOC-001',
      issuedAt: '20261102120000',
    })
    await expect(service.getAttachedFiles(BASE_INPUT)).resolves.toEqual([
      { sequenceNumber: 1, fileIdentifier: 'FILE-001', fileSize: 0, displayName: '빈파일.txt', registeredAt: '20261102120000' },
    ])
    await expect(service.getEmailSendSettings({ businessNumber: BASE_INPUT.businessNumber })).resolves.toEqual([
      { emailTypeCode: 'SMT_ISSUE', sendEnabled: false },
    ])
    await expect(service.getChargeInfo(BASE_INPUT)).resolves.toEqual({ unitCost: '0.00', chargeMethod: '연동', rateSystem: '종량제' })
    await expect(service.getUnitCost(BASE_INPUT)).resolves.toEqual({ unitCost: '0.00' })
    await expect(service.sendStatementFAX({ ...documentInput, senderPhoneNumber: '0212345678', receiverPhoneNumber: '0288889999' })).resolves.toEqual(
      { receiptNumber: 'FAX-001' }
    )
  })

  test('preserves future, blank, null and missing codes across a batch without rejecting other documents', async () => {
    const rawInfos = [
      { itemCode: '121', stateCode: '00300', openYN: ' Y ', senderPrintYN: 'N', receiverPrintYN: 0 },
      { itemCode: 'future-document', stateCode: 'future-state', openYN: 'pending', senderPrintYN: null, receiverPrintYN: 2 },
      { itemCode: null, stateCode: null, openYN: null },
      { itemCode: '', stateCode: '' },
      {},
    ]
    const service = serviceWith({
      getInfos: vi.fn<() => Promise<unknown>>(() => Promise.resolve(rawInfos)),
    } as unknown as Partial<CompatStatementService>)

    await expect(service.getStatementsInfo({ ...BASE_INPUT, managementKeys: ['STMT-001'] })).resolves.toEqual([
      { documentTypeCode: 121, stateCode: 300, isOpen: true, sender: { printEnabled: false }, receiver: { printEnabled: false } },
      {
        documentTypeCode: 'future-document',
        stateCode: 'future-state',
        isOpen: 'pending',
        sender: { printEnabled: null },
        receiver: { printEnabled: 2 },
      },
      { documentTypeCode: null, stateCode: null, isOpen: null },
      { documentTypeCode: '', stateCode: '' },
      {},
    ])
  })

  test('keeps open document classifications and flags while omitting invalid quantities', async () => {
    const service = serviceWith({
      getDetailInfo: vi.fn<() => Promise<unknown>>(() =>
        Promise.resolve({
          itemCode: 'future-document',
          taxType: 'future-tax',
          purposeType: null,
          businessLicenseYN: null,
          bankBookYN: 'pending',
          smssendYN: ' TRUE ',
          autoAcceptYN: '0',
          faxsendYN: 2,
          supplyCostTotal: '00020.5000',
          detailList: [
            { serialNum: null, qty: '000.50', unitCost: '001.0000' },
            { serialNum: false },
            { serialNum: ' ' },
            { serialNum: '2', supplyCost: '00020.5000' },
          ],
        })
      ),
    } as unknown as Partial<CompatStatementService>)

    await expect(service.getStatementDetailInfo(BASE_INPUT)).resolves.toEqual({
      documentTypeCode: 'future-document',
      taxType: 'future-tax',
      purposeType: null,
      includeBusinessLicenseImage: null,
      includeBankBookImage: 'pending',
      sendTextMessage: true,
      autoAcceptEnabled: false,
      sendFAXEnabled: 2,
      paymentSummary: { totalSupplyCostAmount: '00020.5000' },
      lineItems: [{ quantity: '000.50', unitCostAmount: '001.0000' }, {}, {}, { lineNumber: 2, supplyCostAmount: '00020.5000' }],
    })
  })

  test.each([
    ['0001', 1],
    ['future-result', 'future-result'],
    ['9007199254740993', '9007199254740993'],
    ['', ''],
    [null, null],
    [undefined, undefined],
  ])('preserves operation code %j without failing a successful response', async (code, expected) => {
    const service = serviceWith({
      register: vi.fn<() => Promise<unknown>>(() => Promise.resolve({ code, message: 'stored' })),
    } as unknown as Partial<CompatStatementService>)

    await expect(service.registerStatement({ businessNumber: BASE_INPUT.businessNumber, document: { documentTypeCode: 121 } })).resolves.toEqual({
      resultCode: expected,
      resultMessage: 'stored',
    })
  })

  test('keeps log codes distinct from quantities and does not manufacture zero for null or boolean counts', async () => {
    const service = serviceWith({
      search: vi.fn<() => Promise<unknown>>(() =>
        Promise.resolve({ code: 'future-result', message: 'OK', pageNum: '2', perPage: null, pageCount: false, total: ' ', list: [] })
      ),
      getLogs: vi.fn<() => Promise<unknown>>(() =>
        Promise.resolve([
          { docLogType: '00200', procType: 'future-process' },
          { docLogType: 'future-log', procType: null },
          { docLogType: null },
          { docLogType: '' },
        ])
      ),
      getFiles: vi.fn<() => Promise<unknown>>(() =>
        Promise.resolve([
          { serialNum: null, fileSize: false, attachedFile: 'FILE-001' },
          { serialNum: ' ', fileSize: 'not-a-size' },
          { serialNum: '2', fileSize: '0' },
        ])
      ),
    } as unknown as Partial<CompatStatementService>)

    await expect(
      service.searchStatements({ businessNumber: BASE_INPUT.businessNumber, searchDateType: 'R', startDate: '20261101', endDate: '20261102' })
    ).resolves.toEqual({
      operationResult: { resultCode: 'future-result', resultMessage: 'OK' },
      pageNumber: 2,
      statementSummaries: [],
    })
    await expect(service.getStatementLogs(BASE_INPUT)).resolves.toEqual([
      { documentLogTypeCode: 200, processTypeCode: 'future-process' },
      { documentLogTypeCode: 'future-log', processTypeCode: null },
      { documentLogTypeCode: null },
      { documentLogTypeCode: '' },
    ])
    await expect(service.getAttachedFiles(BASE_INPUT)).resolves.toEqual([{ fileIdentifier: 'FILE-001' }, {}, { sequenceNumber: 2, fileSize: 0 }])
  })

  test('preserves email and charge classifications and recognizes common boolean spellings', async () => {
    const service = serviceWith({
      listEmailConfig: vi.fn<() => Promise<unknown>>(() =>
        Promise.resolve([
          { emailType: 'future-email', sendYN: 'pending' },
          { emailType: null, sendYN: null },
          { sendYN: ' Y ' },
          { sendYN: ' false ' },
          { sendYN: 1 },
        ])
      ),
      getChargeInfo: vi.fn<() => Promise<unknown>>(() => Promise.resolve({ unitCost: '001.0000', chargeMethod: 'future-charge', rateSystem: null })),
    } as unknown as Partial<CompatStatementService>)

    await expect(service.getEmailSendSettings({ businessNumber: BASE_INPUT.businessNumber })).resolves.toEqual([
      { emailTypeCode: 'future-email', sendEnabled: 'pending' },
      { emailTypeCode: null, sendEnabled: null },
      { sendEnabled: true },
      { sendEnabled: false },
      { sendEnabled: true },
    ])
    await expect(service.getChargeInfo(BASE_INPUT)).resolves.toEqual({ unitCost: '001.0000', chargeMethod: 'future-charge', rateSystem: null })
  })

  test('describes open provider output values without opening document input enums', () => {
    expectTypeOf<StatementOperationResult['resultCode']>().toEqualTypeOf<number | string | null | undefined>()
    expectTypeOf<StatementInfo['stateCode']>().toEqualTypeOf<number | string | null | undefined>()
    expectTypeOf<StatementDocumentOutput['documentTypeCode']>().toEqualTypeOf<number | string | null | undefined>()
    expectTypeOf<StatementDocumentOutput['sendTextMessage']>().toEqualTypeOf<boolean | string | number | null | undefined>()
    expectTypeOf<StatementDocumentInput['documentTypeCode']>().toEqualTypeOf<121 | 122 | 123 | 124 | 125 | 126>()
    expectTypeOf<StatementDocumentInput['sendTextMessage']>().toEqualTypeOf<boolean | undefined>()
  })
})
