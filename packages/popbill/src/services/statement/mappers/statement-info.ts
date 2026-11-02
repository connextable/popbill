import type * as Spec from '@connextable/popbill-spec'
import type { StatementInfo } from '../types'
import { removeUndefinedProperties } from './document'

/** compat `getInfo` 응답을 modern StatementInfo로 변환합니다. */
export function mapStatementInfo(response: Spec.StatementInfo): StatementInfo {
  return removeUndefinedProperties({
    documentTypeCode: response.itemCode,
    itemKey: response.itemKey,
    documentNumber: response.invoiceNum,
    managementKey: response.mgtKey,
    taxType: response.taxType,
    purposeType: response.purposeType,
    sender: compactOptionalObject({
      businessNumber: response.senderCorpNum,
      companyName: response.senderCorpName,
      printEnabled: toOptionalBoolean(response.senderPrintYN),
    }),
    receiver: compactOptionalObject({
      businessNumber: response.receiverCorpNum,
      companyName: response.receiverCorpName,
      printEnabled: toOptionalBoolean(response.receiverPrintYN),
    }),
    totalSupplyCostAmount: response.supplyCostTotal,
    totalTaxAmount: response.taxTotal,
    stateCode: toOptionalNumber(response.stateCode),
    stateMemo: response.stateMemo,
    isOpen: toOptionalBoolean(response.openYN),
    writtenDate: response.writeDate,
    registeredAt: response.regDT,
    issuedAt: response.issueDT,
    stateChangedAt: response.stateDT,
    openedAt: response.openDT,
  })
}

function compactOptionalObject<T extends Record<string, unknown>>(source: T): T | undefined {
  const compacted = removeUndefinedProperties(source)
  return Object.keys(compacted).length > 0 ? compacted : undefined
}

function toOptionalNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || (typeof value === 'string' && value.trim() === '')) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function toOptionalBoolean(value: boolean | string | undefined): boolean | undefined {
  if (value === undefined) return undefined
  return value === true || value === 'true'
}
