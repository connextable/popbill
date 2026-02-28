import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TAX_INVOICE_METHODS } from '@/constants'
import { TaxInvoiceDocumentKeyTypes } from '@/services/tax-invoice'
import {
  TaxInvoiceChargeDirectionValues,
  TaxInvoiceIssueTypes,
  TaxInvoicePurposeTypes,
  TaxInvoiceRecipientTypes,
  TaxInvoiceTaxationTypes,
  type TaxInvoiceBulkSubmitResult,
  type TaxInvoiceDocumentInput,
  type TaxInvoiceIssueResult,
  type TaxInvoiceIssueType,
  type TaxInvoiceOperationResult,
  type TaxInvoiceService,
} from '@/services/tax-invoice/types'
import { createTaxInvoiceIntegrationClient, getTaxInvoiceIntegrationEnv } from './integration-context'

export type TaxInvoiceMethodName = (typeof TAX_INVOICE_METHODS)[number]

type IntegrationEnv = ReturnType<typeof getTaxInvoiceIntegrationEnv>

export interface TaxInvoiceMethodContext {
  service: TaxInvoiceService
  env: IntegrationEnv
  businessNumber: string
  invoiceDocumentKeyType: typeof TaxInvoiceDocumentKeyTypes.Sales
  today: string
  searchStartDate: string
}

export function createTaxInvoiceMethodContext(): TaxInvoiceMethodContext {
  const env = getTaxInvoiceIntegrationEnv()
  const service = createTaxInvoiceIntegrationClient().services.taxInvoice

  return {
    service,
    env,
    businessNumber: env.corpNum,
    invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
    today: formatDate(new Date()),
    searchStartDate: formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
  }
}

export async function registerDraftInvoice(context: TaxInvoiceMethodContext, managementKey: string) {
  return context.service.registerInvoice({
    businessNumber: context.businessNumber,
    taxInvoiceDocument: createTaxInvoiceDocument({
      businessNumber: context.businessNumber,
      counterpartBusinessNumber: context.env.counterpartCorpNum,
      managementKey,
      writtenDate: context.today,
      receiverEmail: context.env.receiverEmail,
    }),
  })
}

export async function createDraftInvoice(context: TaxInvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = createManagementKey(prefix)
  expectApiSuccess(await registerDraftInvoice(context, managementKey))
  return managementKey
}

export async function createIssuedInvoice(context: TaxInvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = await createDraftInvoice(context, prefix)

  expectApiSuccess(
    await context.service.issueInvoice({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
      historyMemo: 'integration issue',
      emailSubject: 'integration issue',
      forceIssue: false,
    })
  )

  return managementKey
}

export async function createReverseDraftInvoice(context: TaxInvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = createManagementKey(prefix)

  expectApiSuccess(
    await context.service.registerInvoice({
      businessNumber: context.businessNumber,
      taxInvoiceDocument: createTaxInvoiceDocument({
        businessNumber: context.businessNumber,
        counterpartBusinessNumber: context.env.counterpartCorpNum,
        managementKey,
        writtenDate: context.today,
        receiverEmail: context.env.receiverEmail,
        issueType: TaxInvoiceIssueTypes.Reverse,
      }),
    })
  )

  return managementKey
}

export async function createReverseRequestedInvoice(context: TaxInvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = await createReverseDraftInvoice(context, prefix)

  expectApiSuccess(
    await context.service.requestReverseIssue({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
      historyMemo: 'integration reverse request',
    })
  )

  return managementKey
}

export async function attachFileAndFindIdentifier(context: TaxInvoiceMethodContext, managementKey: string): Promise<string> {
  const filePath = await createTempFilePath(`attach-${managementKey}`)

  expectApiSuccess(
    await context.service.attachFileFromPath({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
      displayName: 'integration-attach-file.txt',
      filePath,
    })
  )

  const files = await context.service.getAttachedFiles({
    businessNumber: context.businessNumber,
    invoiceDocumentKeyType: context.invoiceDocumentKeyType,
    invoiceManagementKey: managementKey,
  })

  const fileIdentifier = files.find((file) => typeof file.fileIdentifier === 'string')?.fileIdentifier

  if (!fileIdentifier) {
    throw new Error('Expected at least one attached file from getAttachedFiles response')
  }

  return fileIdentifier
}

interface CreateTaxInvoiceDocumentInput {
  businessNumber: string
  counterpartBusinessNumber: string
  managementKey: string
  writtenDate: string
  receiverEmail: string
  issueType?: TaxInvoiceIssueType
  remark?: string
}

export function createTaxInvoiceDocument(input: CreateTaxInvoiceDocumentInput): TaxInvoiceDocumentInput {
  return {
    writtenDate: input.writtenDate,
    chargeDirection: TaxInvoiceChargeDirectionValues.NormalCharge,
    issueType: input.issueType ?? TaxInvoiceIssueTypes.Normal,
    purposeType: TaxInvoicePurposeTypes.Receipt,
    taxType: TaxInvoiceTaxationTypes.Taxable,
    supplier: {
      businessNumber: input.businessNumber,
      managementKey: input.managementKey,
      companyName: '통합테스트 공급자',
      chiefExecutiveOfficerName: '대표자',
      address: '서울시 강남구 테스트로 1',
      businessClass: '서비스',
      businessType: '소프트웨어',
      contactName: '테스트담당자',
      emailAddress: input.receiverEmail,
    },
    buyer: {
      recipientType: TaxInvoiceRecipientTypes.Business,
      businessNumber: input.counterpartBusinessNumber,
      managementKey: createManagementKey('BUY'),
      companyName: '통합테스트 공급받는자',
      chiefExecutiveOfficerName: '수신대표',
      address: '서울시 서초구 테스트로 2',
      businessClass: '서비스',
      businessType: '소프트웨어',
      contactName: '수신담당자',
      emailAddress: input.receiverEmail,
    },
    paymentSummary: {
      totalSupplyCostAmount: '10000',
      totalTaxAmount: '1000',
      totalAmount: '11000',
      cashAmount: '0',
      checkAmount: '0',
      promissoryNoteAmount: '0',
      creditAmount: '11000',
    },
    taxInvoiceSerialNumber: '1',
    remarkOne: input.remark ?? 'integration test',
    lineItems: [
      {
        lineNumber: 1,
        transactionDate: input.writtenDate,
        itemName: '통합테스트 품목',
        specification: 'EA',
        quantity: '1',
        unitCostAmount: '10000',
        supplyCostAmount: '10000',
        taxAmount: '1000',
      },
    ],
    additionalContacts: [
      {
        sequenceNumber: 1,
        contactName: '추가담당자',
        emailAddress: input.receiverEmail,
      },
    ],
  }
}

export async function createTempFilePath(label: string): Promise<string> {
  const filePath = join(tmpdir(), `popbill-taxinvoice-${label}-${Date.now().toString(36)}.txt`)
  await mkdir(tmpdir(), { recursive: true })
  await writeFile(filePath, `integration file ${label}`)
  return filePath
}

export function createManagementKey(prefix: string): string {
  const body = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}${body}`
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 24)
}

export function createSubmissionIdentifier(prefix: string): string {
  const body = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  return `${prefix}${body}`
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 36)
}

export function formatDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

export function expectApiSuccess(response: TaxInvoiceOperationResult | TaxInvoiceIssueResult | TaxInvoiceBulkSubmitResult): void {
  expect(response.resultCode).toBe(1)
  expect(typeof response.resultMessage).toBe('string')
}
