import {
  mapCashbillBulkResult,
  mapCashbillDocumentOutput,
  mapCashbillEmailSendSetting,
  mapCashbillInfo,
  mapCashbillLog,
  mapCashbillOperationResult,
  mapCashbillSearchResult,
} from '@/services/cashbill/mappers/response'

describe('cashbill provider response tolerance', () => {
  it.each([
    ['301', 301],
    [999, 999],
    ['future-state', 'future-state'],
    ['1.5', '1.5'],
    ['9007199254740993', '9007199254740993'],
    ['', ''],
    ['  ', '  '],
    [null, null],
  ])('preserves state and cancellation codes %j without inventing zero or NaN', (value, expected) => {
    const response = { stateCode: value, cancelType: value } as unknown as Parameters<typeof mapCashbillInfo>[0]

    expect(mapCashbillInfo(response)).toEqual({ stateCode: expected, cancellationReason: expected })
  })

  it.each([
    [true, true],
    [false, false],
    [' Y ', true],
    ['n', false],
    ['TRUE', true],
    ['false', false],
    ['1', true],
    ['0', false],
    [1, true],
    [0, false],
    ['future-flag', 'future-flag'],
    ['', ''],
    [2, 2],
    [null, null],
  ])('preserves flags %j while normalizing recognized boolean values', (value, expected) => {
    const info = { printYN: value, interOPYN: value, smssendYN: value } as unknown as Parameters<typeof mapCashbillInfo>[0]
    const settings = { emailType: 'FUTURE_EMAIL', sendYN: value } as unknown as Parameters<typeof mapCashbillEmailSendSetting>[0]

    expect(mapCashbillInfo(info)).toEqual({ isPrinted: expected, isIssuedThroughAPI: expected, sendTextMessage: expected })
    expect(mapCashbillEmailSendSetting(settings)).toEqual({ emailTypeCode: 'FUTURE_EMAIL', sendEnabled: expected })
  })

  it('preserves future and nullable operation, batch, individual issue, and log codes', () => {
    const response = {
      code: 'future-result',
      message: 'processing',
      txState: 'future-processing',
      txResultCode: null,
      issueResult: [
        { code: null, message: 'pending' },
        { code: '2', message: 'success' },
      ],
    } as unknown as Parameters<typeof mapCashbillBulkResult>[0]
    const log = { docLogType: 'future-log', procType: null } as unknown as Parameters<typeof mapCashbillLog>[0]

    expect(mapCashbillBulkResult(response)).toEqual({
      resultCode: 'future-result',
      resultMessage: 'processing',
      processingStateCode: 'future-processing',
      processingResultCode: null,
      issueResults: [
        { resultCode: null, resultMessage: 'pending' },
        { resultCode: 2, resultMessage: 'success' },
      ],
    })
    expect(mapCashbillLog(log)).toEqual({ documentLogTypeCode: 'future-log', processTypeCode: null })
    expect(mapCashbillLog({ docLogType: '42' } as unknown as Parameters<typeof mapCashbillLog>[0])).toEqual({ documentLogTypeCode: 42 })
    expect(mapCashbillOperationResult({ code: '1', message: 'success' } as unknown as Parameters<typeof mapCashbillOperationResult>[0])).toEqual({
      resultCode: 1,
      resultMessage: 'success',
    })
    expect(mapCashbillOperationResult({ message: 'pending' } as Parameters<typeof mapCashbillOperationResult>[0])).toEqual({
      resultCode: undefined,
      resultMessage: 'pending',
    })
  })

  it('normalizes quantitative strings without treating null, booleans, or blanks as zero', () => {
    const bulk = {
      code: 1,
      message: 'success',
      submitCount: '3',
      successCount: null,
      failCount: false,
    } as unknown as Parameters<typeof mapCashbillBulkResult>[0]
    const search = {
      code: 1,
      message: 'success',
      pageNum: '2',
      perPage: ' 100 ',
      pageCount: ' ',
      total: null,
    } as unknown as Parameters<typeof mapCashbillSearchResult>[0]

    expect(mapCashbillBulkResult(bulk)).toEqual({ resultCode: 1, resultMessage: 'success', submittedCount: 3, issueResults: [] })
    expect(mapCashbillSearchResult(search)).toEqual({
      operationResult: { resultCode: 1, resultMessage: 'success' },
      pageNumber: 2,
      pageSize: 100,
      cashbillSummaries: [],
    })
  })

  it('preserves future document classifications, monetary text, and padded text identifiers', () => {
    const response = {
      tradeType: 'future-transaction',
      tradeUsage: null,
      tradeOpt: 'future-option',
      taxationType: 'future-tax',
      cancelType: 'future-reason',
      totalAmount: '9007199254740993.0001',
      supplyCost: '000010.5000',
      tax: '0001.0500',
      serviceFee: '0.0000',
      identityNum: '0000123456',
      ntsresultCode: '0000',
    } as unknown as Parameters<typeof mapCashbillInfo>[0]

    expect(mapCashbillInfo(response)).toEqual({
      transactionType: 'future-transaction',
      usageType: null,
      tradeOption: 'future-option',
      taxType: 'future-tax',
      buyer: { identificationNumber: '0000123456' },
      payment: { totalAmount: '9007199254740993.0001', supplyCostAmount: '000010.5000', taxAmount: '0001.0500', serviceFeeAmount: '0.0000' },
      cancellationReason: 'future-reason',
      nationalTaxServiceResultCode: '0000',
    })
  })

  it('omits absent optional fields', () => {
    expect(mapCashbillInfo({})).toEqual({})
    expect(mapCashbillDocumentOutput({})).toEqual({})
    expect(mapCashbillEmailSendSetting({})).toEqual({})
    expect(mapCashbillLog({})).toEqual({})
  })
})
