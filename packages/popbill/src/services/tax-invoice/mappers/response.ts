import { toBoolean } from '@connextable/popbill-utils'
import { mapTaxInvoiceInfo } from './invoice-info'
import { TaxInvoiceChargeDirectionValues } from '@/services/tax-invoice/types'
import type {
  TaxInvoiceAccessUrl,
  TaxInvoiceAttachedFile,
  TaxInvoiceBulkIssueSubmissionResult,
  TaxInvoiceBulkIssueSubmissionResultItem,
  TaxInvoiceBulkIssueSubmissionTransactionState,
  TaxInvoiceBulkSubmitResult,
  TaxInvoiceBuyerInput,
  TaxInvoiceChargeDirection,
  TaxInvoiceDocumentOutput,
  TaxInvoiceEmailSendSetting,
  TaxInvoiceInfo,
  TaxInvoiceInvoiceManagementKeyUsage,
  TaxInvoiceIssueResult,
  TaxInvoiceLogEntry,
  TaxInvoiceOperationResult,
  TaxInvoicePartyInput,
  TaxInvoiceSearchResult,
  TaxInvoiceSendToNationalTaxServiceSetting,
  TaxInvoiceTaxCertificateExpiration,
  TaxInvoiceTaxCertificateInfo,
  TaxInvoiceXmlResult,
} from '@/services/tax-invoice/types'
import type * as Spec from '@connextable/popbill-spec'

/**
 * 공통 API 처리결과를 도메인 처리결과로 변환합니다.
 */
export function mapTaxInvoiceOperationResult(
  taxInvoiceApiResponse: Spec.TaxInvoiceApiResponseBase | { code: number | string; message: string }
): TaxInvoiceOperationResult {
  return {
    resultCode: toRequiredNumber(taxInvoiceApiResponse.code, 'code'),
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
    issuedAt: taxInvoiceApiResponse.issueDT,
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
    receiptIdentifier: taxInvoiceApiResponse.receiptID,
    submissionIdentifier: taxInvoiceApiResponse.submitID,
    submittedDocumentCount: toOptionalNumber(taxInvoiceApiResponse.submitCount),
    succeededDocumentCount: toOptionalNumber(taxInvoiceApiResponse.successCount),
    failedDocumentCount: toOptionalNumber(taxInvoiceApiResponse.failCount),
    transactionState: toOptionalNumber(taxInvoiceApiResponse.txState) as TaxInvoiceBulkIssueSubmissionTransactionState | undefined,
    transactionStartedAt: taxInvoiceApiResponse.txStartDT,
    transactionCompletedAt: taxInvoiceApiResponse.txEndDT,
    transactionResultCode: toOptionalNumber(taxInvoiceApiResponse.txResultCode),
    issueResults: taxInvoiceApiResponse.issueResult?.map(mapTaxInvoiceBulkIssueSubmissionResultItem),
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
    writeSpecificationEnabled: taxInvoiceApiResponse.writeSpecification,
    writtenDate: taxInvoiceApiResponse.writeDate,
    chargeDirection: toTaxInvoiceChargeDirection(taxInvoiceApiResponse.chargeDirection),
    issueType: taxInvoiceApiResponse.issueType,
    purposeType: taxInvoiceApiResponse.purposeType,
    issueTimingCode: taxInvoiceApiResponse.issueTiming,
    taxType: taxInvoiceApiResponse.taxType,
    supplier: mapSupplierOutput(taxInvoiceApiResponse),
    buyer: mapBuyerOutput(taxInvoiceApiResponse),
    trustee: mapTrusteeOutput(taxInvoiceApiResponse),
    paymentSummary: removeUndefinedProperties({
      totalTaxAmount: taxInvoiceApiResponse.taxTotal,
      totalSupplyCostAmount: taxInvoiceApiResponse.supplyCostTotal,
      totalAmount: taxInvoiceApiResponse.totalAmount,
      cashAmount: taxInvoiceApiResponse.cash,
      checkAmount: taxInvoiceApiResponse.chkBill,
      promissoryNoteAmount: taxInvoiceApiResponse.note,
      creditAmount: taxInvoiceApiResponse.credit,
    }),
    modification: removeUndefinedProperties({
      modificationReasonCode: taxInvoiceApiResponse.modifyCode,
      originalNationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.orgNTSConfirmNum,
    }),
    taxInvoiceSerialNumber: taxInvoiceApiResponse.serialNum,
    remarkOne: taxInvoiceApiResponse.remark1,
    remarkTwo: taxInvoiceApiResponse.remark2,
    remarkThree: taxInvoiceApiResponse.remark3,
    bookVolumeNumber: taxInvoiceApiResponse.kwon,
    bookIssueNumber: taxInvoiceApiResponse.ho,
    includeBusinessLicenseImage: toOptionalBoolean(taxInvoiceApiResponse.businessLicenseYN),
    includeBankBookImage: toOptionalBoolean(taxInvoiceApiResponse.bankBookYN),
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
    issuedAt: taxInvoiceApiResponse.issueDT,
    stateCode: toOptionalNumber(taxInvoiceApiResponse.stateCode),
    stateChangedAt: taxInvoiceApiResponse.stateDT,
    isLateIssued: toOptionalBoolean(taxInvoiceApiResponse.lateIssueYN),
    isOpen: toOptionalBoolean(taxInvoiceApiResponse.openYN),
    openedAt: taxInvoiceApiResponse.openDT,
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsconfirmNum,
    nationalTaxServiceResultCode: taxInvoiceApiResponse.ntsresult,
    nationalTaxServiceSentAt: taxInvoiceApiResponse.ntssendDT,
    nationalTaxServiceResultReceivedAt: taxInvoiceApiResponse.ntsresultDT,
    nationalTaxServiceSendErrorCode: taxInvoiceApiResponse.ntssendErrCode,
    isApiLinkedDocument: toOptionalBoolean(taxInvoiceApiResponse.interOPYN),
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

/**
 * 검색 응답을 도메인 검색 결과로 변환합니다.
 */
export function mapTaxInvoiceSearchResult(taxInvoiceApiResponse: Spec.TaxInvoiceSearchApiResponse): TaxInvoiceSearchResult {
  return removeUndefinedProperties({
    operationResult: mapTaxInvoiceOperationResult(taxInvoiceApiResponse),
    totalCount: toOptionalNumber(taxInvoiceApiResponse.total),
    pageSize: toOptionalNumber(taxInvoiceApiResponse.perPage),
    pageNumber: toOptionalNumber(taxInvoiceApiResponse.pageNum),
    pageCount: toOptionalNumber(taxInvoiceApiResponse.pageCount),
    invoiceSummaries: (taxInvoiceApiResponse.list ?? []).map(mapTaxInvoiceInfo),
  })
}

/**
 * 문서 로그 응답을 도메인 로그 목록으로 변환합니다.
 */
export function mapTaxInvoiceLogs(taxInvoiceApiResponse: Spec.TaxInvoiceGetLogsApiResponse): TaxInvoiceLogEntry[] {
  return taxInvoiceApiResponse.map((logEntry) =>
    removeUndefinedProperties({
      documentLogTypeCode: toOptionalNumber(logEntry.docLogType),
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
      sendEnabled: toOptionalBoolean(emailSendSetting.sendYN),
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
    sendToNationalTaxServiceEnabled: toBoolean(taxInvoiceApiResponse.sendToNTS),
  }
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
    registeredAt: taxInvoiceApiResponse.regDT,
    expiredAt: taxInvoiceApiResponse.expireDT,
    issuerDistinguishedName: taxInvoiceApiResponse.issuerDN,
    subjectDistinguishedName: taxInvoiceApiResponse.subjectDN,
    issuerName: taxInvoiceApiResponse.issuerName,
    policyObjectIdentifier: taxInvoiceApiResponse.OID,
    registeredContactName: taxInvoiceApiResponse.regContactName,
    registeredContactIdentifier: taxInvoiceApiResponse.regContactID,
  })
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
    resultCode: toOptionalNumber(taxInvoiceApiResponse.code),
    resultMessage: taxInvoiceApiResponse.message,
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsconfirmNum,
    receivedAt: taxInvoiceApiResponse.receiptDT,
    issuedAt: taxInvoiceApiResponse.issueDT,
  })
}

/**
 * 공급자 응답 필드를 도메인 공급자 정보로 변환합니다.
 */
function mapSupplierOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoicePartyInput | undefined {
  return compactOptionalObject({
    businessNumber: taxInvoiceApiResponse.invoicerCorpNum,
    managementKey: taxInvoiceApiResponse.invoicerMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.invoicerTaxRegID,
    companyName: taxInvoiceApiResponse.invoicerCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.invoicerCEOName,
    address: taxInvoiceApiResponse.invoicerAddr,
    businessClass: taxInvoiceApiResponse.invoicerBizClass,
    businessType: taxInvoiceApiResponse.invoicerBizType,
    contactName: taxInvoiceApiResponse.invoicerContactName,
    telephoneNumber: taxInvoiceApiResponse.invoicerTEL,
    mobilePhoneNumber: taxInvoiceApiResponse.invoicerHP,
    emailAddress: taxInvoiceApiResponse.invoicerEmail,
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.invoicerSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.invoicerPrintYN),
    residentRegistrationNumber: taxInvoiceApiResponse.invoicerRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.invoicerOLN,
    branchBusinessNumber: taxInvoiceApiResponse.invoicerTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.invoicerPSerialNum,
    corporationClassification: taxInvoiceApiResponse.invoicerCorpCls,
    departmentName: taxInvoiceApiResponse.invoicerDeptName,
  })
}

/**
 * 공급받는자 응답 필드를 도메인 공급받는자 정보로 변환합니다.
 */
function mapBuyerOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoiceBuyerInput | undefined {
  return compactOptionalObject({
    recipientType: taxInvoiceApiResponse.invoiceeType,
    businessNumber: taxInvoiceApiResponse.invoiceeCorpNum,
    managementKey: taxInvoiceApiResponse.invoiceeMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.invoiceeTaxRegID,
    companyName: taxInvoiceApiResponse.invoiceeCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.invoiceeCEOName,
    address: taxInvoiceApiResponse.invoiceeAddr,
    businessClass: taxInvoiceApiResponse.invoiceeBizClass,
    businessType: taxInvoiceApiResponse.invoiceeBizType,
    contactName: taxInvoiceApiResponse.invoiceeContactName1,
    telephoneNumber: taxInvoiceApiResponse.invoiceeTEL1,
    mobilePhoneNumber: taxInvoiceApiResponse.invoiceeHP1,
    emailAddress: taxInvoiceApiResponse.invoiceeEmail1,
    secondaryContactName: taxInvoiceApiResponse.invoiceeContactName2,
    secondaryTelephoneNumber: taxInvoiceApiResponse.invoiceeTEL2,
    secondaryMobilePhoneNumber: taxInvoiceApiResponse.invoiceeHP2,
    secondaryEmailAddress: taxInvoiceApiResponse.invoiceeEmail2,
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.invoiceeSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.invoiceePrintYN),
    residentRegistrationNumber: taxInvoiceApiResponse.invoiceeRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.invoiceeOLN,
    branchBusinessNumber: taxInvoiceApiResponse.invoiceeTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.invoiceePSerialNum,
    corporationClassification: taxInvoiceApiResponse.invoiceeCorpCls,
    departmentName: taxInvoiceApiResponse.invoiceeDeptName1,
    primaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName1,
    secondaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName2,
    businessStatus: taxInvoiceApiResponse.closeDownState,
    businessStatusDate: taxInvoiceApiResponse.closeDownStateDate,
  })
}

/**
 * 수탁자 응답 필드를 도메인 수탁자 정보로 변환합니다.
 */
function mapTrusteeOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoicePartyInput | undefined {
  return compactOptionalObject({
    businessNumber: taxInvoiceApiResponse.trusteeCorpNum,
    managementKey: taxInvoiceApiResponse.trusteeMgtKey,
    taxRegistrationIdentifier: taxInvoiceApiResponse.trusteeTaxRegID,
    companyName: taxInvoiceApiResponse.trusteeCorpName,
    chiefExecutiveOfficerName: taxInvoiceApiResponse.trusteeCEOName,
    address: taxInvoiceApiResponse.trusteeAddr,
    businessClass: taxInvoiceApiResponse.trusteeBizClass,
    businessType: taxInvoiceApiResponse.trusteeBizType,
    contactName: taxInvoiceApiResponse.trusteeContactName,
    telephoneNumber: taxInvoiceApiResponse.trusteeTEL,
    mobilePhoneNumber: taxInvoiceApiResponse.trusteeHP,
    emailAddress: taxInvoiceApiResponse.trusteeEmail,
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.trusteeSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.trusteePrintYN),
    residentRegistrationNumber: taxInvoiceApiResponse.trusteeRDN,
    foreignerRegistrationNumber: taxInvoiceApiResponse.trusteeOLN,
    branchBusinessNumber: taxInvoiceApiResponse.trusteeTaxNum,
    branchSerialNumber: taxInvoiceApiResponse.trusteePSerialNum,
    corporationClassification: taxInvoiceApiResponse.trusteeCorpCls,
    departmentName: taxInvoiceApiResponse.trusteeDeptName,
  })
}

/**
 * 문자열/숫자 값을 숫자로 안전하게 변환합니다.
 */
function toOptionalNumber(value: number | string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  const normalizedNumber = Number(value)
  return Number.isFinite(normalizedNumber) ? normalizedNumber : undefined
}

function toRequiredNumber(value: number | string | undefined, fieldName: string): number {
  const normalizedNumber = toOptionalNumber(value)
  if (normalizedNumber !== undefined) {
    return normalizedNumber
  }

  throw new Error(`유효하지 않은 ${fieldName} 응답값입니다. (${String(value)})`)
}

/**
 * 불리언 문자열/값을 불리언으로 안전하게 변환합니다.
 */
function toOptionalBoolean(value: boolean | string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined
  }

  return toBoolean(value)
}

/**
 * 과금 방향 문자열을 도메인 과금 방향으로 안전하게 정규화합니다.
 */
function toTaxInvoiceChargeDirection(chargeDirection: string | undefined): TaxInvoiceChargeDirection | undefined {
  if (chargeDirection === TaxInvoiceChargeDirectionValues.NormalCharge) {
    return TaxInvoiceChargeDirectionValues.NormalCharge
  }

  if (chargeDirection === TaxInvoiceChargeDirectionValues.ReverseCharge) {
    return TaxInvoiceChargeDirectionValues.ReverseCharge
  }

  return undefined
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
