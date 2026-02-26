import { createManagementKey, createTaxInvoiceDocument } from '../taxinvoice-fixtures.ts'
import type { TaxInvoiceLineItem } from '../taxinvoice-fixtures.ts'
import type { ExampleContext, Runner } from '../types.ts'
import { summarizeOperationResult } from '../utils/summarizers.ts'

interface DocumentOptions {
  issueType?: '정발행' | '역발행' | '위수탁'
  remark?: string
  lineItems?: TaxInvoiceLineItem[]
}

export async function createDraftInvoice(
  context: ExampleContext,
  runner: Runner,
  prefix: string,
  documentOptions: DocumentOptions = {}
): Promise<string> {
  const managementKey = createManagementKey(prefix)
  const registerInvoiceInput = {
    businessNumber: context.businessNumber,
    taxInvoiceDocument: createDocument(context, managementKey, documentOptions),
  }

  const registerResult = await runner.run(
    `registerInvoice (${prefix})`,
    registerInvoiceInput,
    () => context.service.registerInvoice(registerInvoiceInput),
    summarizeOperationResult
  )

  if (!registerResult.ok) {
    return ''
  }

  return managementKey
}

export async function createIssuedInvoice(context: ExampleContext, runner: Runner, prefix: string): Promise<string> {
  const managementKey = await createDraftInvoice(context, runner, `${prefix}REG`)
  if (!managementKey) {
    return ''
  }

  const updateInvoiceInput = {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    invoiceManagementKey: managementKey,
    taxInvoiceDocument: createDocument(context, managementKey, {
      remark: `examples update ${prefix}`,
      lineItems: [
        {
          lineNumber: 1,
          transactionDate: context.today,
          itemName: `examples 기본품목 ${prefix}`,
          specification: 'EA',
          quantity: '1',
          unitCostAmount: '10000',
          supplyCostAmount: '10000',
          taxAmount: '1000',
        },
        {
          lineNumber: 2,
          transactionDate: context.today,
          itemName: `examples 추가품목 ${prefix}`,
          specification: 'EA',
          quantity: '1',
          unitCostAmount: '5000',
          supplyCostAmount: '5000',
          taxAmount: '500',
        },
      ],
    }),
  }
  await runner.run(
    `updateInvoice (${prefix})`,
    updateInvoiceInput,
    () => context.service.updateInvoice(updateInvoiceInput),
    summarizeOperationResult
  )

  const issueInvoiceInput = {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    invoiceManagementKey: managementKey,
    historyMemo: `examples issue ${prefix}`,
    emailSubject: `examples issue ${prefix}`,
    forceIssue: false,
  }
  const issueResult = await runner.run(
    `issueInvoice (${prefix})`,
    issueInvoiceInput,
    () => context.service.issueInvoice(issueInvoiceInput),
    summarizeOperationResult
  )

  if (!issueResult.ok) {
    return ''
  }

  return managementKey
}

export async function createReverseRequestedInvoice(
  context: ExampleContext,
  runner: Runner,
  prefix: string
): Promise<string> {
  const reverseManagementKey = await createDraftInvoice(context, runner, `${prefix}REG`, {
    issueType: '역발행',
  })
  if (!reverseManagementKey) {
    return ''
  }

  const requestReverseInput = {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    invoiceManagementKey: reverseManagementKey,
    historyMemo: `examples reverse request ${prefix}`,
  }
  const requestReverseResult = await runner.run(
    `requestReverseIssue (${prefix})`,
    requestReverseInput,
    () => context.service.requestReverseIssue(requestReverseInput),
    summarizeOperationResult
  )

  if (!requestReverseResult.ok) {
    return ''
  }

  return reverseManagementKey
}

export async function ensureIssuedInvoice(context: ExampleContext, runner: Runner, prefix: string): Promise<string> {
  if (context.shared.primaryIssuedManagementKey.length > 0) {
    return context.shared.primaryIssuedManagementKey
  }

  const managementKey = await createIssuedInvoice(context, runner, prefix)
  if (managementKey) {
    context.shared.primaryIssuedManagementKey = managementKey
  }

  return managementKey
}

export function createDocument(context: ExampleContext, managementKey: string, options: DocumentOptions = {}): any {
  return createTaxInvoiceDocument({
    businessNumber: context.businessNumber,
    counterpartBusinessNumber: context.config.counterpartCorpNum,
    managementKey,
    writtenDate: context.today,
    receiverEmail: context.config.receiverEmail,
    issueType: options.issueType,
    remark: options.remark,
    lineItems: options.lineItems,
  })
}
