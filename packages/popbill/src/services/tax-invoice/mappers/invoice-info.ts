import { preserveBooleanResponse, preserveNumericCode } from '@connextable/popbill-utils'
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
    modificationCode: preserveNumericCode(response.modifyCode),
    supplierCompanyName: response.invoicerCorpName,
    buyerCompanyName: response.invoiceeCorpName,
    trusteeCompanyName: response.trusteeCorpName,
    stateCode: preserveNumericCode(response.stateCode),
    stateMemo: response.stateMemo,
    nationalTaxServiceResult: response.ntsresult,
    nationalTaxServiceSendErrorCode: response.ntssendErrCode,
    isLateIssued: preserveBooleanResponse(response.lateIssueYN),
    isOpen: preserveBooleanResponse(response.openYN),
    isApiLinkedDocument: preserveBooleanResponse(response.interOPYN),
    isSupplierPrinted: preserveBooleanResponse(response.invoicerPrintYN),
    isBuyerPrinted: preserveBooleanResponse(response.invoiceePrintYN),
    isTrusteePrinted: preserveBooleanResponse(response.trusteePrintYN),
    buyerBusinessStatus: preserveNumericCode(response.closeDownState),
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
