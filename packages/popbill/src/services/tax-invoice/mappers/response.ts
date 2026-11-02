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
  TaxInvoiceChargeInfo,
  TaxInvoiceDocumentOutput,
  TaxInvoiceEmailPublicKeys,
  TaxInvoiceEmailSendSetting,
  TaxInvoiceInfo,
  TaxInvoiceInvoiceManagementKeyUsage,
  TaxInvoiceIssueResult,
  TaxInvoiceLogEntry,
  TaxInvoiceOperationResult,
  TaxInvoicePartyInput,
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
    submittedDocumentCount: toOptionalNumber(taxInvoiceApiResponse.submitCount),
    succeededDocumentCount: toOptionalNumber(taxInvoiceApiResponse.successCount),
    failedDocumentCount: toOptionalNumber(taxInvoiceApiResponse.failCount),
    transactionState: toTaxInvoiceBulkIssueSubmissionTransactionState(taxInvoiceApiResponse.txState),
    transactionResultCode: toOptionalNumber(taxInvoiceApiResponse.txResultCode),
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
    chargeDirection: toTaxInvoiceChargeDirection(taxInvoiceApiResponse.chargeDirection),
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
      modificationReasonCode: taxInvoiceApiResponse.modifyCode,
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
    writeSpecificationEnabled: taxInvoiceApiResponse.writeSpecification,
    includeBusinessLicenseImage: toOptionalBoolean(taxInvoiceApiResponse.businessLicenseYN),
    includeBankBookImage: toOptionalBoolean(taxInvoiceApiResponse.bankBookYN),
    nationalTaxServiceConfirmationNumber: taxInvoiceApiResponse.ntsconfirmNum,
    stateCode: toOptionalNumber(taxInvoiceApiResponse.stateCode),
    nationalTaxServiceResultCode: taxInvoiceApiResponse.ntsresult,
    nationalTaxServiceSendErrorCode: taxInvoiceApiResponse.ntssendErrCode,
    isLateIssued: toOptionalBoolean(taxInvoiceApiResponse.lateIssueYN),
    isOpen: toOptionalBoolean(taxInvoiceApiResponse.openYN),
    isApiLinkedDocument: toOptionalBoolean(taxInvoiceApiResponse.interOPYN),
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
    pageNumber: toOptionalNumber(taxInvoiceApiResponse.pageNum),
    pageSize: toOptionalNumber(taxInvoiceApiResponse.perPage),
    pageCount: toOptionalNumber(taxInvoiceApiResponse.pageCount),
    totalCount: toOptionalNumber(taxInvoiceApiResponse.total),
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
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.invoicerSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.invoicerPrintYN),
  })
}

/**
 * 공급받는자 응답 필드를 도메인 공급받는자 정보로 변환합니다.
 */
function mapBuyerOutput(taxInvoiceApiResponse: Spec.TaxInvoiceApiModel): TaxInvoiceBuyerInput | undefined {
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
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.invoiceeSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.invoiceePrintYN),
    recipientType: taxInvoiceApiResponse.invoiceeType,
    primaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName1,
    secondaryDepartmentName: taxInvoiceApiResponse.invoiceeDeptName2,
    secondaryContactName: taxInvoiceApiResponse.invoiceeContactName2,
    secondaryTelephoneNumber: taxInvoiceApiResponse.invoiceeTEL2,
    secondaryMobilePhoneNumber: taxInvoiceApiResponse.invoiceeHP2,
    secondaryEmailAddress: taxInvoiceApiResponse.invoiceeEmail2,
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
    sendTextMessage: toOptionalBoolean(taxInvoiceApiResponse.trusteeSMSSendYN),
    printEnabled: toOptionalBoolean(taxInvoiceApiResponse.trusteePrintYN),
  })
}

/**
 * 문자열/숫자 값을 숫자로 안전하게 변환합니다.
 */
function toOptionalNumber(value: number | string | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return undefined
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
 * 초대량 처리 상태를 숫자로 정규화하며 새 서버 상태코드도 보존합니다.
 */
function toTaxInvoiceBulkIssueSubmissionTransactionState(
  value: number | string | undefined
): TaxInvoiceBulkIssueSubmissionTransactionState | undefined {
  const transactionState = toOptionalNumber(value)
  return transactionState !== undefined && Number.isInteger(transactionState) && transactionState >= 0 ? transactionState : undefined
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
