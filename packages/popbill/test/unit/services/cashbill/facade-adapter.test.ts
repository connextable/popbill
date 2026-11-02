import { createCashbillService, CASHBILL_METHODS, type CashbillApprovalDocumentInput, type CashbillService } from '@/services/cashbill'
import { mapCashbillDocumentOutput, mapCashbillInfo, mapCashbillBulkResult } from '@/services/cashbill/mappers/response'

type Compat = Parameters<typeof createCashbillService>[0]['compatCashbillService']
const businessNumber = '1234567890'
const userId = 'cash-user'
const base = { businessNumber, managementKey: 'CASH-001' }
const document: CashbillApprovalDocumentInput = {
  managementKey: 'CASH-001',
  transactionType: '승인거래',
  usageType: '소득공제용',
  taxType: '과세',
  tradeOption: '일반',
  transactedAt: '20261103120000',
  merchant: {
    businessNumber,
    taxRegistrationIdentifier: '0001',
    companyName: '가맹점',
    chiefExecutiveOfficerName: '대표',
    address: '서울',
    telephoneNumber: '0212345678',
  },
  buyer: { identificationNumber: '0100001234', customerName: '고객', emailAddress: 'buyer@example.test', mobilePhoneNumber: '01012345678' },
  payment: { totalAmount: '001100', supplyCostAmount: '001000', taxAmount: '000100', serviceFeeAmount: '0' },
  itemName: '상품',
  orderNumber: 'ORDER-001',
  sendTextMessage: false,
}
const rawDocument = {
  mgtKey: 'CASH-001',
  tradeType: '승인거래' as const,
  tradeUsage: '소득공제용' as const,
  taxationType: '과세' as const,
  tradeOpt: '일반' as const,
  tradeDT: '20261103120000',
  franchiseCorpNum: businessNumber,
  franchiseTaxRegID: '0001',
  franchiseCorpName: '가맹점',
  franchiseCEOName: '대표',
  franchiseAddr: '서울',
  franchiseTEL: '0212345678',
  identityNum: '0100001234',
  customerName: '고객',
  email: 'buyer@example.test',
  hp: '01012345678',
  totalAmount: '001100',
  supplyCost: '001000',
  tax: '000100',
  serviceFee: '0',
  itemName: '상품',
  orderNumber: 'ORDER-001',
  smssendYN: false,
}
const ok = { code: 1, message: 'Success' }
const link = 'https://test.popbill.com/cashbill'
interface Case {
  method: keyof CashbillService
  compatMethod: keyof Compat
  invoke: (service: CashbillService) => Promise<unknown>
  args: unknown[]
  response: unknown
}
const cases: Case[] = [
  {
    method: 'issueCashbillImmediately',
    compatMethod: 'registIssue',
    invoke: (service) => service.issueCashbillImmediately({ businessNumber, document, historyMemo: '메모', emailSubject: '제목' }),
    args: [businessNumber, rawDocument, '메모', userId, '제목'],
    response: ok,
  },
  {
    method: 'registerCashbill',
    compatMethod: 'register',
    invoke: (service) => service.registerCashbill({ businessNumber, document }),
    args: [businessNumber, rawDocument, userId],
    response: ok,
  },
  {
    method: 'updateCashbill',
    compatMethod: 'update',
    invoke: (service) => service.updateCashbill({ ...base, document }),
    args: [businessNumber, 'CASH-001', rawDocument, userId],
    response: ok,
  },
  {
    method: 'issueCashbill',
    compatMethod: 'issue',
    invoke: (service) => service.issueCashbill({ ...base, historyMemo: '메모' }),
    args: [businessNumber, 'CASH-001', '메모', userId],
    response: ok,
  },
  {
    method: 'cancelIssuedCashbill',
    compatMethod: 'cancelIssue',
    invoke: (service) => service.cancelIssuedCashbill({ ...base, historyMemo: '취소' }),
    args: [businessNumber, 'CASH-001', '취소', userId],
    response: ok,
  },
  {
    method: 'deleteCashbill',
    compatMethod: 'delete',
    invoke: (service) => service.deleteCashbill(base),
    args: [businessNumber, 'CASH-001', userId],
    response: ok,
  },
  {
    method: 'revokeCashbill',
    compatMethod: 'revokeRegistIssue',
    invoke: (service) =>
      service.revokeCashbill({
        ...base,
        originalConfirmationNumber: '123456789',
        originalTransactionDate: '20261103',
        sendTextMessage: false,
        historyMemo: '부분 취소',
        partialCancellation: true,
        cancellationReason: 1,
        payment: document.payment,
        emailSubject: '취소',
        transactedAt: '20261103130000',
      }),
    args: [
      businessNumber,
      'CASH-001',
      '123456789',
      '20261103',
      false,
      '부분 취소',
      userId,
      true,
      1,
      '001000',
      '000100',
      '0',
      '001100',
      '취소',
      '20261103130000',
    ],
    response: ok,
  },
  {
    method: 'registerCashbillRevocation',
    compatMethod: 'revokeRegister',
    invoke: (service) =>
      service.registerCashbillRevocation({
        ...base,
        originalConfirmationNumber: '123456789',
        originalTransactionDate: '20261103',
        sendTextMessage: false,
        partialCancellation: true,
        cancellationReason: 1,
        payment: document.payment,
      }),
    args: [businessNumber, 'CASH-001', '123456789', '20261103', false, userId, true, 1, '001000', '000100', '0', '001100'],
    response: ok,
  },
  {
    method: 'submitCashbills',
    compatMethod: 'bulkSubmit',
    invoke: (service) =>
      service.submitCashbills({
        businessNumber,
        submissionIdentifier: 'SUBMIT-001',
        documents: [document],
        historyMemo: '대량',
        emailSubject: '제목',
      }),
    args: [businessNumber, 'SUBMIT-001', [{ ...rawDocument, memo: '대량', emailSubject: '제목' }], userId],
    response: { ...ok, receiptID: 'RECEIPT-001' },
  },
  {
    method: 'getCashbillBulkResult',
    compatMethod: 'getBulkResult',
    invoke: (service) => service.getCashbillBulkResult({ businessNumber, submissionIdentifier: 'SUBMIT-001' }),
    args: [businessNumber, 'SUBMIT-001', userId],
    response: { ...ok, issueResult: [] },
  },
  {
    method: 'getCashbillInfo',
    compatMethod: 'getInfo',
    invoke: (service) => service.getCashbillInfo(base),
    args: [businessNumber, 'CASH-001', userId],
    response: rawDocument,
  },
  {
    method: 'getCashbillsInfo',
    compatMethod: 'getInfos',
    invoke: (service) => service.getCashbillsInfo({ businessNumber, managementKeys: ['CASH-001'] }),
    args: [businessNumber, ['CASH-001'], userId],
    response: [rawDocument],
  },
  {
    method: 'getCashbillDetailInfo',
    compatMethod: 'getDetailInfo',
    invoke: (service) => service.getCashbillDetailInfo(base),
    args: [businessNumber, 'CASH-001', userId],
    response: rawDocument,
  },
  {
    method: 'checkCashbillManagementKeyInUse',
    compatMethod: 'checkMgtKeyInUse',
    invoke: (service) => service.checkCashbillManagementKeyInUse(base),
    args: [businessNumber, 'CASH-001', userId],
    response: false,
  },
  {
    method: 'searchCashbills',
    compatMethod: 'search',
    invoke: (service) =>
      service.searchCashbills({
        businessNumber,
        searchDateType: 'T',
        startDate: '20261101',
        endDate: '20261103',
        stateCodes: ['3**'],
        transactionTypes: ['N'],
        usageTypes: ['P'],
        tradeOptions: ['B'],
        taxTypes: ['T'],
        queryText: '010',
        sortOrder: 'A',
        pageNumber: 2,
        pageSize: 100,
        merchantTaxRegistrationIdentifiers: ['0001', '0002'],
      }),
    args: [businessNumber, 'T', '20261101', '20261103', ['3**'], ['N'], ['P'], ['B'], ['T'], '010', 'A', 2, 100, '0001,0002', userId],
    response: { ...ok, list: [] },
  },
  {
    method: 'getCashbillLogs',
    compatMethod: 'getLogs',
    invoke: (service) => service.getCashbillLogs(base),
    args: [businessNumber, 'CASH-001', userId],
    response: [],
  },
  {
    method: 'getCashbillBoxURL',
    compatMethod: 'getURL',
    invoke: (service) => service.getCashbillBoxURL({ businessNumber, cashbillBoxScope: 'PBOX' }),
    args: [businessNumber, 'PBOX', userId],
    response: link,
  },
  {
    method: 'getCashbillPopupURL',
    compatMethod: 'getPopUpURL',
    invoke: (service) => service.getCashbillPopupURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'getCashbillViewURL',
    compatMethod: 'getViewURL',
    invoke: (service) => service.getCashbillViewURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'getCashbillPrintURL',
    compatMethod: 'getPrintURL',
    invoke: (service) => service.getCashbillPrintURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'getReceiverCashbillPrintURL',
    compatMethod: 'getEPrintURL',
    invoke: (service) => service.getReceiverCashbillPrintURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'getBulkCashbillPrintURL',
    compatMethod: 'getMassPrintURL',
    invoke: (service) => service.getBulkCashbillPrintURL({ businessNumber, managementKeys: ['CASH-001'] }),
    args: [businessNumber, ['CASH-001'], userId],
    response: link,
  },
  {
    method: 'getCashbillMailURL',
    compatMethod: 'getMailURL',
    invoke: (service) => service.getCashbillMailURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'getCashbillPDFURL',
    compatMethod: 'getPDFURL',
    invoke: (service) => service.getCashbillPDFURL(base),
    args: [businessNumber, 'CASH-001', userId],
    response: link,
  },
  {
    method: 'downloadCashbillPDF',
    compatMethod: 'getPDF',
    invoke: (service) => service.downloadCashbillPDF(base),
    args: [businessNumber, 'CASH-001', userId],
    response: Buffer.from('%PDF-1.7'),
  },
  {
    method: 'resendCashbillEmail',
    compatMethod: 'sendEmail',
    invoke: (service) => service.resendCashbillEmail({ ...base, receiverEmailAddress: 'buyer@example.test' }),
    args: [businessNumber, 'CASH-001', 'buyer@example.test', userId],
    response: ok,
  },
  {
    method: 'resendCashbillSMS',
    compatMethod: 'sendSMS',
    invoke: (service) =>
      service.resendCashbillSMS({ ...base, senderPhoneNumber: '07012345678', receiverPhoneNumber: '01012345678', messageBody: '발행' }),
    args: [businessNumber, 'CASH-001', '07012345678', '01012345678', '발행', userId],
    response: ok,
  },
  {
    method: 'resendCashbillFAX',
    compatMethod: 'sendFAX',
    invoke: (service) => service.resendCashbillFAX({ ...base, senderPhoneNumber: '07012345678', receiverPhoneNumber: '0212345678' }),
    args: [businessNumber, 'CASH-001', '07012345678', '0212345678', userId],
    response: ok,
  },
  {
    method: 'assignCashbillManagementKey',
    compatMethod: 'assignMgtKey',
    invoke: (service) => service.assignCashbillManagementKey({ ...base, itemKey: 'ITEM-001' }),
    args: [businessNumber, 'ITEM-001', 'CASH-001', userId],
    response: ok,
  },
  {
    method: 'getEmailSendSettings',
    compatMethod: 'listEmailConfig',
    invoke: (service) => service.getEmailSendSettings({ businessNumber }),
    args: [businessNumber, userId],
    response: [],
  },
  {
    method: 'updateEmailSendSettings',
    compatMethod: 'updateEmailConfig',
    invoke: (service) => service.updateEmailSendSettings({ businessNumber, emailTypeCode: 'CSH_ISSUE', sendEnabled: false }),
    args: [businessNumber, 'CSH_ISSUE', false, userId],
    response: ok,
  },
  {
    method: 'getChargeInfo',
    compatMethod: 'getChargeInfo',
    invoke: (service) => service.getChargeInfo({ businessNumber }),
    args: [businessNumber, userId],
    response: { unitCost: '10' },
  },
  {
    method: 'getUnitCost',
    compatMethod: 'getUnitCost',
    invoke: (service) => service.getUnitCost({ businessNumber }),
    args: [businessNumber],
    response: '10',
  },
]

describe('cashbill modern contracts', () => {
  it('covers all public methods', () => expect(cases.map((test) => test.method).sort()).toEqual([...CASHBILL_METHODS].sort()))
  it.each(cases)('$method forwards the documented positional arguments', async (test) => {
    const target = vi.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue(test.response)
    const compat = { [test.compatMethod]: target } as unknown as Compat
    const service = createCashbillService({ compatCashbillService: compat, defaultUserId: userId })
    await test.invoke(service)
    expect(target).toHaveBeenCalledExactlyOnceWith(...test.args)
    expect(document).not.toHaveProperty('memo')
    expect(document).not.toHaveProperty('emailSubject')
  })
  it('keeps identifiers, leading zero amounts, and false flags through round-trip mapping', () => {
    expect(mapCashbillDocumentOutput(rawDocument)).toEqual(document)
    expect(
      mapCashbillInfo({
        ...rawDocument,
        itemKey: 'ITEM',
        issueDT: '20261103120000',
        regDT: '20261103115959',
        stateCode: 304,
        stateDT: '20261103120100',
        stateMemo: '완료',
        ntssendDT: '20261104000000',
        ntsresultDT: '20261104091500',
        ntsresultCode: '0000',
        ntsresultMessage: '정상',
        printYN: false,
        interOPYN: true,
      })
    ).toEqual({
      ...document,
      itemKey: 'ITEM',
      issuedAt: '20261103120000',
      registeredAt: '20261103115959',
      stateCode: 304,
      stateChangedAt: '20261103120100',
      stateMemo: '완료',
      nationalTaxServiceSentAt: '20261104000000',
      nationalTaxServiceResultReceivedAt: '20261104091500',
      nationalTaxServiceResultCode: '0000',
      nationalTaxServiceResultMessage: '정상',
      isPrinted: false,
      isIssuedThroughAPI: true,
    })
  })
  it('preserves server batch clocks and individual issue outcomes', () => {
    expect(
      mapCashbillBulkResult({
        ...ok,
        submitID: 'SUBMIT',
        txState: 2,
        submitCount: 2,
        successCount: 1,
        failCount: 1,
        txStartDT: '20261103120000',
        txEndDT: '20261103120100',
        receiptDT: '20261103115959',
        receiptID: 'RECEIPT',
        txResultCode: 1,
        issueResult: [
          { ...ok, mgtKey: 'CASH-001', confirmNum: '123456789', tradeDate: '20261103', issueDT: '20261103120001' },
          { code: -1, message: '실패', mgtKey: 'CASH-002' },
        ],
      })
    ).toEqual({
      resultCode: 1,
      resultMessage: 'Success',
      submissionIdentifier: 'SUBMIT',
      submittedCount: 2,
      successCount: 1,
      failureCount: 1,
      processingStateCode: 2,
      processingResultCode: 1,
      processingStartedAt: '20261103120000',
      processingCompletedAt: '20261103120100',
      receivedAt: '20261103115959',
      receiptIdentifier: 'RECEIPT',
      issueResults: [
        {
          resultCode: 1,
          resultMessage: 'Success',
          managementKey: 'CASH-001',
          confirmationNumber: '123456789',
          transactionDate: '20261103',
          issuedAt: '20261103120001',
        },
        { resultCode: -1, resultMessage: '실패', managementKey: 'CASH-002' },
      ],
    })
  })
  it('does not manufacture omitted response fields', () => {
    expect(mapCashbillDocumentOutput({})).toEqual({})
    expect(mapCashbillInfo({})).toEqual({})
  })
  it.each([{ pageNumber: 0 }, { pageSize: 0 }, { startDate: '20260230' }, { startDate: '20261104' }])(
    'rejects invalid search before the compat call: %j',
    async (invalid) => {
      const target = vi.fn<Compat['search']>()
      const service = createCashbillService({ compatCashbillService: { search: target } as unknown as Compat, defaultUserId: userId })
      await expect(
        service.searchCashbills({ businessNumber, searchDateType: 'T', startDate: '20261101', endDate: '20261103', ...invalid })
      ).rejects.toMatchObject({ stage: 'validate_input' })
      expect(target).not.toHaveBeenCalled()
    }
  )
  it('leaves page-size limits to the provider', async () => {
    const target = vi.fn<Compat['search']>().mockResolvedValue({ ...ok, list: [] })
    const service = createCashbillService({ compatCashbillService: { search: target } as unknown as Compat, defaultUserId: userId })

    await service.searchCashbills({ businessNumber, searchDateType: 'T', startDate: '20261101', endDate: '20261103', pageSize: 1001 })

    expect(target.mock.calls[0]?.[12]).toBe(1001)
  })
  it.each(['revokeCashbill', 'registerCashbillRevocation'] as const)('attributes invalid partial cancellation to %s', async (method) => {
    const service = createCashbillService({ compatCashbillService: {} as Compat, defaultUserId: userId })
    const input = {
      ...base,
      originalConfirmationNumber: '123456789',
      originalTransactionDate: '20261103',
      partialCancellation: true,
    } as Parameters<CashbillService[typeof method]>[0]

    await expect(service[method](input)).rejects.toMatchObject({
      operation: `cashbill.${method}`,
      stage: 'validate_input',
    })
  })
  it('preserves newly added provider processing state codes', () => {
    expect(mapCashbillBulkResult({ ...ok, txState: 99 }).processingStateCode).toBe(99)
  })
  it('keeps the original API error when the error hook throws', async () => {
    const apiError = { code: -14000003, message: '문서 없음' }
    const service = createCashbillService({
      compatCashbillService: { getInfo: vi.fn<Compat['getInfo']>().mockRejectedValue(apiError) } as unknown as Compat,
      defaultUserId: userId,
      onError: () => {
        throw new Error('hook failure')
      },
    })
    await expect(service.getCashbillInfo(base)).rejects.toMatchObject({
      code: -14000003,
      message: '문서 없음',
      operation: 'cashbill.getCashbillInfo',
    })
  })
  it('has no legacy aliases in the modern service', () => {
    const service = createCashbillService({ compatCashbillService: {} as Compat, defaultUserId: userId })
    expect(service).not.toHaveProperty('registIssue')
    expect(service).not.toHaveProperty('revokeRegistIssue')
    expect(service).not.toHaveProperty('getPDF')
  })
})
