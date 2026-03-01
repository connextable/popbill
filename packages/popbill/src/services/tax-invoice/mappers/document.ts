import type {
  TaxInvoiceAdditionalContactInput,
  TaxInvoiceBuyerInput,
  TaxInvoiceDocumentInput,
  TaxInvoiceLineItemInput,
  TaxInvoicePartyInput,
} from '@/services/tax-invoice/types'
import type * as Spec from '@connextable/popbill-spec'

/**
 * modern 세금계산서 문서 입력을 compat 세금계산서 API 모델로 변환합니다.
 */
export function mapTaxInvoiceDocument(taxInvoiceDocumentInput: TaxInvoiceDocumentInput): Spec.TaxInvoiceApiModel {
  return removeUndefinedProperties({
    writeSpecification: taxInvoiceDocumentInput.writeSpecificationEnabled,
    writeDate: taxInvoiceDocumentInput.writtenDate,
    chargeDirection: taxInvoiceDocumentInput.chargeDirection,
    issueType: taxInvoiceDocumentInput.issueType,
    purposeType: taxInvoiceDocumentInput.purposeType,
    issueTiming: taxInvoiceDocumentInput.issueTimingCode,
    taxType: taxInvoiceDocumentInput.taxType,
    ...mapSupplierFields(taxInvoiceDocumentInput.supplier),
    ...mapBuyerFields(taxInvoiceDocumentInput.buyer),
    ...mapTrusteeFields(taxInvoiceDocumentInput.trustee),
    taxTotal: taxInvoiceDocumentInput.paymentSummary?.totalTaxAmount,
    supplyCostTotal: taxInvoiceDocumentInput.paymentSummary?.totalSupplyCostAmount,
    totalAmount: taxInvoiceDocumentInput.paymentSummary?.totalAmount,
    cash: taxInvoiceDocumentInput.paymentSummary?.cashAmount,
    chkBill: taxInvoiceDocumentInput.paymentSummary?.checkAmount,
    note: taxInvoiceDocumentInput.paymentSummary?.promissoryNoteAmount,
    credit: taxInvoiceDocumentInput.paymentSummary?.creditAmount,
    modifyCode: taxInvoiceDocumentInput.modification?.modificationReasonCode,
    orgNTSConfirmNum: taxInvoiceDocumentInput.modification?.originalNationalTaxServiceConfirmationNumber,
    serialNum: taxInvoiceDocumentInput.taxInvoiceSerialNumber,
    remark1: taxInvoiceDocumentInput.remarkOne,
    remark2: taxInvoiceDocumentInput.remarkTwo,
    remark3: taxInvoiceDocumentInput.remarkThree,
    kwon: taxInvoiceDocumentInput.bookVolumeNumber,
    ho: taxInvoiceDocumentInput.bookIssueNumber,
    businessLicenseYN: taxInvoiceDocumentInput.includeBusinessLicenseImage,
    bankBookYN: taxInvoiceDocumentInput.includeBankBookImage,
    detailList: taxInvoiceDocumentInput.lineItems?.map(mapLineItem),
    addContactList: taxInvoiceDocumentInput.additionalContacts?.map(mapAdditionalContact),
  })
}

/**
 * modern 세금계산서 문서 입력 목록을 compat 세금계산서 API 모델 목록으로 변환합니다.
 */
export function mapTaxInvoiceDocuments(taxInvoiceDocumentInputs: TaxInvoiceDocumentInput[]): Spec.TaxInvoiceApiModel[] {
  return taxInvoiceDocumentInputs.map(mapTaxInvoiceDocument)
}

/**
 * 공급자 입력을 raw 공급자 필드로 변환합니다.
 */
function mapSupplierFields(supplierInput: TaxInvoicePartyInput | undefined): Partial<Spec.TaxInvoiceApiModel> {
  if (!supplierInput) {
    return {}
  }

  return removeUndefinedProperties({
    invoicerCorpNum: supplierInput.businessNumber,
    invoicerMgtKey: supplierInput.managementKey,
    invoicerTaxRegID: supplierInput.taxRegistrationIdentifier,
    invoicerCorpName: supplierInput.companyName,
    invoicerCEOName: supplierInput.chiefExecutiveOfficerName,
    invoicerAddr: supplierInput.address,
    invoicerBizClass: supplierInput.businessClass,
    invoicerBizType: supplierInput.businessType,
    invoicerContactName: supplierInput.contactName,
    invoicerTEL: supplierInput.telephoneNumber,
    invoicerHP: supplierInput.mobilePhoneNumber,
    invoicerEmail: supplierInput.emailAddress,
    invoicerSMSSendYN: supplierInput.sendTextMessage,
    invoicerPrintYN: supplierInput.printEnabled,
    invoicerRDN: supplierInput.residentRegistrationNumber,
    invoicerOLN: supplierInput.foreignerRegistrationNumber,
    invoicerTaxNum: supplierInput.branchBusinessNumber,
    invoicerPSerialNum: supplierInput.branchSerialNumber,
    invoicerCorpCls: supplierInput.corporationClassification,
    invoicerDeptName: supplierInput.departmentName,
  })
}

/**
 * 공급받는자 입력을 raw 공급받는자 필드로 변환합니다.
 */
function mapBuyerFields(buyerInput: TaxInvoiceBuyerInput | undefined): Partial<Spec.TaxInvoiceApiModel> {
  if (!buyerInput) {
    return {}
  }

  return removeUndefinedProperties({
    invoiceeType: buyerInput.recipientType,
    invoiceeCorpNum: buyerInput.businessNumber,
    invoiceeMgtKey: buyerInput.managementKey,
    invoiceeTaxRegID: buyerInput.taxRegistrationIdentifier,
    invoiceeCorpName: buyerInput.companyName,
    invoiceeCEOName: buyerInput.chiefExecutiveOfficerName,
    invoiceeAddr: buyerInput.address,
    invoiceeBizClass: buyerInput.businessClass,
    invoiceeBizType: buyerInput.businessType,
    invoiceeContactName1: buyerInput.contactName,
    invoiceeTEL1: buyerInput.telephoneNumber,
    invoiceeHP1: buyerInput.mobilePhoneNumber,
    invoiceeEmail1: buyerInput.emailAddress,
    invoiceeContactName2: buyerInput.secondaryContactName,
    invoiceeTEL2: buyerInput.secondaryTelephoneNumber,
    invoiceeHP2: buyerInput.secondaryMobilePhoneNumber,
    invoiceeEmail2: buyerInput.secondaryEmailAddress,
    invoiceeSMSSendYN: buyerInput.sendTextMessage,
    invoiceePrintYN: buyerInput.printEnabled,
    invoiceeRDN: buyerInput.residentRegistrationNumber,
    invoiceeOLN: buyerInput.foreignerRegistrationNumber,
    invoiceeTaxNum: buyerInput.branchBusinessNumber,
    invoiceePSerialNum: buyerInput.branchSerialNumber,
    invoiceeCorpCls: buyerInput.corporationClassification,
    invoiceeDeptName1: buyerInput.primaryDepartmentName ?? buyerInput.departmentName,
    invoiceeDeptName2: buyerInput.secondaryDepartmentName,
    closeDownState: buyerInput.businessStatus,
    closeDownStateDate: buyerInput.businessStatusDate,
  })
}

/**
 * 수탁자 입력을 raw 수탁자 필드로 변환합니다.
 */
function mapTrusteeFields(trusteeInput: TaxInvoicePartyInput | undefined): Partial<Spec.TaxInvoiceApiModel> {
  if (!trusteeInput) {
    return {}
  }

  return removeUndefinedProperties({
    trusteeCorpNum: trusteeInput.businessNumber,
    trusteeMgtKey: trusteeInput.managementKey,
    trusteeTaxRegID: trusteeInput.taxRegistrationIdentifier,
    trusteeCorpName: trusteeInput.companyName,
    trusteeCEOName: trusteeInput.chiefExecutiveOfficerName,
    trusteeAddr: trusteeInput.address,
    trusteeBizClass: trusteeInput.businessClass,
    trusteeBizType: trusteeInput.businessType,
    trusteeContactName: trusteeInput.contactName,
    trusteeTEL: trusteeInput.telephoneNumber,
    trusteeHP: trusteeInput.mobilePhoneNumber,
    trusteeEmail: trusteeInput.emailAddress,
    trusteeSMSSendYN: trusteeInput.sendTextMessage,
    trusteePrintYN: trusteeInput.printEnabled,
    trusteeRDN: trusteeInput.residentRegistrationNumber,
    trusteeOLN: trusteeInput.foreignerRegistrationNumber,
    trusteeTaxNum: trusteeInput.branchBusinessNumber,
    trusteePSerialNum: trusteeInput.branchSerialNumber,
    trusteeCorpCls: trusteeInput.corporationClassification,
    trusteeDeptName: trusteeInput.departmentName,
  })
}

/**
 * 상세 품목 입력을 raw 상세 품목 모델로 변환합니다.
 */
function mapLineItem(lineItemInput: TaxInvoiceLineItemInput): NonNullable<Spec.TaxInvoiceApiModel['detailList']>[number] {
  return {
    serialNum: lineItemInput.lineNumber,
    purchaseDT: lineItemInput.transactionDate,
    itemName: lineItemInput.itemName,
    spec: lineItemInput.specification,
    qty: lineItemInput.quantity,
    unitCost: lineItemInput.unitCostAmount,
    supplyCost: lineItemInput.supplyCostAmount,
    tax: lineItemInput.taxAmount,
    remark: lineItemInput.remark,
  }
}

/**
 * 추가 담당자 입력을 raw 추가 담당자 모델로 변환합니다.
 */
function mapAdditionalContact(
  additionalContactInput: TaxInvoiceAdditionalContactInput
): NonNullable<Spec.TaxInvoiceApiModel['addContactList']>[number] {
  return {
    serialNum: additionalContactInput.sequenceNumber,
    contactName: additionalContactInput.contactName,
    email: additionalContactInput.emailAddress,
  }
}

/**
 * 객체에서 `undefined` 값만 제거하여 API 요청 본문을 정리합니다.
 */
function removeUndefinedProperties<T extends Record<string, unknown>>(sourceObject: T): T {
  const definedEntries = Object.entries(sourceObject).filter(([, value]) => value !== undefined)
  return Object.fromEntries(definedEntries) as T
}
