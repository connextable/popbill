import { toBoolean } from '@/utils/cast'
import type { TaxInvoiceInfoApiResponse } from './spec'
import type { TaxInvoiceInfo } from './type'

export function mapTaxInvoiceInfo(response: TaxInvoiceInfoApiResponse): TaxInvoiceInfo {
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
    stateCode: response.stateCode,
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
    buyerCloseDownState: response.closeDownState,
    buyerCloseDownDate: response.closeDownStateDate,
    trusteeCompanyName: response.trusteeCorpName,
    trusteeBusinessNumber: response.trusteeCorpNum,
    trusteeManagementKey: response.trusteeMgtKey,
    isTrusteePrinted: response.trusteePrintYN === undefined ? undefined : toBoolean(response.trusteePrintYN),
  }
}
