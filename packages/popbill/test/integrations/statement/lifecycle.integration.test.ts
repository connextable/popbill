import { StatementItemCodes } from '@/index'
import {
  createStatementDocument,
  createStatementIntegrationContext,
  describeStatementIntegration,
  withOwnedDraftInvoice,
  withOwnedStatement,
} from './integration-context'

describeStatementIntegration('popbill statement real integration', () => {
  test('registers, updates, issues, reads, cancels and deletes an owned statement', async () => {
    const context = createStatementIntegrationContext()
    await withOwnedStatement(context, async (managementKey) => {
      const key = { businessNumber: context.businessNumber, documentTypeCode: StatementItemCodes.TradeStatement, managementKey }
      const document = createStatementDocument(context, managementKey)
      expect((await context.service.registerStatement({ businessNumber: context.businessNumber, document })).resultCode).toBe(1)
      expect((await context.service.getStatementInfo(key)).stateCode).toBe(100)
      expect(
        (await context.service.updateStatement({ ...key, document: { ...document, remarkOne: 'updated integration statement' } })).resultCode
      ).toBe(1)
      expect((await context.service.getStatementDetailInfo(key)).remarkOne).toBe('updated integration statement')
      expect((await context.service.issueStatement({ ...key, historyMemo: 'integration issue' })).resultCode).toBe(1)
      expect((await context.service.getStatementViewURL(key)).accessUrl).toMatch(/^https?:\/\//)
      expect((await context.service.getStatementInfo(key)).managementKey).toBe(managementKey)
      expect((await context.service.cancelIssuedStatement({ ...key, historyMemo: 'integration cancel' })).resultCode).toBe(1)
      expect((await context.service.getStatementInfo(key)).stateCode).toBe(500)
      expect((await context.service.deleteStatement(key)).resultCode).toBe(1)
      expect((await context.service.checkStatementManagementKeyInUse(key)).isInUse).toBe(false)
    })
  }, 180_000)

  test('issues immediately and connects the created statement to a tax invoice', async () => {
    const context = createStatementIntegrationContext()
    await withOwnedStatement(context, async (managementKey) => {
      const document = createStatementDocument(context, managementKey)
      const issued = await context.service.issueStatementImmediately({ businessNumber: context.businessNumber, document })
      expect(issued.resultCode).toBe(1)
      expect(issued.documentNumber).toBeTruthy()
      expect(
        (
          await context.service.getStatementInfo({
            businessNumber: context.businessNumber,
            documentTypeCode: StatementItemCodes.TradeStatement,
            managementKey,
          })
        ).stateCode,
        'Enable automatic acceptance in the sandbox statement settings before running the attachment test'
      ).toBe(300)
      await withOwnedDraftInvoice(context, `${managementKey.slice(0, 22)}TI`, async (invoiceKey) => {
        const invoice = context.client.services.taxInvoice
        expect(
          (
            await invoice.registerInvoice({
              businessNumber: context.businessNumber,
              taxInvoiceDocument: {
                writtenDate: document.writtenDate,
                chargeDirection: '정과금',
                issueType: '정발행',
                purposeType: '청구',
                taxType: '과세',
                supplier: { ...document.sender, managementKey: invoiceKey.invoiceManagementKey },
                buyer: { ...document.receiver, recipientType: '사업자' },
                paymentSummary: document.paymentSummary,
                lineItems: document.lineItems,
              },
            })
          ).resultCode
        ).toBe(1)
        const attachment = { ...invoiceKey, statementItemCode: StatementItemCodes.TradeStatement, statementManagementKey: managementKey }
        expect((await invoice.attachInvoiceStatement(attachment)).resultCode).toBe(1)
        expect((await invoice.detachInvoiceStatement(attachment)).resultCode).toBe(1)
      })
    })
  }, 180_000)
})
