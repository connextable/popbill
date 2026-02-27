import { TAX_INVOICE_METHODS } from '@/constants'
import { createInputValidationError } from '@connextable/popbill-compat/errors'
import { PopbillErrorStage, PopbillErrorType } from '@/errors'
import { createTaxInvoiceService } from '@/services/tax-invoice'
import { mapTaxInvoiceDocument } from '@/services/tax-invoice/mappers/document'
import type { TaxInvoiceDocumentInput, TaxInvoiceService } from '@/services/tax-invoice/types'
import { createTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import type { TaxInvoiceGetInfoApiResponse } from '@connextable/popbill-spec'

type CompatTaxInvoiceService = Parameters<typeof createTaxInvoiceService>[0]['compatTaxInvoiceService']

interface ForwardingCase {
  facadeMethod: Extract<keyof TaxInvoiceService, string>
  compatMethod: Extract<keyof CompatTaxInvoiceService, string>
  invoke: (service: TaxInvoiceService) => Promise<unknown>
  expectedArgs: unknown[]
  response: unknown
  expectedResult?: Record<string, unknown>
}

function createCompatServiceStub(overrides: Partial<CompatTaxInvoiceService>): CompatTaxInvoiceService {
  const baseService = createTaxinvoicePromiseService({
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: true,
  })

  return Object.assign(baseService, overrides)
}

const BUSINESS_NUMBER = '1234567890'
const INVOICE_DOCUMENT_KEY_TYPE = 'SELL'
const INVOICE_MANAGEMENT_KEY = 'MGT-001'
const USER_ID = 'tester'

const TAX_INVOICE_DOCUMENT: TaxInvoiceDocumentInput = {
  writtenDate: '20260225',
  lineItems: [{ lineNumber: 1 }],
  additionalContacts: [{ sequenceNumber: 1, emailAddress: 'test@test.com' }],
}
const TAX_INVOICE_API_DOCUMENT = mapTaxInvoiceDocument(TAX_INVOICE_DOCUMENT)

const BASE_DOCUMENT_INPUT = {
  businessNumber: BUSINESS_NUMBER,
  invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
  invoiceManagementKey: INVOICE_MANAGEMENT_KEY,
} as const

const API_RESPONSE = { code: 1, message: 'OK' }
const ISSUE_RESPONSE = { code: 1, message: 'OK', ntsConfirmNum: 'NTS-1', issueDT: '20260225120000' }
const BULK_SUBMIT_RESPONSE = { code: 1, message: 'OK', receiptID: 'RID-1' }
const BULK_RESULT_RESPONSE = { code: 1, message: 'OK', submitID: 'SUBMIT-1', txState: 2 }
const XML_RESPONSE = { code: 1, message: 'OK', retObject: '<xml />' }
const SEARCH_RESPONSE = { code: 1, message: 'OK', list: [] }
const URL_RESPONSE = 'https://popbill.test/url'
const SEAL_URL_RESPONSE = { url: 'https://popbill.test/seal' }
const TAX_CERT_URL_RESPONSE = { url: 'https://popbill.test/cert' }
const TAX_CERT_INFO_RESPONSE = { regDT: '20260225120000' }
const FILES_RESPONSE = [{ attachedFile: 'FILE-1' }]
const EMAIL_CONFIG_RESPONSE = [{ emailType: 'TAX_ISSUE', sendYN: true }]
const SEND_TO_NTS_CONFIG_RESPONSE = { sendToNTS: true }

const INVOICE_INFO_RAW_RESPONSE: TaxInvoiceGetInfoApiResponse = {
  itemKey: 'ITEM-1',
  taxType: '과세',
  writeDate: '20260225',
  regDT: '20260225120000',
  issueType: '정발행',
  supplyCostTotal: '10000',
  taxTotal: '1000',
  purposeType: '영수',
  issueDT: '20260225120000',
  lateIssueYN: 'false',
  openYN: false,
  stateMemo: '발행 완료',
  stateCode: 300,
  stateDT: '20260225120001',
  ntsconfirmNum: 'NTS-1',
  interOPYN: 'true',
  invoicerCorpName: '공급자',
  invoicerCorpNum: '1234567890',
  invoicerMgtKey: 'SELL-1',
  invoicerPrintYN: 'false',
  invoiceeCorpName: '공급받는자',
  invoiceeCorpNum: '8888888888',
  invoiceeMgtKey: 'BUY-1',
  invoiceePrintYN: 'true',
}

const FORWARDING_CASES: ForwardingCase[] = [
  // 발행/전송
  {
    facadeMethod: 'issueInvoiceImmediately',
    compatMethod: 'registIssue',
    invoke: (service) =>
      service.issueInvoiceImmediately({
        businessNumber: BUSINESS_NUMBER,
        taxInvoiceDocument: TAX_INVOICE_DOCUMENT,
        writeSpecification: true,
        forceIssue: false,
        historyMemo: 'memo',
        emailSubject: 'subject',
        dealInvoiceManagementKey: 'DEAL-1',
      }),
    expectedArgs: [BUSINESS_NUMBER, TAX_INVOICE_API_DOCUMENT, true, false, 'memo', 'subject', 'DEAL-1', USER_ID],
    response: ISSUE_RESPONSE,
  },
  {
    facadeMethod: 'submitBulkIssue',
    compatMethod: 'bulkSubmit',
    invoke: (service) =>
      service.submitBulkIssue({
        businessNumber: BUSINESS_NUMBER,
        submissionIdentifier: 'SUBMIT-1',
        taxInvoiceDocuments: [TAX_INVOICE_DOCUMENT],
        forceIssue: true,
      }),
    expectedArgs: [BUSINESS_NUMBER, 'SUBMIT-1', [TAX_INVOICE_API_DOCUMENT], true, USER_ID],
    response: BULK_SUBMIT_RESPONSE,
  },
  {
    facadeMethod: 'getBulkIssueSubmissionResult',
    compatMethod: 'getBulkResult',
    invoke: (service) =>
      service.getBulkIssueSubmissionResult({
        businessNumber: BUSINESS_NUMBER,
        submissionIdentifier: 'SUBMIT-1',
      }),
    expectedArgs: [BUSINESS_NUMBER, 'SUBMIT-1', USER_ID],
    response: BULK_RESULT_RESPONSE,
  },
  {
    facadeMethod: 'registerInvoice',
    compatMethod: 'register',
    invoke: (service) =>
      service.registerInvoice({
        businessNumber: BUSINESS_NUMBER,
        taxInvoiceDocument: TAX_INVOICE_DOCUMENT,
      }),
    expectedArgs: [BUSINESS_NUMBER, TAX_INVOICE_API_DOCUMENT, USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'updateInvoice',
    compatMethod: 'update',
    invoke: (service) =>
      service.updateInvoice({
        ...BASE_DOCUMENT_INPUT,
        taxInvoiceDocument: TAX_INVOICE_DOCUMENT,
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      TAX_INVOICE_API_DOCUMENT,
      USER_ID,
    ],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'issueInvoice',
    compatMethod: 'issue',
    invoke: (service) =>
      service.issueInvoice({
        ...BASE_DOCUMENT_INPUT,
        historyMemo: 'memo',
        emailSubject: 'subject',
        forceIssue: true,
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      'memo',
      'subject',
      true,
      USER_ID,
    ],
    response: ISSUE_RESPONSE,
  },
  {
    facadeMethod: 'cancelIssuedInvoice',
    compatMethod: 'cancelIssue',
    invoke: (service) =>
      service.cancelIssuedInvoice({
        ...BASE_DOCUMENT_INPUT,
        historyMemo: 'memo',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'memo', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'requestReverseIssueImmediately',
    compatMethod: 'registRequest',
    invoke: (service) =>
      service.requestReverseIssueImmediately({
        businessNumber: BUSINESS_NUMBER,
        taxInvoiceDocument: TAX_INVOICE_DOCUMENT,
        historyMemo: 'memo',
      }),
    expectedArgs: [BUSINESS_NUMBER, TAX_INVOICE_API_DOCUMENT, 'memo', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'requestReverseIssue',
    compatMethod: 'request',
    invoke: (service) =>
      service.requestReverseIssue({
        ...BASE_DOCUMENT_INPUT,
        historyMemo: 'memo',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'memo', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'cancelReverseIssueRequest',
    compatMethod: 'cancelRequest',
    invoke: (service) =>
      service.cancelReverseIssueRequest({
        ...BASE_DOCUMENT_INPUT,
        historyMemo: 'memo',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'memo', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'refuseReverseIssueRequest',
    compatMethod: 'refuse',
    invoke: (service) =>
      service.refuseReverseIssueRequest({
        ...BASE_DOCUMENT_INPUT,
        historyMemo: 'memo',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'memo', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'deleteInvoice',
    compatMethod: 'delete',
    invoke: (service) => service.deleteInvoice(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'sendInvoiceToNTS',
    compatMethod: 'sendToNTS',
    invoke: (service) => service.sendInvoiceToNTS(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: API_RESPONSE,
  },

  // 정보확인
  {
    facadeMethod: 'getInvoiceInfo',
    compatMethod: 'getInfo',
    invoke: (service) => service.getInvoiceInfo(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: INVOICE_INFO_RAW_RESPONSE,
    expectedResult: {
      itemKey: 'ITEM-1',
      writtenDate: '20260225',
      registeredAt: '20260225120000',
      stateCode: 300,
      isLateIssued: false,
      isOpen: false,
      isApiLinkedDocument: true,
      supplierCompanyName: '공급자',
      buyerCompanyName: '공급받는자',
    },
  },
  {
    facadeMethod: 'getInvoicesInfo',
    compatMethod: 'getInfos',
    invoke: (service) =>
      service.getInvoicesInfo({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        invoiceManagementKeys: ['MGT-1', 'MGT-2'],
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, ['MGT-1', 'MGT-2'], USER_ID],
    response: [INVOICE_INFO_RAW_RESPONSE],
  },
  {
    facadeMethod: 'getInvoiceDetailInfo',
    compatMethod: 'getDetailInfo',
    invoke: (service) => service.getInvoiceDetailInfo(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: TAX_INVOICE_API_DOCUMENT,
  },
  {
    facadeMethod: 'checkInvoiceManagementKeyInUse',
    compatMethod: 'checkMgtKeyInUse',
    invoke: (service) => service.checkInvoiceManagementKeyInUse(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: true,
  },
  {
    facadeMethod: 'getInvoiceXML',
    compatMethod: 'getXML',
    invoke: (service) => service.getInvoiceXML(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: XML_RESPONSE,
  },
  {
    facadeMethod: 'searchInvoices',
    compatMethod: 'search',
    invoke: (service) =>
      service.searchInvoices({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        searchDateType: 'R',
        startDate: '20260201',
        endDate: '20260228',
        invoiceStateCodes: ['100', '300'],
        invoiceTypeCodes: ['N'],
        taxationTypeCodes: ['T'],
        lateIssueOnly: null,
        sortOrder: 'D',
        pageNumber: 1,
        pageSize: 500,
        taxRegistrationIdentifierType: 'S',
        taxRegistrationIdentifierAvailability: '1',
        taxRegistrationIdentifier: '0001',
        queryText: 'query',
        interoperabilityType: '1',
        issueTypeCodes: ['N'],
        registrationTypeCodes: ['P'],
        closeDownStateCodes: ['0', '4'],
        invoiceManagementKeyOrNationalTaxServiceConfirmationNumber: 'MGT-001',
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      'R',
      '20260201',
      '20260228',
      ['100', '300'],
      ['N'],
      ['T'],
      null,
      'D',
      1,
      500,
      'S',
      '1',
      '0001',
      'query',
      '1',
      USER_ID,
      ['N'],
      ['P'],
      [0, 4],
      'MGT-001',
    ],
    response: SEARCH_RESPONSE,
  },
  {
    facadeMethod: 'getInvoiceLogs',
    compatMethod: 'getLogs',
    invoke: (service) => service.getInvoiceLogs(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: [{ log: '발행 완료' }],
  },
  {
    facadeMethod: 'getTaxInvoiceBoxURL',
    compatMethod: 'getURL',
    invoke: (service) =>
      service.getTaxInvoiceBoxURL({
        businessNumber: BUSINESS_NUMBER,
        taxInvoiceBoxScope: 'TBOX',
      }),
    expectedArgs: [BUSINESS_NUMBER, 'TBOX', USER_ID],
    response: URL_RESPONSE,
  },

  // 보기/인쇄
  {
    facadeMethod: 'getInvoicePopupURL',
    compatMethod: 'getPopUpURL',
    invoke: (service) => service.getInvoicePopupURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getInvoiceViewURL',
    compatMethod: 'getViewURL',
    invoke: (service) => service.getInvoiceViewURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getSupplierInvoicePrintURL',
    compatMethod: 'getPrintURL',
    invoke: (service) => service.getSupplierInvoicePrintURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getBuyerInvoicePrintURL',
    compatMethod: 'getEPrintURL',
    invoke: (service) => service.getBuyerInvoicePrintURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getBulkInvoicePrintURL',
    compatMethod: 'getMassPrintURL',
    invoke: (service) =>
      service.getBulkInvoicePrintURL({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        invoiceManagementKeys: ['MGT-1', 'MGT-2'],
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, ['MGT-1', 'MGT-2'], USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getInvoiceMailURL',
    compatMethod: 'getMailURL',
    invoke: (service) => service.getInvoiceMailURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },
  {
    facadeMethod: 'getInvoicePDFURL',
    compatMethod: 'getPDFURL',
    invoke: (service) => service.getInvoicePDFURL(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: URL_RESPONSE,
  },

  // 부가기능
  {
    facadeMethod: 'getSealAndAttachmentRegistrationURL',
    compatMethod: 'getSealURL',
    invoke: (service) => service.getSealAndAttachmentRegistrationURL({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: SEAL_URL_RESPONSE,
  },
  {
    facadeMethod: 'attachFileFromPath',
    compatMethod: 'attachFile',
    invoke: (service) =>
      service.attachFileFromPath({
        ...BASE_DOCUMENT_INPUT,
        displayName: 'invoice.pdf',
        filePath: '/tmp/invoice.pdf',
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      'invoice.pdf',
      '/tmp/invoice.pdf',
      USER_ID,
    ],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'attachFileFromBinary',
    compatMethod: 'attachFileBinary',
    invoke: (service) =>
      service.attachFileFromBinary({
        ...BASE_DOCUMENT_INPUT,
        fileName: 'invoice.pdf',
        fileData: Buffer.from('file-bytes'),
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      {
        fileName: 'invoice.pdf',
        fileData: Buffer.from('file-bytes'),
      },
      USER_ID,
    ],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'deleteAttachedFile',
    compatMethod: 'deleteFile',
    invoke: (service) =>
      service.deleteAttachedFile({
        ...BASE_DOCUMENT_INPUT,
        fileIdentifier: 'FILE-1',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'FILE-1', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'getAttachedFiles',
    compatMethod: 'getFiles',
    invoke: (service) => service.getAttachedFiles(BASE_DOCUMENT_INPUT),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, USER_ID],
    response: FILES_RESPONSE,
  },
  {
    facadeMethod: 'resendInvoiceEmail',
    compatMethod: 'sendEmail',
    invoke: (service) =>
      service.resendInvoiceEmail({
        ...BASE_DOCUMENT_INPUT,
        receiverEmailAddress: 'receiver@test.com',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 'receiver@test.com', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'resendInvoiceSMS',
    compatMethod: 'sendSMS',
    invoke: (service) =>
      service.resendInvoiceSMS({
        ...BASE_DOCUMENT_INPUT,
        senderPhoneNumber: '01012345678',
        receiverPhoneNumber: '01099998888',
        messageBody: '문자 테스트',
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      '01012345678',
      '01099998888',
      '문자 테스트',
      USER_ID,
    ],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'resendInvoiceFAX',
    compatMethod: 'sendFAX',
    invoke: (service) =>
      service.resendInvoiceFAX({
        ...BASE_DOCUMENT_INPUT,
        senderNumber: '0212345678',
        receiverNumber: '0288889999',
      }),
    expectedArgs: [
      BUSINESS_NUMBER,
      INVOICE_DOCUMENT_KEY_TYPE,
      INVOICE_MANAGEMENT_KEY,
      '0212345678',
      '0288889999',
      USER_ID,
    ],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'attachInvoiceStatement',
    compatMethod: 'attachStatement',
    invoke: (service) =>
      service.attachInvoiceStatement({
        ...BASE_DOCUMENT_INPUT,
        statementItemCode: 121,
        statementManagementKey: 'STMT-1',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 121, 'STMT-1', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'detachInvoiceStatement',
    compatMethod: 'detachStatement',
    invoke: (service) =>
      service.detachInvoiceStatement({
        ...BASE_DOCUMENT_INPUT,
        statementItemCode: 121,
        statementManagementKey: 'STMT-1',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, INVOICE_MANAGEMENT_KEY, 121, 'STMT-1', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'assignInvoiceManagementKey',
    compatMethod: 'assignMgtKey',
    invoke: (service) =>
      service.assignInvoiceManagementKey({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        itemKey: 'ITEM-1',
        invoiceManagementKey: 'MGT-NEW',
      }),
    expectedArgs: [BUSINESS_NUMBER, INVOICE_DOCUMENT_KEY_TYPE, 'ITEM-1', 'MGT-NEW', USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'getEmailSendSettings',
    compatMethod: 'listEmailConfig',
    invoke: (service) => service.getEmailSendSettings({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: EMAIL_CONFIG_RESPONSE,
  },
  {
    facadeMethod: 'updateEmailSendSettings',
    compatMethod: 'updateEmailConfig',
    invoke: (service) =>
      service.updateEmailSendSettings({
        businessNumber: BUSINESS_NUMBER,
        emailType: 'TAX_ISSUE',
        sendEnabled: true,
      }),
    expectedArgs: [BUSINESS_NUMBER, 'TAX_ISSUE', true, USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'getSendToNTSSettings',
    compatMethod: 'getSendToNTSConfig',
    invoke: (service) => service.getSendToNTSSettings({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: SEND_TO_NTS_CONFIG_RESPONSE,
  },

  // 인증서 관리
  {
    facadeMethod: 'getTaxCertificateRegistrationURL',
    compatMethod: 'getTaxCertURL',
    invoke: (service) => service.getTaxCertificateRegistrationURL({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: TAX_CERT_URL_RESPONSE,
  },
  {
    facadeMethod: 'getTaxCertificateExpirationDate',
    compatMethod: 'getCertificateExpireDate',
    invoke: (service) => service.getTaxCertificateExpirationDate({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: '20301231235959',
  },
  {
    facadeMethod: 'checkTaxCertificateValidation',
    compatMethod: 'checkCertValidation',
    invoke: (service) => service.checkTaxCertificateValidation({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: API_RESPONSE,
  },
  {
    facadeMethod: 'getTaxCertificateInfo',
    compatMethod: 'getTaxCertInfo',
    invoke: (service) => service.getTaxCertificateInfo({ businessNumber: BUSINESS_NUMBER }),
    expectedArgs: [BUSINESS_NUMBER, USER_ID],
    response: TAX_CERT_INFO_RESPONSE,
  },
]

const FORWARDING_CASES_WITH_EXPECTED_RESULT = FORWARDING_CASES.filter(
  (testCase): testCase is ForwardingCase & Required<Pick<ForwardingCase, 'expectedResult'>> =>
    testCase.expectedResult !== undefined
)

const FORWARDING_CASES_WITHOUT_EXPECTED_RESULT = FORWARDING_CASES.filter(
  (testCase) => testCase.expectedResult === undefined
)

describe('tax-invoice facade adapter', () => {
  test('forwarding cases cover all public methods', () => {
    const coveredMethods = [...new Set(FORWARDING_CASES.map((testCase) => testCase.facadeMethod))].sort()
    const publicMethods = [...TAX_INVOICE_METHODS].sort()

    expect(coveredMethods).toEqual(publicMethods)
    expect(coveredMethods).toHaveLength(46)
  })

  for (const testCase of FORWARDING_CASES_WITH_EXPECTED_RESULT) {
    test(`${testCase.facadeMethod} forwards to ${testCase.compatMethod}`, async () => {
      const compatMethodMock = vi.fn(() => Promise.resolve(testCase.response))
      const service = createTaxInvoiceService({
        defaultUserId: USER_ID,
        compatTaxInvoiceService: createCompatServiceStub({
          [testCase.compatMethod]: compatMethodMock,
        } as Partial<CompatTaxInvoiceService>),
      })

      const result = await testCase.invoke(service)

      expect(compatMethodMock).toHaveBeenCalledTimes(1)
      expect(compatMethodMock).toHaveBeenCalledWith(...testCase.expectedArgs)
      expect(result).toMatchObject(testCase.expectedResult)
    })
  }

  for (const testCase of FORWARDING_CASES_WITHOUT_EXPECTED_RESULT) {
    test(`${testCase.facadeMethod} forwards to ${testCase.compatMethod}`, async () => {
      const compatMethodMock = vi.fn(() => Promise.resolve(testCase.response))
      const service = createTaxInvoiceService({
        defaultUserId: USER_ID,
        compatTaxInvoiceService: createCompatServiceStub({
          [testCase.compatMethod]: compatMethodMock,
        } as Partial<CompatTaxInvoiceService>),
      })

      const result = await testCase.invoke(service)

      expect(compatMethodMock).toHaveBeenCalledTimes(1)
      expect(compatMethodMock).toHaveBeenCalledWith(...testCase.expectedArgs)
      expect(result).toBeDefined()
    })
  }

  test('uses client default userId when options are omitted', async () => {
    const getURL = vi.fn(() => Promise.resolve(URL_RESPONSE))
    const service = createTaxInvoiceService({
      defaultUserId: USER_ID,
      compatTaxInvoiceService: createCompatServiceStub({ getURL }),
    })

    await service.getTaxInvoiceBoxURL({
      businessNumber: BUSINESS_NUMBER,
      taxInvoiceBoxScope: 'TBOX',
    })

    expect(getURL).toHaveBeenCalledWith(BUSINESS_NUMBER, 'TBOX', USER_ID)
  })

  test('uses default userId when options are omitted', async () => {
    const getURL = vi.fn(() => Promise.resolve(URL_RESPONSE))
    const service = createTaxInvoiceService({
      compatTaxInvoiceService: createCompatServiceStub({ getURL }),
      defaultUserId: 'default-user',
    })

    await service.getTaxInvoiceBoxURL({
      businessNumber: BUSINESS_NUMBER,
      taxInvoiceBoxScope: 'TBOX',
    })

    expect(getURL).toHaveBeenCalledWith(BUSINESS_NUMBER, 'TBOX', 'default-user')
  })

  test('uses default userId even when options object is passed', async () => {
    const getURL = vi.fn(() => Promise.resolve(URL_RESPONSE))
    const service = createTaxInvoiceService({
      compatTaxInvoiceService: createCompatServiceStub({ getURL }),
      defaultUserId: 'default-user',
    })

    await service.getTaxInvoiceBoxURL({
      businessNumber: BUSINESS_NUMBER,
      taxInvoiceBoxScope: 'TBOX',
    })

    expect(getURL).toHaveBeenCalledWith(BUSINESS_NUMBER, 'TBOX', 'default-user')
  })

  test('throws input validation error when closeDownStateCodes include unsupported value', async () => {
    const search = vi.fn((..._args: unknown[]) => Promise.resolve(SEARCH_RESPONSE))
    const service = createTaxInvoiceService({
      defaultUserId: USER_ID,
      compatTaxInvoiceService: createCompatServiceStub({ search }),
    })
    const invalidSearchInput = {
      businessNumber: BUSINESS_NUMBER,
      invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
      searchDateType: 'R',
      startDate: '20260201',
      endDate: '20260228',
      invoiceStateCodes: ['100'],
      invoiceTypeCodes: ['N'],
      taxationTypeCodes: ['T'],
      lateIssueOnly: null,
      sortOrder: 'D',
      pageNumber: 1,
      pageSize: 500,
      closeDownStateCodes: ['N'],
    } as unknown as Parameters<TaxInvoiceService['searchInvoices']>[0]

    await expect(service.searchInvoices(invalidSearchInput)).rejects.toMatchObject({
      code: -99999999,
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.searchInvoices',
    })

    expect(search).not.toHaveBeenCalled()
  })

  test('keeps closeDownStateCodes undefined when the option is omitted', async () => {
    const search = vi.fn((..._args: unknown[]) => Promise.resolve(SEARCH_RESPONSE))
    const service = createTaxInvoiceService({
      defaultUserId: USER_ID,
      compatTaxInvoiceService: createCompatServiceStub({ search }),
    })

    await service.searchInvoices({
      businessNumber: BUSINESS_NUMBER,
      invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
      searchDateType: 'R',
      startDate: '20260201',
      endDate: '20260228',
      invoiceStateCodes: ['100'],
      invoiceTypeCodes: ['N'],
      taxationTypeCodes: ['T'],
      lateIssueOnly: null,
      sortOrder: 'D',
      pageNumber: 1,
      pageSize: 500,
    })

    expect(search).toHaveBeenCalledTimes(1)
    const firstCallArgs = search.mock.calls[0] as unknown[] | undefined
    expect(firstCallArgs?.[20]).toBeUndefined()
  })

  test('normalizes compat error even when onError is not provided', async () => {
    const validationError = Object.assign(
      new Error('invalid businessNumber'),
      createInputValidationError('invalid businessNumber', {
        stage: PopbillErrorStage.ValidateInput,
      })
    )
    const getInfo = vi.fn(() => Promise.reject(validationError))
    const service = createTaxInvoiceService({
      defaultUserId: USER_ID,
      compatTaxInvoiceService: createCompatServiceStub({ getInfo }),
    })

    await expect(
      service.getInvoiceInfo({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        invoiceManagementKey: INVOICE_MANAGEMENT_KEY,
      })
    ).rejects.toMatchObject({
      code: -99999999,
      message: 'invalid businessNumber',
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.getInvoiceInfo',
    })
  })

  test('normalizes compat error and preserves original error when onError throws', async () => {
    const validationError = Object.assign(
      new Error('invalid businessNumber'),
      createInputValidationError('invalid businessNumber', {
        stage: PopbillErrorStage.ValidateInput,
      })
    )
    const getInfo = vi.fn(() => Promise.reject(validationError))
    const onError = vi.fn(() => {
      throw new Error('onError should not override original error')
    })
    const service = createTaxInvoiceService({
      defaultUserId: USER_ID,
      compatTaxInvoiceService: createCompatServiceStub({ getInfo }),
      onError,
    })

    await expect(
      service.getInvoiceInfo({
        businessNumber: BUSINESS_NUMBER,
        invoiceDocumentKeyType: INVOICE_DOCUMENT_KEY_TYPE,
        invoiceManagementKey: INVOICE_MANAGEMENT_KEY,
      })
    ).rejects.toMatchObject({
      code: -99999999,
      message: 'invalid businessNumber',
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.getInvoiceInfo',
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'taxInvoice.getInvoiceInfo',
      })
    )
  })
})
