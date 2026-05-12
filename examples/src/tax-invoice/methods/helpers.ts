import { createManagementKey, createTempAttachmentFile } from '../taxinvoice-fixtures.ts'
import {
  TaxInvoiceCloseDownStateCodes,
  TaxInvoiceDateType,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
} from '../types.ts'
import type { ExampleContext, Runner, SearchInvoicesInput } from '../types.ts'
import { createDocument, createDraftInvoice, createIssuedInvoice, createReverseRequestedInvoice } from '../workflows/invoice.ts'
import { summarizeArrayLength, summarizeOperationResult } from '../utils/summarizers.ts'

export interface TaxInvoiceDocumentRequestInput {
  businessNumber: string
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  invoiceManagementKey: string
}

type TaxInvoiceDocumentKeyType = 'SELL' | 'BUY' | 'TRUSTEE'

export function createDocumentRequest(
  context: ExampleContext,
  invoiceManagementKey: string,
  invoiceDocumentKeyType?: ExampleContext['invoiceDocumentKeyType']
): TaxInvoiceDocumentRequestInput & { invoiceDocumentKeyType: ExampleContext['invoiceDocumentKeyType'] }
export function createDocumentRequest<TKeyType extends TaxInvoiceDocumentKeyType>(
  context: ExampleContext,
  invoiceManagementKey: string,
  invoiceDocumentKeyType: TKeyType
): TaxInvoiceDocumentRequestInput & { invoiceDocumentKeyType: TKeyType }
export function createDocumentRequest(
  context: ExampleContext,
  invoiceManagementKey: string,
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType = context.invoiceDocumentKeyType
): TaxInvoiceDocumentRequestInput {
  return {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType,
    invoiceManagementKey,
  }
}

export function createSearchInput(context: ExampleContext): SearchInvoicesInput {
  return {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    searchDateType: TaxInvoiceDateType.Registered,
    startDate: context.searchStartDate,
    endDate: context.today,
    invoiceStateCodes: ['3**'],
    invoiceTypeCodes: [TaxInvoiceSearchInvoiceTypeCodes.Normal, TaxInvoiceSearchInvoiceTypeCodes.Modified],
    taxationTypeCodes: [
      TaxInvoiceSearchTaxationTypeCodes.Taxable,
      TaxInvoiceSearchTaxationTypeCodes.Exempt,
      TaxInvoiceSearchTaxationTypeCodes.ZeroRated,
    ],
    lateIssueOnly: null,
    sortOrder: TaxInvoiceSortOrder.Descending,
    pageNumber: 1,
    pageSize: 100,
    closeDownStateCodes: [TaxInvoiceCloseDownStateCodes.NotRegistered],
  }
}

export async function prepareDraftInvoiceKey(context: ExampleContext, runner: Runner, prefix: string): Promise<string | null> {
  const managementKey = await createDraftInvoice(context, runner, prefix)
  return managementKey || null
}

export async function prepareIssuedInvoiceKey(context: ExampleContext, runner: Runner, prefix: string): Promise<string | null> {
  const managementKey = await createIssuedInvoice(context, runner, prefix)
  return managementKey || null
}

export async function prepareReverseRequestedInvoiceKeys(context: ExampleContext, runner: Runner, prefix: string) {
  return createReverseRequestedInvoice(context, runner, prefix)
}

export function createImmediateIssueInput(context: ExampleContext, prefix = 'IMD') {
  const managementKey = createManagementKey(prefix)

  return {
    businessNumber: context.businessNumber,
    taxInvoiceDocument: createDocument(context, managementKey),
    historyMemo: 'examples immediate issue',
    emailSubject: 'examples immediate issue',
    forceIssue: false,
  }
}

export function createImmediateReverseRequestInput(context: ExampleContext, prefix = 'RIM') {
  const managementKey = createManagementKey(prefix)

  return {
    businessNumber: context.businessNumber,
    taxInvoiceDocument: createDocument(context, managementKey, { issueType: '역발행' }),
    historyMemo: 'examples reverse immediate request',
  }
}

export function createUpdateDocumentInput(context: ExampleContext, managementKey: string, prefix: string) {
  return {
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    invoiceManagementKey: managementKey,
    taxInvoiceDocument: createDocument(context, managementKey, {
      remark: `examples update by method ${prefix}`,
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
}

export async function prepareAttachedFileIdentifier(context: ExampleContext, runner: Runner, managementKey: string): Promise<string | null> {
  const documentInput = createDocumentRequest(context, managementKey)
  const filePath = await createTempAttachmentFile(managementKey)

  const attachInput = {
    ...documentInput,
    displayName: 'examples-method-attach.txt',
    filePath,
  }

  const attachResult = await runner.run(
    'setup.attachFileFromPath',
    attachInput,
    () => context.service.attachFileFromPath(attachInput),
    summarizeOperationResult
  )
  if (!attachResult.ok) {
    return null
  }

  const filesResult = await runner.run(
    'setup.getAttachedFiles',
    documentInput,
    () => context.service.getAttachedFiles(documentInput),
    summarizeArrayLength
  )

  if (!filesResult.ok || !Array.isArray(filesResult.value)) {
    return null
  }

  const fileIdentifier = filesResult.value.find((file) => typeof file.fileIdentifier === 'string')?.fileIdentifier
  return fileIdentifier ?? null
}
