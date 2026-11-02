import type * as Spec from '@connextable/popbill-spec'
import type { StatementAdditionalFieldNumber, StatementDocumentInput, StatementLineItemInput } from '../types'

export const ADDITIONAL_FIELD_NUMBERS: readonly StatementAdditionalFieldNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]

/** 금액 문자열과 추가 속성을 유지하면서 API 문서로 변환합니다. */
export function mapStatementDocument(document: StatementDocumentInput): Spec.StatementApiModel {
  return removeUndefinedProperties({
    itemCode: document.documentTypeCode,
    mgtKey: document.managementKey,
    formCode: document.formCode,
    writeDate: document.writtenDate,
    taxType: document.taxType,
    purposeType: document.purposeType,
    serialNum: document.documentSerialNumber,
    taxTotal: document.paymentSummary?.totalTaxAmount,
    supplyCostTotal: document.paymentSummary?.totalSupplyCostAmount,
    totalAmount: document.paymentSummary?.totalAmount,
    remark1: document.remarkOne,
    remark2: document.remarkTwo,
    remark3: document.remarkThree,
    senderCorpNum: document.sender?.businessNumber,
    senderTaxRegID: document.sender?.taxRegistrationIdentifier,
    senderCorpName: document.sender?.companyName,
    senderCEOName: document.sender?.chiefExecutiveOfficerName,
    senderAddr: document.sender?.address,
    senderBizType: document.sender?.businessType,
    senderBizClass: document.sender?.businessClass,
    senderContactName: document.sender?.contactName,
    senderDeptName: document.sender?.departmentName,
    senderTEL: document.sender?.telephoneNumber,
    senderHP: document.sender?.mobilePhoneNumber,
    senderEmail: document.sender?.emailAddress,
    senderFAX: document.sender?.faxNumber,
    receiverCorpNum: document.receiver?.businessNumber,
    receiverTaxRegID: document.receiver?.taxRegistrationIdentifier,
    receiverCorpName: document.receiver?.companyName,
    receiverCEOName: document.receiver?.chiefExecutiveOfficerName,
    receiverAddr: document.receiver?.address,
    receiverBizType: document.receiver?.businessType,
    receiverBizClass: document.receiver?.businessClass,
    receiverContactName: document.receiver?.contactName,
    receiverDeptName: document.receiver?.departmentName,
    receiverTEL: document.receiver?.telephoneNumber,
    receiverHP: document.receiver?.mobilePhoneNumber,
    receiverEmail: document.receiver?.emailAddress,
    receiverFAX: document.receiver?.faxNumber,
    businessLicenseYN: document.includeBusinessLicenseImage,
    bankBookYN: document.includeBankBookImage,
    smssendYN: document.sendTextMessage,
    propertyBag: document.propertyBag === undefined ? undefined : { ...document.propertyBag },
    detailList: document.lineItems?.map(mapLineItem),
  })
}

function mapLineItem(item: StatementLineItemInput): Spec.StatementDetailApiModel {
  const mapped: Spec.StatementDetailApiModel = removeUndefinedProperties({
    serialNum: item.lineNumber,
    purchaseDT: item.transactionDate,
    itemName: item.itemName,
    spec: item.specification,
    qty: item.quantity,
    unitCost: item.unitCostAmount,
    supplyCost: item.supplyCostAmount,
    tax: item.taxAmount,
    remark: item.remark,
  })
  for (const number of ADDITIONAL_FIELD_NUMBERS) {
    const value = item.additionalFields?.[number]
    if (value !== undefined) mapped[`spare${number}`] = value
  }
  return mapped
}

export function removeUndefinedProperties<T extends Record<string, unknown>>(source: T): T {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined)) as T
}
