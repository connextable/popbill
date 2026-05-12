import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export interface CreateTaxInvoiceDocumentInput {
  businessNumber: string
  counterpartBusinessNumber: string
  managementKey: string
  writtenDate: string
  receiverEmail: string
  issueType?: '정발행' | '역발행' | '위수탁'
  remark?: string
  lineItems?: TaxInvoiceLineItem[]
}

export interface TaxInvoiceLineItem {
  lineNumber: number
  transactionDate?: string
  itemName?: string
  specification?: string
  quantity?: string
  unitCostAmount?: string
  supplyCostAmount?: string
  taxAmount?: string
  remark?: string
}

export function formatDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
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

export function createTaxInvoiceDocument(input: CreateTaxInvoiceDocumentInput): any {
  const lineItems = input.lineItems ?? [
    {
      lineNumber: 1,
      transactionDate: input.writtenDate,
      itemName: 'examples 품목',
      specification: 'EA',
      quantity: '1',
      unitCostAmount: '10000',
      supplyCostAmount: '10000',
      taxAmount: '1000',
    },
  ]

  const totalSupplyCostAmount = calculateLineItemAmountTotal(lineItems, 'supplyCostAmount')
  const totalTaxAmount = calculateLineItemAmountTotal(lineItems, 'taxAmount')
  const totalAmount = (totalSupplyCostAmount + totalTaxAmount).toString()

  return {
    writtenDate: input.writtenDate,
    chargeDirection: '정과금',
    issueType: input.issueType ?? '정발행',
    purposeType: '영수',
    taxType: '과세',
    supplier: {
      businessNumber: input.businessNumber,
      managementKey: input.managementKey,
      companyName: 'examples 공급자',
      chiefExecutiveOfficerName: '대표자',
      address: '서울시 강남구 테스트로 1',
      businessClass: '서비스',
      businessType: '소프트웨어',
      contactName: '테스트담당자',
      emailAddress: input.receiverEmail,
    },
    buyer: {
      recipientType: '사업자',
      businessNumber: input.counterpartBusinessNumber,
      managementKey: createManagementKey('BUY'),
      companyName: 'examples 공급받는자',
      chiefExecutiveOfficerName: '수신대표',
      address: '서울시 서초구 테스트로 2',
      businessClass: '서비스',
      businessType: '소프트웨어',
      contactName: '수신담당자',
      emailAddress: input.receiverEmail,
    },
    paymentSummary: {
      totalSupplyCostAmount: totalSupplyCostAmount.toString(),
      totalTaxAmount: totalTaxAmount.toString(),
      totalAmount,
      cashAmount: '0',
      checkAmount: '0',
      promissoryNoteAmount: '0',
      creditAmount: totalAmount,
    },
    taxInvoiceSerialNumber: '1',
    remarkOne: input.remark ?? 'examples run',
    lineItems,
    additionalContacts: [
      {
        sequenceNumber: 1,
        contactName: '추가담당자',
        emailAddress: input.receiverEmail,
      },
    ],
  }
}

function calculateLineItemAmountTotal(items: TaxInvoiceLineItem[], fieldName: 'supplyCostAmount' | 'taxAmount'): number {
  return items.reduce((total, item) => {
    const parsed = Number.parseInt(item[fieldName] ?? '0', 10)
    return Number.isInteger(parsed) && parsed >= 0 ? total + parsed : total
  }, 0)
}

export async function createTempAttachmentFile(label: string): Promise<string> {
  const folderPath = join(tmpdir(), 'popbill-examples')
  const filePath = join(folderPath, `attachment-${label}-${Date.now().toString(36)}.txt`)
  await mkdir(folderPath, { recursive: true })
  await writeFile(filePath, `popbill examples attachment: ${label}`)
  return filePath
}
