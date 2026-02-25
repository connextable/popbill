import type {
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateItemKey,
  validateMgtKey,
  validateTaxInvoiceKeyType,
} from '../../../../internal/validation'
import { validateCorpNum } from '../../../../internal/validation'
import type { TaxinvoiceRuntimeContext } from '../context'

export async function requestAssignMgtKey(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  itemKey: string,
  mgtKey: string,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  const corpNumError = validateCorpNum(corpNum)
  if (corpNumError) {
    throw corpNumError
  }

  const keyTypeError = validateTaxInvoiceKeyType(keyType)
  if (keyTypeError) {
    throw keyTypeError
  }

  const itemKeyError = validateItemKey(itemKey)
  if (itemKeyError) {
    throw itemKeyError
  }

  const mgtKeyError = validateMgtKey(mgtKey)
  if (mgtKeyError) {
    throw mgtKeyError
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${itemKey}/${keyType}`,
    corpNum,
    userId,
    method: 'POST',
    body: `MgtKey=${encodeURIComponent(mgtKey)}`,
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  })
}
