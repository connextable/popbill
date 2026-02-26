import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '@connextable/popbill-spec'
import {
  validateRequiredTaxinvoiceInputs,
  validateTaxinvoiceKeyTypeAllowed,
} from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestRequest(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  memo: string,
  userId: string
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)
  validateTaxinvoiceKeyTypeAllowed(keyType, ['BUY'])

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'REQUEST',
    body: stringifyWithoutEmptyValues({ memo }),
  })
}
