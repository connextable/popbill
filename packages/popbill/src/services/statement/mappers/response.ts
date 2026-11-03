import type * as Spec from '@connextable/popbill-spec'
import type * as Types from '../types'
import { preserveNumericCode } from '@/internal/collection-state'
import { optionalResponseNumber, preserveBooleanResponse } from '@/internal/response'
import { ADDITIONAL_FIELD_NUMBERS, removeUndefinedProperties } from './document'
import { mapStatementInfo } from './statement-info'

export function mapStatementOperationResult(response: Spec.StatementApiResponseBase): Types.StatementOperationResult {
  return { resultCode: preserveNumericCode(response.code), resultMessage: response.message }
}

export function mapStatementIssueResult(response: Spec.StatementRegistIssueApiResponse): Types.StatementIssueResult {
  return removeUndefinedProperties({
    ...mapStatementOperationResult(response),
    documentNumber: response.invoiceNum,
    issuedAt: response.issueDT,
  })
}

export function mapStatementDocumentOutput(response: Spec.StatementGetDetailInfoApiResponse): Types.StatementDocumentOutput {
  return removeUndefinedProperties({
    documentTypeCode: preserveNumericCode(response.itemCode),
    managementKey: response.mgtKey,
    documentNumber: response.invoiceNum,
    documentSerialNumber: response.serialNum,
    formCode: response.formCode,
    writtenDate: response.writeDate,
    taxType: response.taxType,
    purposeType: response.purposeType,
    sender: compactOptionalObject({
      businessNumber: response.senderCorpNum,
      taxRegistrationIdentifier: response.senderTaxRegID,
      companyName: response.senderCorpName,
      chiefExecutiveOfficerName: response.senderCEOName,
      address: response.senderAddr,
      businessType: response.senderBizType,
      businessClass: response.senderBizClass,
      departmentName: response.senderDeptName,
      contactName: response.senderContactName,
      telephoneNumber: response.senderTEL,
      mobilePhoneNumber: response.senderHP,
      emailAddress: response.senderEmail,
      faxNumber: response.senderFAX,
    }),
    receiver: compactOptionalObject({
      businessNumber: response.receiverCorpNum,
      taxRegistrationIdentifier: response.receiverTaxRegID,
      companyName: response.receiverCorpName,
      chiefExecutiveOfficerName: response.receiverCEOName,
      address: response.receiverAddr,
      businessType: response.receiverBizType,
      businessClass: response.receiverBizClass,
      departmentName: response.receiverDeptName,
      contactName: response.receiverContactName,
      telephoneNumber: response.receiverTEL,
      mobilePhoneNumber: response.receiverHP,
      emailAddress: response.receiverEmail,
      faxNumber: response.receiverFAX,
    }),
    paymentSummary: compactOptionalObject({
      totalSupplyCostAmount: response.supplyCostTotal,
      totalTaxAmount: response.taxTotal,
      totalAmount: response.totalAmount,
    }),
    lineItems: response.detailList?.map((item) =>
      removeUndefinedProperties({
        lineNumber: optionalResponseNumber(item.serialNum),
        transactionDate: item.purchaseDT,
        itemName: item.itemName,
        specification: item.spec,
        quantity: item.qty,
        unitCostAmount: item.unitCost,
        supplyCostAmount: item.supplyCost,
        taxAmount: item.tax,
        remark: item.remark,
        additionalFields: mapAdditionalFields(item),
      })
    ),
    remarkOne: response.remark1,
    remarkTwo: response.remark2,
    remarkThree: response.remark3,
    propertyBag: response.propertyBag === undefined ? undefined : { ...response.propertyBag },
    includeBusinessLicenseImage: preserveBooleanResponse(response.businessLicenseYN),
    includeBankBookImage: preserveBooleanResponse(response.bankBookYN),
    sendTextMessage: preserveBooleanResponse(response.smssendYN),
    autoAcceptEnabled: preserveBooleanResponse(response.autoAcceptYN),
    sendFAXEnabled: preserveBooleanResponse(response.faxsendYN),
  })
}

export function mapStatementSearchResult(response: Spec.StatementSearchApiResponse): Types.StatementSearchResult {
  return removeUndefinedProperties({
    operationResult: mapStatementOperationResult(response),
    pageNumber: optionalResponseNumber(response.pageNum),
    pageSize: optionalResponseNumber(response.perPage),
    pageCount: optionalResponseNumber(response.pageCount),
    totalCount: optionalResponseNumber(response.total),
    statementSummaries: (response.list ?? []).map(mapStatementInfo),
  })
}

export function mapStatementLog(response: Spec.StatementLog): Types.StatementLogEntry {
  return removeUndefinedProperties({
    documentLogTypeCode: preserveNumericCode(response.docLogType),
    logMessage: response.log,
    processTypeCode: response.procType,
    processCompanyName: response.procCorpName,
    processContactName: response.procContactName,
    processDescription: response.procMemo,
    registeredAt: response.regDT,
    ipAddress: response.ip,
  })
}

export function mapStatementAccessUrl(accessUrl: string): Types.StatementAccessUrl {
  return { accessUrl }
}

export function mapStatementAttachedFile(response: Spec.StatementFile): Types.StatementAttachedFile {
  return removeUndefinedProperties({
    sequenceNumber: optionalResponseNumber(response.serialNum),
    fileIdentifier: response.attachedFile,
    fileSize: optionalResponseNumber(response.fileSize),
    displayName: response.displayName,
    registeredAt: response.regDT,
  })
}

export function mapStatementEmailSendSetting(response: Spec.StatementEmailConfig): Types.StatementEmailSendSetting {
  return removeUndefinedProperties({ emailTypeCode: response.emailType, sendEnabled: preserveBooleanResponse(response.sendYN) })
}

export function mapStatementChargeInfo(response: Spec.StatementChargeInfo): Types.StatementChargeInfo {
  return removeUndefinedProperties({ unitCost: response.unitCost, chargeMethod: response.chargeMethod, rateSystem: response.rateSystem })
}

function mapAdditionalFields(item: Spec.StatementDetailApiModel): Types.StatementLineItemInput['additionalFields'] {
  const mapped: NonNullable<Types.StatementLineItemInput['additionalFields']> = {}
  for (const number of ADDITIONAL_FIELD_NUMBERS) {
    const value = item[`spare${number}`]
    if (value !== undefined) mapped[number] = value
  }
  return Object.keys(mapped).length > 0 ? mapped : undefined
}

function compactOptionalObject<T extends Record<string, unknown>>(source: T): T | undefined {
  const compacted = removeUndefinedProperties(source)
  return Object.keys(compacted).length > 0 ? compacted : undefined
}
