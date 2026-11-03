import { mapTaxInvoiceInfo } from './invoice-info'
import { preserveNumericCode } from '@/internal/collection-state'
import { optionalResponseNumber, preserveBooleanResponse, type ProviderNumericCode } from '@/internal/response'
import type {
  TaxInvoiceAccessUrl,
  TaxInvoiceAttachedFile,
  TaxInvoiceBulkIssueSubmissionResult,
  TaxInvoiceBulkIssueSubmissionResultItem,
  TaxInvoiceBulkSubmitResult,
  TaxInvoiceBuyerOutput,
  TaxInvoiceChargeInfo,
  TaxInvoiceDocumentOutput,
  TaxInvoiceEmailPublicKeys,
  TaxInvoiceEmailSendSetting,
  TaxInvoiceInfo,
  TaxInvoiceInvoiceManagementKeyUsage,
  TaxInvoiceIssueResult,
  TaxInvoiceLogEntry,
  TaxInvoiceOperationResult,
  TaxInvoicePartyOutput,
  TaxInvoicePdfDocument,
  TaxInvoiceSearchResult,
  TaxInvoiceSendToNationalTaxServiceSetting,
  TaxInvoiceTaxCertificateExpiration,
  TaxInvoiceTaxCertificateInfo,
  TaxInvoiceXmlResult,
  TaxInvoiceUnitCost,
} from '@/services/tax-invoice/types'
import type * as Spec from '@connextable/popbill-spec'

/**
 * 공통 API 처리결과를 도메인 처리결과로 변환합니다.
 */
export function mapTaxInvoiceOperationResult(
  taxInvoiceApiResponse: Spec.TaxInvoiceApiResponseBase | { code?: ProviderNumericCode; message: string }
): TaxInvoiceOperationResult {
  return {
    resultCode: preserveNumericCode(taxInvoiceApiResponse.code),
    resultMessage: taxInvoiceApiResponse.message,
  }
}

/**
 * 발행 결과를 도메인 발행 결과로 변환합니다.
 */
export function mapTaxInvoiceIssueResult(taxInvoiceApiResponse: Spec.TaxInvoiceIssueApiResponse): TaxInvoiceIssueResult {
  return removeUndefinedProperties({
    ...mapTaxInvoiceOperationResult(taxInvoiceApiResponse),
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsConfirmNum,
    issuedAt: taxInvoiceApiResponse.issueDT ?? undefined,
  })
}

/**
 * 초대량 접수 결과를 도메인 결과로 변환합니다.
 */
export function mapTaxInvoiceBulkSubmitResult(taxInvoiceApiResponse: Spec.TaxInvoiceBulkSubmitApiResponse): TaxInvoiceBulkSubmitResult {
  return removeUndefinedProperties({
    ...mapTaxInvoiceOperationResult(taxInvoiceApiResponse),
    receiptIdentifier: taxInvoiceApiResponse.receiptID,
  })
}

/**
 * 초대량 접수결과 조회 응답을 도메인 결과로 변환합니다.
 */
export function mapTaxInvoiceBulkIssueSubmissionResult(
  taxInvoiceApiResponse: Spec.TaxInvoiceGetBulkResultApiResponse
): TaxInvoiceBulkIssueSubmissionResult {
  return removeUndefinedProperties({
    ...mapTaxInvoiceOperationResult(taxInvoiceApiResponse),
    submissionIdentifier: taxInvoiceApiResponse.submitID,
    receiptIdentifier: taxInvoiceApiResponse.receiptID,
    submittedDocumentCount: optionalResponseNumber(taxInvoiceApiResponse.submitCount),
    succeededDocumentCount: optionalResponseNumber(taxInvoiceApiResponse.successCount),
    failedDocumentCount: optionalResponseNumber(taxInvoiceApiResponse.failCount),
    transactionState: preserveNumericCode(taxInvoiceApiResponse.txState),
    transactionResultCode: preserveNumericCode(taxInvoiceApiResponse.txResultCode),
    issueResults: taxInvoiceApiResponse.issueResult?.map(mapTaxInvoiceBulkIssueSubmissionResultItem),
    receivedAt: taxInvoiceApiResponse.receiptDT,
    transactionStartedAt: taxInvoiceApiResponse.txStartDT,
    transactionCompletedAt: taxInvoiceApiResponse.txEndDT,
  })
}

/**
 * 다건 문서 요약 응답을 도메인 목록으로 변환합니다.
 */
export function mapTaxInvoiceInfos(taxInvoiceApiResponse: Spec.TaxInvoiceGetInfosApiResponse): TaxInvoiceInfo[] {
  return taxInvoiceApiResponse.map(mapTaxInvoiceInfo)
}

/**
 * 문서 상세 응답을 도메인 문서 상세로 변환합니다.
 */
export function mapTaxInvoiceDocumentOutput(taxInvoiceApiResponse: Spec.TaxInvoiceGetDetailInfoApiResponse): TaxInvoiceDocumentOutput {
  return removeUndefinedProperties({
    taxInvoiceSerialNumber: taxInvoiceApiResponse.serialNum,
    bookVolumeNumber: taxInvoiceApiResponse.kwon,
    bookIssueNumber: taxInvoiceApiResponse.ho,
    writtenDate: taxInvoiceApiResponse.writeDate,
    issueType: taxInvoiceApiResponse.issueType,
    issueTimingCode: taxInvoiceApiResponse.issueTiming,
    taxType: taxInvoiceApiResponse.taxType,
    purposeType: taxInvoiceApiResponse.purposeType,
    chargeDirection: taxInvoiceApiResponse.chargeDirection,
    supplier: mapSupplierOutput(taxInvoiceApiResponse),
    buyer: mapBuyerOutput(taxInvoiceApiResponse),
    trustee: mapTrusteeOutput(taxInvoiceApiResponse),
    paymentSummary: removeUndefinedProperties({
      totalSupplyCostAmount: taxInvoiceApiResponse.supplyCostTotal,
      totalTaxAmount: taxInvoiceApiResponse.taxTotal,
      totalAmount: taxInvoiceApiResponse.totalAmount,
      cashAmount: taxInvoiceApiResponse.cash,
      checkAmount: taxInvoiceApiResponse.chkBill,
      promissoryNoteAmount: taxInvoiceApiResponse.note,
      creditAmount: taxInvoiceApiResponse.credit,
    }),
    modification: removeUndefinedProperties({
      modificationReasonCode: preserveNumericCode(taxInvoiceApiResponse.modifyCode),
      originalNationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.orgNTSConfirmNum,
    }),
    lineItems: taxInvoiceApiResponse.detailList?.map((lineItem) =>
      removeUndefinedProperties({
        lineNumber: lineItem.serialNum,
        transactionDate: lineItem.purchaseDT,
        itemName: lineItem.itemName,
        specification: lineItem.spec,
        quantity: lineItem.qty,
        unitCostAmount: lineItem.unitCost,
        supplyCostAmount: lineItem.supplyCost,
        taxAmount: lineItem.tax,
        remark: lineItem.remark,
      })
    ),
    additionalContacts: taxInvoiceApiResponse.addContactList?.map((additionalContact) =>
      removeUndefinedProperties({
        sequenceNumber: additionalContact.serialNum,
        contactName: additionalContact.contactName,
        emailAddress: additionalContact.email,
      })
    ),
    remarkOne: taxInvoiceApiResponse.remark1,
    remarkTwo: taxInvoiceApiResponse.remark2,
    remarkThree: taxInvoiceApiResponse.remark3,
    writeSpecificationEnabled: preserveBooleanResponse(taxInvoiceApiResponse.writeSpecification),
    includeBusinessLicenseImage: preserveBooleanResponse(taxInvoiceApiResponse.businessLicenseYN),
    includeBankBookImage: preserveBooleanResponse(taxInvoiceApiResponse.bankBookYN),
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsconfirmNum,
    stateCode: preserveNumericCode(taxInvoiceApiResponse.stateCode),
    nationalTaxServiceResultCode: taxInvoiceApiResponse.ntsresult,
    nationalTaxServiceSendErrorCode: taxInvoiceApiResponse.ntssendErrCode,
    isLateIssued: preserveBooleanResponse(taxInvoiceApiResponse.lateIssueYN),
    isOpen: preserveBooleanResponse(taxInvoiceApiResponse.openYN),
    isApiLinkedDocument: preserveBooleanResponse(taxInvoiceApiResponse.interOPYN),
    issuedAt: taxInvoiceApiResponse.issueDT,
    stateChangedAt: taxInvoiceApiResponse.stateDT,
    openedAt: taxInvoiceApiResponse.openDT,
    nationalTaxServiceSentAt: taxInvoiceApiResponse.ntssendDT,
    nationalTaxServiceResultReceivedAt: taxInvoiceApiResponse.ntsresultDT,
  })
}

/**
 * 문서번호 사용 여부 응답을 도메인 결과로 변환합니다.
 */
export function mapTaxInvoiceInvoiceManagementKeyUsage(taxInvoiceApiResponse: boolean | { itemKey?: string }): TaxInvoiceInvoiceManagementKeyUsage {
  if (typeof taxInvoiceApiResponse === 'boolean') {
    return {
      isInUse: taxInvoiceApiResponse,
    }
  }

  return removeUndefinedProperties({
    isInUse: typeof taxInvoiceApiResponse.itemKey === 'string' && taxInvoiceApiResponse.itemKey.length > 0,
    itemKey: taxInvoiceApiResponse.itemKey,
  })
}

/**
 * XML 조회 응답을 도메인 결과로 변환합니다.
 */
export function mapTaxInvoiceXmlResult(taxInvoiceApiResponse: Spec.TaxInvoiceGetXmlApiResponse): TaxInvoiceXmlResult {
  return removeUndefinedProperties({
    operationResult:
      taxInvoiceApiResponse.code === undefined || taxInvoiceApiResponse.message === undefined
        ? undefined
        : mapTaxInvoiceOperationResult({
            code: taxInvoiceApiResponse.code,
            message: taxInvoiceApiResponse.message,
          }),
    itemKey: taxInvoiceApiResponse.itemKey,
    invoiceManagementKey: taxInvoiceApiResponse.mgtKey,
    xmlContent: taxInvoiceApiResponse.retObject,
  })
}

export function mapTaxInvoicePdfDocument(fileData: Uint8Array): TaxInvoicePdfDocument {
  return { fileData: new Uint8Array(fileData) }
}

/**
 * 검색 응답을 도메인 검색 결과로 변환합니다.
 */
export function mapTaxInvoiceSearchResult(taxInvoiceApiResponse: Spec.TaxInvoiceSearchApiResponse): TaxInvoiceSearchResult {
  return removeUndefinedProperties({
    operationResult: mapTaxInvoiceOperationResult(taxInvoiceApiResponse),
    pageNumber: optionalResponseNumber(taxInvoiceApiResponse.pageNum),
    pageSize: optionalResponseNumber(taxInvoiceApiResponse.perPage),
    pageCount: optionalResponseNumber(taxInvoiceApiResponse.pageCount),
    totalCount: optionalResponseNumber(taxInvoiceApiResponse.total),
    invoiceSummaries: (taxInvoiceApiResponse.list ?? []).map(mapTaxInvoiceInfo),
  })
}

/**
 * 문서 로그 응답을 도메인 로그 목록으로 변환합니다.
 */
export function mapTaxInvoiceLogs(taxInvoiceApiResponse: Spec.TaxInvoiceGetLogsApiResponse): TaxInvoiceLogEntry[] {
  return taxInvoiceApiResponse.map((logEntry) =>
    removeUndefinedProperties({
      documentLogTypeCode: preserveNumericCode(logEntry.docLogType),
      logMessage: logEntry.log,
      processTypeCode: logEntry.procType,
      processCompanyName: logEntry.procCorpName,
      processContactName: logEntry.procContactName,
      processDescription: logEntry.procMemo,
      registeredAt: logEntry.regDT,
      ipAddress: logEntry.ip,
    })
  )
}

/**
 * URL 문자열을 URL 응답으로 래핑합니다.
 */
export function mapTaxInvoiceAccessUrlFromString(accessUrl: string): TaxInvoiceAccessUrl {
  return { accessUrl }
}

/**
 * URL 객체를 URL 응답으로 변환합니다.
 */
export function mapTaxInvoiceAccessUrl(taxInvoiceApiResponse: { url: string }): TaxInvoiceAccessUrl {
  return { accessUrl: taxInvoiceApiResponse.url }
}

/**
 * 첨부파일 목록 응답을 도메인 목록으로 변환합니다.
 */
export function mapTaxInvoiceAttachedFiles(taxInvoiceApiResponse: Spec.TaxInvoiceGetFilesApiResponse): TaxInvoiceAttachedFile[] {
  return taxInvoiceApiResponse.map((attachedFile) =>
    removeUndefinedProperties({
      sequenceNumber: attachedFile.serialNum,
      fileIdentifier: attachedFile.attachedFile,
      displayName: attachedFile.displayName,
      registeredAt: attachedFile.regDT,
    })
  )
}

/**
 * 이메일 전송설정 응답을 도메인 목록으로 변환합니다.
 */
export function mapTaxInvoiceEmailSendSettings(taxInvoiceApiResponse: Spec.TaxInvoiceListEmailConfigApiResponse): TaxInvoiceEmailSendSetting[] {
  return taxInvoiceApiResponse.map((emailSendSetting) =>
    removeUndefinedProperties({
      emailTypeCode: emailSendSetting.emailType,
      sendEnabled: preserveBooleanResponse(emailSendSetting.sendYN),
    })
  )
}

/**
 * 국세청 전송설정 응답을 도메인 설정으로 변환합니다.
 */
export function mapTaxInvoiceSendToNationalTaxServiceSetting(
  taxInvoiceApiResponse: Spec.TaxInvoiceGetSendToNTSConfigApiResponse
): TaxInvoiceSendToNationalTaxServiceSetting {
  return {
    sendToNationalTaxServiceEnabled: preserveBooleanResponse(taxInvoiceApiResponse.sendToNTS),
  }
}

/** 공개되지 않은 유통메일 공개키 응답을 손실 없이 보존합니다. */
export function mapTaxInvoiceEmailPublicKeys(response: Spec.TaxInvoiceGetEmailPublicKeysApiResponse): TaxInvoiceEmailPublicKeys {
  return { publicKeys: response }
}

/**
 * 인증서 만료일 문자열을 도메인 결과로 래핑합니다.
 */
export function mapTaxInvoiceTaxCertificateExpiration(expirationDateTime: string): TaxInvoiceTaxCertificateExpiration {
  return { expirationDateTime }
}

/**
 * 인증서 정보 응답을 도메인 정보로 변환합니다.
 */
export function mapTaxInvoiceTaxCertificateInfo(taxInvoiceApiResponse: Spec.TaxInvoiceGetTaxCertInfoApiResponse): TaxInvoiceTaxCertificateInfo {
  return removeUndefinedProperties({
    issuerDistinguishedName: taxInvoiceApiResponse.issuerDN,
    subjectDistinguishedName: taxInvoiceApiResponse.subjectDN,
    issuerName: taxInvoiceApiResponse.issuerName,
    policyObjectIdentifier: taxInvoiceApiResponse.OID ?? taxInvoiceApiResponse.oid,
    registeredContactIdentifier: taxInvoiceApiResponse.regContactID,
    registeredContactName: taxInvoiceApiResponse.regContactName,
    registeredAt: taxInvoiceApiResponse.regDT,
    expiredAt: taxInvoiceApiResponse.expireDT,
  })
}

export function mapTaxInvoiceChargeInfo(response: Spec.TaxInvoiceGetChargeInfoApiResponse): TaxInvoiceChargeInfo {
  return { unitCost: response.unitCost, chargeMethod: response.chargeMethod, rateSystem: response.rateSystem }
}

export function mapTaxInvoiceUnitCost(unitCost: string): TaxInvoiceUnitCost {
  return { unitCost }
}

/**
 * 초대량 개별 처리 결과를 도메인 항목으로 변환합니다.
 */
function mapTaxInvoiceBulkIssueSubmissionResultItem(
  taxInvoiceApiResponse: NonNullable<Spec.TaxInvoiceGetBulkResultApiResponse['issueResult']>[number]
): TaxInvoiceBulkIssueSubmissionResultItem {
  return removeUndefinedProperties({
    invoiceDocumentKeyTypeCode: taxInvoiceApiResponse.keyType,
    supplierInvoiceManagementKey: taxInvoiceApiResponse.invoicerMgtKey,
    trusteeInvoiceManagementKey: taxInvoiceApiResponse.trusteeMgtKey,
    resultCode: preserveNumericCode(taxInvoiceApiResponse.code),
    resultMessage: taxInvoiceApiResponse.message,
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsconfirmNum,
    receivedAt: taxInvoiceApiResponse.receiptDT,
    issuedAt: taxInvoiceApiResponse.issueDT,
  })
}

/**
 * 공급자 응답 필드를 도메인 공급자 정보로 변환합니다.
 */
function mapSupplierOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoicePartyOutput | undefined {
  return compactOptionalObject({
    businessNumber: taxInvoiceApiResponse.invoicerCorpNum,
    managementKey: taxInvoiceApiResponse.invoicerMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.invoicerTaxRegID,
    residentRegistrationNumber: taxInvoiceApiResponse.invoicerRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.invoicerOLN,
    branchBusinessNumber: taxInvoiceApiResponse.invoicerTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.invoicerPSerialNum,
    corporationClassification: taxInvoiceApiResponse.invoicerCorpCls,
    companyName: taxInvoiceApiResponse.invoicerCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.invoicerCEOName,
    address: taxInvoiceApiResponse.invoicerAddr,
    businessType: taxInvoiceApiResponse.invoicerBizType,
    businessClass: taxInvoiceApiResponse.invoicerBizClass,
    departmentName: taxInvoiceApiResponse.invoicerDeptName,
    contactName: taxInvoiceApiResponse.invoicerContactName,
    telephoneNumber: taxInvoiceApiResponse.invoicerTEL,
    mobilePhoneNumber: taxInvoiceApiResponse.invoicerHP,
    emailAddress: taxInvoiceApiResponse.invoicerEmail,
    sendTextMessage: preserveBooleanResponse(taxInvoiceApiResponse.invoicerSMSSendYN),
    printEnabled: preserveBooleanResponse(taxInvoiceApiResponse.invoicerPrintYN),
  })
}

/**
 * 공급받는자 응답 필드를 도메인 공급받는자 정보로 변환합니다.
 */
function mapBuyerOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoiceBuyerOutput | undefined {
  return compactOptionalObject({
    businessNumber: taxInvoiceApiResponse.invoiceeCorpNum,
    managementKey: taxInvoiceApiResponse.invoiceeMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.invoiceeTaxRegID,
    residentRegistrationNumber: taxInvoiceApiResponse.invoiceeRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.invoiceeOLN,
    branchBusinessNumber: taxInvoiceApiResponse.invoiceeTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.invoiceePSerialNum,
    corporationClassification: taxInvoiceApiResponse.invoiceeCorpCls,
    companyName: taxInvoiceApiResponse.invoiceeCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.invoiceeCEOName,
    address: taxInvoiceApiResponse.invoiceeAddr,
    businessType: taxInvoiceApiResponse.invoiceeBizType,
    businessClass: taxInvoiceApiResponse.invoiceeBizClass,
    departmentName: taxInvoiceApiResponse.invoiceeDeptName1,
    contactName: taxInvoiceApiResponse.invoiceeContactName1,
    telephoneNumber: taxInvoiceApiResponse.invoiceeTEL1,
    mobilePhoneNumber: taxInvoiceApiResponse.invoiceeHP1,
    emailAddress: taxInvoiceApiResponse.invoiceeEmail1,
    sendTextMessage: preserveBooleanResponse(taxInvoiceApiResponse.invoiceeSMSSendYN),
    printEnabled: preserveBooleanResponse(taxInvoiceApiResponse.invoiceePrintYN),
    recipientType: taxInvoiceApiResponse.invoiceeType,
    primaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName1,
    secondaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName2,
    secondaryContactName: taxInvoiceApiResponse.invoiceeContactName2,
    secondaryTelephoneNumber: taxInvoiceApiResponse.invoiceeTEL2,
    secondaryMobilePhoneNumber: taxInvoiceApiResponse.invoiceeHP2,
    secondaryEmailAddress: taxInvoiceApiResponse.invoiceeEmail2,
    businessStatus: preserveNumericCode(taxInvoiceApiResponse.closeDownState),
    businessStatusDate: taxInvoiceApiResponse.closeDownStateDate,
  })
}

/**
 * 수탁자 응답 필드를 도메인 수탁자 정보로 변환합니다.
 */
function mapTrusteeOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoicePartyOutput | undefined {
  return compactOptionalObject({
    businessNumber: taxInvoiceApiResponse.trusteeCorpNum,
    managementKey: taxInvoiceApiResponse.trusteeMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.trusteeTaxRegID,
    residentRegistrationNumber: taxInvoiceApiResponse.trusteeRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.trusteeOLN,
    branchBusinessNumber: taxInvoiceApiResponse.trusteeTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.trusteePSerialNum,
    corporationClassification: taxInvoiceApiResponse.trusteeCorpCls,
    companyName: taxInvoiceApiResponse.trusteeCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.trusteeCEOName,
    address: taxInvoiceApiResponse.trusteeAddr,
    businessType: taxInvoiceApiResponse.trusteeBizType,
    businessClass: taxInvoiceApiResponse.trusteeBizClass,
    departmentName: taxInvoiceApiResponse.trusteeDeptName,
    contactName: taxInvoiceApiResponse.trusteeContactName,
    telephoneNumber: taxInvoiceApiResponse.trusteeTEL,
    mobilePhoneNumber: taxInvoiceApiResponse.trusteeHP,
    emailAddress: taxInvoiceApiResponse.trusteeEmail,
    sendTextMessage: preserveBooleanResponse(taxInvoiceApiResponse.trusteeSMSSendYN),
    printEnabled: preserveBooleanResponse(taxInvoiceApiResponse.trusteePrintYN),
  })
}

/**
 * 모든 필드가 비어있으면 `undefined`를 반환하고, 아니면 정리된 객체를 반환합니다.
 */
function compactOptionalObject<T extends Record<string, unknown>>(sourceObject: T): T | undefined {
  const normalizedObject = removeUndefinedProperties(sourceObject)
  return Object.keys(normalizedObject).length === 0 ? undefined : normalizedObject
}

/**
 * 객체에서 `undefined` 값만 제거합니다.
 */
function removeUndefinedProperties<T extends Record<string, unknown>>(sourceObject: T): T {
  const definedEntries = Object.entries(sourceObject).filter(([, value]) => value !== undefined)
  return Object.fromEntries(definedEntries) as T
}
