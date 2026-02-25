import { stringifyWithoutEmptyValues } from '@connextable/popbill-core'
import type {
  TaxInvoiceApiModel,
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
} from '@connextable/popbill-spec'
import {
  validateTaxinvoicePayload,
} from '@/internal/validation'
import { validateRequiredTaxinvoiceInputs } from '@/services/taxinvoice/runtime/common'
import type { TaxinvoiceRuntimeContext } from '@/services/taxinvoice/runtime/context'

export async function requestUpdate(
  context: TaxinvoiceRuntimeContext,
  corpNum: string,
  keyType: TaxInvoiceMgtKeyType,
  mgtKey: string,
  taxinvoice: TaxInvoiceApiModel,
  userId: string,
): Promise<TaxInvoiceApiResponseBase> {
  validateRequiredTaxinvoiceInputs(corpNum, keyType, mgtKey)

  const taxinvoiceError = validateTaxinvoicePayload(taxinvoice)
  if (taxinvoiceError) {
    throw taxinvoiceError
  }

  return context.requestClient.requestJson<TaxInvoiceApiResponseBase>({
    uri: `/Taxinvoice/${keyType}/${mgtKey}`,
    corpNum,
    userId,
    method: 'PATCH',
    body: stringifyWithoutEmptyValues(taxinvoice),
  })
}
