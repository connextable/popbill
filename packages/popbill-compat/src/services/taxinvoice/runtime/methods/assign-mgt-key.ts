import { validateCorpNum, validateItemKey, validateMgtKey, validateTaxInvoiceKeyType } from '@/internal/validation'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAssignMgtKey(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: Spec.TaxInvoiceMgtKeyType,
  itemKey: string,
  mgtKey: string,
  userId: string
): Promise<Spec.TaxInvoiceApiResponseBase> {
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

  return context.requestClient.requestJson<Spec.TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${itemKey}/${keyType}`,
    corpNum,
    userId,
    method: 'POST',
    body: `MgtKey=${encodeURIComponent(mgtKey)}`,
    contentType: 'application/x-www-form-urlencoded; charset=utf-8',
  })
}
