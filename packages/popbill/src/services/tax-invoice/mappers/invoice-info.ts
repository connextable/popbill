import { toBoolean } from '@connextable/popbill-utils'
import type { TaxInvoiceInfo } from '@/services/tax-invoice/types'
import type * as Spec from '@connextable/popbill-spec'

/**
 * compat `getInfo` 응답을 modern TaxInvoiceInfo로 변환합니다.
 */
export function mapTaxInvoiceInfo(response: Spec.TaxInvoiceGetInfoApiResponse): TaxInvoiceInfo {
  return {
    itemKey: response.itemKey,
    nationalTaxServiceConfirmationNumber: response.ntsconfirmNum,
    supplierBusinessNumber: response.invoicerCorpNum,
    supplierManagementKey: response.invoicerMgtKey,
    buyerBusinessNumber: response.invoiceeCorpNum,
    buyerManagementKey: response.invoiceeMgtKey,
    trusteeBusinessNumber: response.trusteeCorpNum,
    trusteeManagementKey: response.trusteeMgtKey,
    taxType: response.taxType,
    issueType: response.issueType,
    purposeType: response.purposeType,
    totalSupplyCost: response.supplyCostTotal,
    totalTax: response.taxTotal,
    modificationCode: response.modifyCode,
    supplierCompanyName: response.invoicerCorpName,
    buyerCompanyName: response.invoiceeCorpName,
    trusteeCompanyName: response.trusteeCorpName,
    stateCode: toRequiredStateCode(response.stateCode),
    stateMemo: response.stateMemo,
    nationalTaxServiceResult: response.ntsresult,
    nationalTaxServiceSendErrorCode: response.ntssendErrCode,
    isLateIssued: toBoolean(response.lateIssueYN),
    isOpen: toBoolean(response.openYN),
    isApiLinkedDocument: toBoolean(response.interOPYN),
    isSupplierPrinted: toBoolean(response.invoicerPrintYN),
    isBuyerPrinted: toBoolean(response.invoiceePrintYN),
    isTrusteePrinted: response.trusteePrintYN === undefined ? undefined : toBoolean(response.trusteePrintYN),
    buyerBusinessStatus: response.closeDownState,
    writtenDate: response.writeDate,
    registeredAt: response.regDT,
    issuedAt: response.issueDT,
    stateChangedAt: response.stateDT,
    openedAt: response.openDT,
    nationalTaxServiceSentAt: response.ntssendDT,
    nationalTaxServiceResultReceivedAt: response.ntsresultDT,
    buyerBusinessStatusDate: response.closeDownStateDate,
  }
}

function toRequiredStateCode(value: number | string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const normalizedNumber = Number(value)
    if (Number.isFinite(normalizedNumber)) {
      return normalizedNumber
    }
  }

  throw new Error(`유효하지 않은 stateCode 응답값입니다. (${String(value)})`)
}
