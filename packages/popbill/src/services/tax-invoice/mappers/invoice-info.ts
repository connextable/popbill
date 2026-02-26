import { toBoolean } from '@connextable/popbill-core'
import type { TaxInvoiceGetInfoApiResponse } from '@connextable/popbill-spec'
import type { TaxInvoiceInfo } from '@/services/tax-invoice/types'

/**
 * compat `getInfo` 응답을 modern TaxInvoiceInfo로 변환합니다.
 */
export function mapTaxInvoiceInfo(response: TaxInvoiceGetInfoApiResponse): TaxInvoiceInfo {
  return {
    itemKey: response.itemKey,
    taxType: response.taxType,
    writtenDate: response.writeDate,
    registeredAt: response.regDT,
    issueType: response.issueType,
    totalSupplyCost: response.supplyCostTotal,
    totalTax: response.taxTotal,
    purposeType: response.purposeType,
    issuedAt: response.issueDT,
    isLateIssued: toBoolean(response.lateIssueYN),
    isOpen: toBoolean(response.openYN),
    openedAt: response.openDT,
    stateMemo: response.stateMemo,
    stateCode: toRequiredStateCode(response.stateCode),
    stateChangedAt: response.stateDT,
    nationalTaxServiceConfirmationNumber: response.ntsconfirmNum,
    nationalTaxServiceResult: response.ntsresult,
    nationalTaxServiceSentAt: response.ntssendDT,
    nationalTaxServiceResultReceivedAt: response.ntsresultDT,
    nationalTaxServiceSendErrorCode: response.ntssendErrCode,
    modificationCode: response.modifyCode,
    isApiLinkedDocument: toBoolean(response.interOPYN),
    supplierCompanyName: response.invoicerCorpName,
    supplierBusinessNumber: response.invoicerCorpNum,
    supplierManagementKey: response.invoicerMgtKey,
    isSupplierPrinted: toBoolean(response.invoicerPrintYN),
    buyerCompanyName: response.invoiceeCorpName,
    buyerBusinessNumber: response.invoiceeCorpNum,
    buyerManagementKey: response.invoiceeMgtKey,
    isBuyerPrinted: toBoolean(response.invoiceePrintYN),
    buyerBusinessStatus: response.closeDownState,
    buyerBusinessStatusDate: response.closeDownStateDate,
    trusteeCompanyName: response.trusteeCorpName,
    trusteeBusinessNumber: response.trusteeCorpNum,
    trusteeManagementKey: response.trusteeMgtKey,
    isTrusteePrinted: response.trusteePrintYN === undefined ? undefined : toBoolean(response.trusteePrintYN),
  }
}

function toRequiredStateCode(value: number | string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalizedNumber = Number(value)
    if (Number.isFinite(normalizedNumber)) {
      return normalizedNumber
    }
  }

  throw new Error(`유효하지 않은 stateCode 응답값입니다. (${String(value)})`)
}
