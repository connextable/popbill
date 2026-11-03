import type * as Spec from '@connextable/popbill-spec'
import { parseSafeInteger } from '@connextable/popbill-utils'
import type * as types from '../types'
import { preserveNumericCode } from '@/internal/collection-state'

export function mapOperation(value: Spec.HomeTaxTaxInvoiceApiResponseBase): types.HomeTaxTaxInvoiceOperationResult {
  return { resultCode: value.code, resultMessage: value.message }
}
export function mapJob(value: Spec.HomeTaxTaxInvoiceJobStateApiModel): types.HomeTaxTaxInvoiceJobState {
  const state = preserveNumericCode(value.jobState)
  return {
    jobId: value.jobID,
    invoiceDirection: value.queryType,
    searchDateType: value.queryDateType,
    startDate: value.queryStDate,
    endDate: value.queryEnDate,
    stateCode: state,
    resultCode: value.errorCode,
    resultMessage: value.errorReason,
    collectedCount: value.collectCount,
    isSearchable: state === 3 && parseSafeInteger(value.errorCode) === 1,
    requestedAt: value.regDT,
    startedAt: value.jobStartDT,
    completedAt: value.jobEndDT,
  }
}
export function mapParties(value: Spec.HomeTaxTaxInvoicePartyApiModel): Pick<types.HomeTaxTaxInvoiceDocument, 'supplier' | 'recipient' | 'trustee'> {
  return {
    supplier: {
      businessNumber: value.invoicerCorpNum,
      managementKey: value.invoicerMgtKey,
      taxRegistrationId: value.invoicerTaxRegID,
      companyName: value.invoicerCorpName,
      representativeName: value.invoicerCEOName,
      address: value.invoicerAddr,
      businessType: value.invoicerBizType,
      businessCategory: value.invoicerBizClass,
      contactName: value.invoicerContactName,
      departmentName: value.invoicerDeptName,
      phoneNumber: value.invoicerTEL,
      emailAddress: value.invoicerEmail,
    },
    recipient: {
      businessNumber: value.invoiceeCorpNum,
      managementKey: value.invoiceeMgtKey,
      taxRegistrationId: value.invoiceeTaxRegID,
      companyName: value.invoiceeCorpName,
      representativeName: value.invoiceeCEOName,
      address: value.invoiceeAddr,
      businessType: value.invoiceeBizType,
      businessCategory: value.invoiceeBizClass,
      partyType: value.invoiceeType,
      contactName: value.invoiceeContactName1,
      departmentName: value.invoiceeDeptName1,
      phoneNumber: value.invoiceeTEL1,
      emailAddress: value.invoiceeEmail1,
      secondaryContactName: value.invoiceeContactName2,
      secondaryDepartmentName: value.invoiceeDeptName2,
      secondaryPhoneNumber: value.invoiceeTEL2,
      secondaryEmailAddress: value.invoiceeEmail2,
    },
    trustee: {
      businessNumber: value.trusteeCorpNum,
      managementKey: value.trusteeMgtKey,
      taxRegistrationId: value.trusteeTaxRegID,
      companyName: value.trusteeCorpName,
      representativeName: value.trusteeCEOName,
      address: value.trusteeAddr,
      businessType: value.trusteeBizType,
      businessCategory: value.trusteeBizClass,
      contactName: value.trusteeContactName,
      departmentName: value.trusteeDeptName,
      phoneNumber: value.trusteeTEL,
      emailAddress: value.trusteeEmail,
    },
  }
}
export function mapLine(value: Spec.HomeTaxTaxInvoiceDetailApiModel): types.HomeTaxTaxInvoiceLineItem {
  return {
    sequenceNumber: value.serialNum,
    itemName: value.itemName,
    specification: value.spec,
    quantity: value.qty,
    unitCost: value.unitCost,
    supplyCostAmount: value.supplyCost,
    taxAmount: value.tax,
    remark: value.remark,
    transactionDate: value.purchaseDT,
  }
}
export function mapSummary(value: Spec.HomeTaxTaxInvoiceSummaryApiModel): types.HomeTaxTaxInvoiceSummary {
  return {
    confirmationNumber: value.ntsconfirmNum,
    originalConfirmationNumber: value.orgNTSConfirmNum,
    invoiceDirection: value.invoiceType,
    taxType: value.taxType,
    purposeType: value.purposeType,
    isModified: value.modifyYN,
    ...mapParties(value),
    totalSupplyCostAmount: value.supplyCostTotal,
    totalTaxAmount: value.taxTotal,
    totalAmount: value.totalAmount,
    firstLineItem: mapLine({ ...value, purchaseDT: value.purchaseDate }),
    remark: value.remark1,
    writtenDate: value.writeDate,
    issuedDate: value.issueDate,
    sentDate: value.sendDate,
  }
}
export function mapDocument(value: Spec.HomeTaxTaxInvoiceApiModel): types.HomeTaxTaxInvoiceDocument {
  return {
    confirmationNumber: value.ntsconfirmNum,
    originalConfirmationNumber: value.orgNTSConfirmNum,
    serialNumber: value.serialNum,
    invoiceTypeCode: value.invoiceType,
    taxType: value.taxType,
    purposeType: value.purposeType,
    modificationReasonCode: value.modifyCode,
    ...mapParties(value),
    totalSupplyCostAmount: value.supplyCostTotal,
    totalTaxAmount: value.taxTotal,
    totalAmount: value.totalAmount,
    cashAmount: value.cash,
    checkAmount: value.chkBill,
    creditAmount: value.credit,
    noteAmount: value.note,
    lineItems: (value.detailList ?? []).map(mapLine),
    remark1: value.remark1,
    remark2: value.remark2,
    remark3: value.remark3,
    writtenDate: value.writeDate,
    issuedAt: value.issueDT,
  }
}
export function mapSearch(value: Spec.HomeTaxTaxInvoiceSearchApiResponse): types.HomeTaxTaxInvoiceSearchResult {
  return {
    resultCode: value.code,
    pageNumber: value.pageNum,
    pageSize: value.perPage,
    pageCount: value.pageCount,
    totalCount: value.total,
    invoices: (value.list ?? []).map(mapSummary),
  }
}
export function mapTotals(value: Spec.HomeTaxTaxInvoiceSummaryApiResponse): types.HomeTaxTaxInvoiceTotals {
  return { count: value.count, totalSupplyCostAmount: value.supplyCostTotal, totalTaxAmount: value.taxTotal, totalAmount: value.amountTotal }
}
export function mapFlatRateState(value: Spec.HomeTaxTaxInvoiceFlatRateStateApiModel): types.HomeTaxTaxInvoiceFlatRateState {
  return {
    businessNumber: value.referenceID,
    stateCode: value.state,
    terminationRequested: value.closeRequestYN,
    usageRestricted: value.useRestrictYN,
    terminateOnExpiration: value.closeOnExpired,
    hasUnpaidBalance: value.unPaidYN,
    billingDay: value.baseDate,
    contractedAt: value.contractDT,
    expiresOn: value.useEndDate,
  }
}
