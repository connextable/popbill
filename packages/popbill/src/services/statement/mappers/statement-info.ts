import type * as Spec from '@connextable/popbill-spec'
import type { StatementInfo } from '../types'
import { compactOptionalObject, preserveBooleanResponse, preserveNumericCode, removeUndefinedProperties } from '@connextable/popbill-utils'

/** compat `getInfo` 응답을 modern StatementInfo로 변환합니다. */
export function mapStatementInfo(response: Spec.StatementInfo): StatementInfo {
  return removeUndefinedProperties({
    documentTypeCode: preserveNumericCode(response.itemCode),
    itemKey: response.itemKey,
    documentNumber: response.invoiceNum,
    managementKey: response.mgtKey,
    taxType: response.taxType,
    purposeType: response.purposeType,
    sender: compactOptionalObject({
      businessNumber: response.senderCorpNum,
      companyName: response.senderCorpName,
      printEnabled: preserveBooleanResponse(response.senderPrintYN),
    }),
    receiver: compactOptionalObject({
      businessNumber: response.receiverCorpNum,
      companyName: response.receiverCorpName,
      printEnabled: preserveBooleanResponse(response.receiverPrintYN),
    }),
    totalSupplyCostAmount: response.supplyCostTotal,
    totalTaxAmount: response.taxTotal,
    stateCode: preserveNumericCode(response.stateCode),
    stateMemo: response.stateMemo,
    isOpen: preserveBooleanResponse(response.openYN),
    writtenDate: response.writeDate,
    registeredAt: response.regDT,
    issuedAt: response.issueDT,
    stateChangedAt: response.stateDT,
    openedAt: response.openDT,
  })
}
