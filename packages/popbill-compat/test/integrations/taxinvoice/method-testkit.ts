import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { TAXINVOICE_REQUIRED_METHODS } from '@/services/taxinvoice/methods'
import { TaxinvoiceDocumentKeyTypes } from '@/services/taxinvoice/types'
import type { TaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import type { TaxInvoiceApiModel } from '@connextable/popbill-spec'
import { createTaxinvoicePromiseIntegrationService, getTaxinvoiceIntegrationEnv } from './integration-context'

export type TaxinvoiceCompatMethodName = (typeof TAXINVOICE_REQUIRED_METHODS)[number]

type IntegrationEnv = ReturnType<typeof getTaxinvoiceIntegrationEnv>

export interface TaxinvoiceMethodContext {
  service: TaxinvoicePromiseService
  env: IntegrationEnv
  businessNumber: string
  userId: string
  invoiceDocumentKeyType: typeof TaxinvoiceDocumentKeyTypes.Sales
  today: string
  searchStartDate: string
}

export function createTaxinvoiceMethodContext(): TaxinvoiceMethodContext {
  const env = getTaxinvoiceIntegrationEnv()

  return {
    service: createTaxinvoicePromiseIntegrationService(),
    env,
    businessNumber: env.corpNum,
    userId: env.userId,
    invoiceDocumentKeyType: TaxinvoiceDocumentKeyTypes.Sales,
    today: formatDate(new Date()),
    searchStartDate: formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
  }
}

export async function registerDraftInvoice(context: TaxinvoiceMethodContext, managementKey: string) {
  return context.service.register(
    context.businessNumber,
    createTaxInvoiceDocument({
      businessNumber: context.businessNumber,
      counterpartCorpNum: context.env.counterpartCorpNum,
      managementKey,
      writeDate: context.today,
      receiverEmail: context.env.receiverEmail,
    }),
    context.userId
  )
}

export async function createDraftInvoice(context: TaxinvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = createManagementKey(prefix)
  expectApiSuccess(await registerDraftInvoice(context, managementKey))
  return managementKey
}

export async function createIssuedInvoice(context: TaxinvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = await createDraftInvoice(context, prefix)

  expectApiSuccess(
    await context.service.issue(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      'integration issue',
      'integration issue',
      false,
      context.userId
    )
  )

  return managementKey
}

export async function createReverseDraftInvoice(context: TaxinvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = createManagementKey(prefix)

  expectApiSuccess(
    await context.service.register(
      context.businessNumber,
      createTaxInvoiceDocument({
        businessNumber: context.businessNumber,
        counterpartCorpNum: context.env.counterpartCorpNum,
        managementKey,
        writeDate: context.today,
        receiverEmail: context.env.receiverEmail,
        issueType: '역발행',
      }),
      context.userId
    )
  )

  return managementKey
}

export async function createReverseRequestedInvoice(context: TaxinvoiceMethodContext, prefix: string): Promise<string> {
  const managementKey = await createReverseDraftInvoice(context, prefix)

  expectApiSuccess(
    await context.service.request(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      'integration reverse request',
      context.userId
    )
  )

  return managementKey
}

export async function attachFileAndFindIdentifier(
  context: TaxinvoiceMethodContext,
  managementKey: string
): Promise<string> {
  const filePath = await createTempFilePath(`attach-${managementKey}`)

  expectApiSuccess(
    await context.service.attachFile(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      'integration-attach-file.txt',
      filePath,
      context.userId
    )
  )

  const files = await context.service.getFiles(
    context.businessNumber,
    context.invoiceDocumentKeyType,
    managementKey,
    context.userId
  )

  const fileIdentifier = files.find((file) => typeof file.attachedFile === 'string')?.attachedFile

  if (!fileIdentifier) {
    throw new Error('Expected at least one attached file from getFiles response')
  }

  return fileIdentifier
}

interface CreateTaxInvoiceDocumentInput {
  businessNumber: string
  counterpartCorpNum: string
  managementKey: string
  writeDate: string
  receiverEmail: string
  issueType?: '정발행' | '역발행'
  remark?: string
}

export function createTaxInvoiceDocument(input: CreateTaxInvoiceDocumentInput): TaxInvoiceApiModel {
  return {
    writeDate: input.writeDate,
    chargeDirection: '정과금',
    issueType: input.issueType ?? '정발행',
    purposeType: '영수',
    taxType: '과세',
    invoicerCorpNum: input.businessNumber,
    invoicerMgtKey: input.managementKey,
    invoicerCorpName: '통합테스트 공급자',
    invoicerCEOName: '대표자',
    invoicerAddr: '서울시 강남구 테스트로 1',
    invoicerBizClass: '서비스',
    invoicerBizType: '소프트웨어',
    invoicerContactName: '테스트담당자',
    invoicerEmail: input.receiverEmail,
    invoiceeType: '사업자',
    invoiceeCorpNum: input.counterpartCorpNum,
    invoiceeMgtKey: createManagementKey('BUY'),
    invoiceeCorpName: '통합테스트 공급받는자',
    invoiceeCEOName: '수신대표',
    invoiceeAddr: '서울시 서초구 테스트로 2',
    invoiceeBizClass: '서비스',
    invoiceeBizType: '소프트웨어',
    invoiceeContactName1: '수신담당자',
    invoiceeEmail1: input.receiverEmail,
    supplyCostTotal: '10000',
    taxTotal: '1000',
    totalAmount: '11000',
    serialNum: '1',
    cash: '0',
    chkBill: '0',
    note: '0',
    credit: '11000',
    remark1: input.remark ?? 'compat integration test',
    detailList: [
      {
        serialNum: 1,
        purchaseDT: input.writeDate,
        itemName: '통합테스트 품목',
        spec: 'EA',
        qty: '1',
        unitCost: '10000',
        supplyCost: '10000',
        tax: '1000',
      },
    ],
    addContactList: [
      {
        serialNum: 1,
        contactName: '추가담당자',
        email: input.receiverEmail,
      },
    ],
  }
}

export async function createTempFilePath(label: string): Promise<string> {
  const filePath = join(tmpdir(), `popbill-taxinvoice-compat-${label}-${Date.now().toString(36)}.txt`)
  await mkdir(tmpdir(), { recursive: true })
  await writeFile(filePath, `compat integration file ${label}`)
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

export function expectApiSuccess(response: { code?: number; message?: string }): void {
  expect(response.code).toBe(1)
  expect(typeof response.message).toBe('string')
}
