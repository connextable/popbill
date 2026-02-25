import { PopbillErrorStage, PopbillErrorType, createInputValidationError } from '@/errors'
import { createTaxInvoiceService } from '@/services/tax-invoice'
import { createTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import type { TaxInvoiceApiModel } from '@connextable/popbill-spec'

type CompatTaxInvoiceService = Parameters<typeof createTaxInvoiceService>[0]['compatTaxInvoiceService']

function createCompatServiceStub(overrides: Partial<CompatTaxInvoiceService>): CompatTaxInvoiceService {
  const baseService = createTaxinvoicePromiseService({
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: true,
  })

  return Object.assign(baseService, overrides)
}

describe('tax-invoice facade adapter', () => {
  test('maps issueInvoiceImmediately to registIssue', async () => {
    const taxInvoiceDocument: TaxInvoiceApiModel = {}
    const registIssue = vi.fn(async () => ({ code: 1, message: 'OK' }))
    const service = createTaxInvoiceService({
      compatTaxInvoiceService: createCompatServiceStub({ registIssue }),
    })

    await service.issueInvoiceImmediately({
      businessNumber: '1234567890',
      taxInvoiceDocument,
      writeSpecification: true,
      forceIssue: false,
      historyMemo: 'memo',
      emailSubject: 'subject',
      dealInvoiceManagementKey: 'DEAL-1',
    }, { userId: 'tester' })

    expect(registIssue).toHaveBeenCalledWith(
      '1234567890',
      taxInvoiceDocument,
      true,
      false,
      'memo',
      'subject',
      'DEAL-1',
      'tester',
    )
  })

  test('maps renamed lookup methods to compat method names', async () => {
    const getURL = vi.fn(async () => 'https://popbill.test/box')
    const checkMgtKeyInUse = vi.fn(async () => true)
    const getFiles = vi.fn(async () => [])
    const listEmailConfig = vi.fn(async () => [])
    const getCertificateExpireDate = vi.fn(async () => '20301231235959')

    const service = createTaxInvoiceService({
      compatTaxInvoiceService: createCompatServiceStub({
        getURL,
        checkMgtKeyInUse,
        getFiles,
        listEmailConfig,
        getCertificateExpireDate,
      }),
    })

    await service.getTaxInvoiceBoxURL({
      businessNumber: '1234567890',
      taxInvoiceBoxScope: 'TBOX',
    }, { userId: 'tester' })

    await service.checkInvoiceManagementKeyInUse({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: 'MGT-1',
    }, { userId: 'tester' })

    await service.getAttachedFiles({
      businessNumber: '1234567890',
      invoiceDocumentKeyType: 'SELL',
      invoiceManagementKey: 'MGT-2',
    }, { userId: 'tester' })

    await service.getEmailSendSettings({
      businessNumber: '1234567890',
    }, { userId: 'tester' })

    await service.getTaxCertificateExpirationDate({
      businessNumber: '1234567890',
    }, { userId: 'tester' })

    expect(getURL).toHaveBeenCalledWith('1234567890', 'TBOX', 'tester')
    expect(checkMgtKeyInUse).toHaveBeenCalledWith('1234567890', 'SELL', 'MGT-1', 'tester')
    expect(getFiles).toHaveBeenCalledWith('1234567890', 'SELL', 'MGT-2', 'tester')
    expect(listEmailConfig).toHaveBeenCalledWith('1234567890', 'tester')
    expect(getCertificateExpireDate).toHaveBeenCalledWith('1234567890', 'tester')
  })

  test('normalizes compat error and preserves original error when onError throws', async () => {
    const validationError = createInputValidationError('invalid businessNumber', {
      stage: PopbillErrorStage.ValidateInput,
    })
    const getInfo = vi.fn(async () => {
      throw validationError
    })
    const onError = vi.fn(() => {
      throw new Error('onError should not override original error')
    })
    const service = createTaxInvoiceService({
      compatTaxInvoiceService: createCompatServiceStub({ getInfo }),
      onError,
    })

    await expect(
      service.getInvoiceInfo({
        businessNumber: '1234567890',
        invoiceDocumentKeyType: 'SELL',
        invoiceManagementKey: 'MGT-1',
      }, { userId: 'tester' }),
    ).rejects.toMatchObject({
      code: -99999999,
      message: 'invalid businessNumber',
      type: PopbillErrorType.InputValidation,
      stage: PopbillErrorStage.ValidateInput,
      operation: 'taxInvoice.getInvoiceInfo',
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      operation: 'taxInvoice.getInvoiceInfo',
    }))
  })
})
